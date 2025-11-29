import { QueryOptionsType, Product } from "@framework/types";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { useInfiniteQuery } from "react-query";
type PaginatedProduct = {
	data: Product[];
	paginatorInfo: any;
};
export const fetchProducts = async ({ queryKey, pageParam = 1 }: any) => {
	const [_key, _params] = queryKey;
	try {
		const limit = _params?.limit || 10;
		const { data: resp } = await http.get(API_ENDPOINTS.PRODUCTS, {
			params: { ..._params, page: pageParam, limit },
		});
		// Support both new paginated shape and legacy array
		const serverPaginator = resp?.paginatorInfo;
		const serverData = Array.isArray(resp) ? resp : (resp?.data ?? []);
		const allProducts = serverData;

		let filtered = allProducts.slice();

		// Client-side filtering for Price (if needed) and Sorting
		// Note: Category and Brand filtering is now handled server-side

		if (_params?.price) {
			const [minStr, maxStr] = String(_params.price).split("-");
			const min = Number(minStr || 0);
			const max = maxStr === "" || maxStr === undefined ? Number.MAX_SAFE_INTEGER : Number(maxStr);
			filtered = filtered.filter((p: any) => {
				const price = Number(p.sale_price ?? p.price) || 0;
				return price >= min && price <= max;
			});
		}

		const sortBy = String(_params?.sort_by || "");
		if (sortBy) {
			switch (sortBy) {
				case "best-selling":
					filtered.sort((a: any, b: any) => (b.quantity || 0) - (a.quantity || 0));
					break;
				case "az":
					filtered.sort((a: any, b: any) => String(a.name).localeCompare(String(b.name)));
					break;
				case "za":
					filtered.sort((a: any, b: any) => String(b.name).localeCompare(String(a.name)));
					break;
				case "low-high":
					filtered.sort(
						(a: any, b: any) => (Number(a.sale_price ?? a.price) || 0) - (Number(b.sale_price ?? b.price) || 0)
					);
					break;
				case "high-low":
					filtered.sort(
						(a: any, b: any) => (Number(b.sale_price ?? b.price) || 0) - (Number(a.sale_price ?? a.price) || 0)
					);
					break;
				case "old-new":
					filtered.sort(
						(a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
					);
					break;
				case "new-old":
					filtered.sort(
						(a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
					);
					break;
				default:
					break;
			}
		}

		// If server provided paginator, prefer it. Otherwise, paginate locally.
		if (serverPaginator) {
			return {
				data: filtered as Product[],
				paginatorInfo: {
					nextPageUrl: serverPaginator.nextPageUrl || "",
					hasNextPage: !!serverPaginator.hasNextPage,
					currentPage: serverPaginator.currentPage || pageParam,
					total: serverPaginator.total ?? filtered.length,
				},
			};
		} else {
			const startIndex = (pageParam - 1) * limit;
			const endIndex = startIndex + limit;
			const paginatedProducts = filtered.slice(startIndex, endIndex);

			const hasNextPage = endIndex < filtered.length;
			const nextPage = hasNextPage ? pageParam + 1 : null;

			return {
				data: paginatedProducts as Product[],
				paginatorInfo: {
					nextPageUrl: nextPage ? `page=${nextPage}` : "",
					hasNextPage: hasNextPage,
					currentPage: pageParam,
					total: filtered.length,
				},
			};
		}
	} catch (error) {
		console.error('Error fetching products:', error);
		return {
			data: [] as Product[],
			paginatorInfo: {
				nextPageUrl: "",
				hasNextPage: false,
				currentPage: 1,
				total: 0,
			},
		};
	}
};

const useProductsQuery = (options: QueryOptionsType) => {
	return useInfiniteQuery<PaginatedProduct, Error>(
		[API_ENDPOINTS.PRODUCTS, options],
		fetchProducts,
		{
			getNextPageParam: ({ paginatorInfo }) => {
				return paginatorInfo.hasNextPage ? paginatorInfo.currentPage + 1 : undefined;
			},
		}
	);
};

export { useProductsQuery };
