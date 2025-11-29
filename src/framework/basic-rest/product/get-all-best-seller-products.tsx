import { QueryOptionsType, Product } from "@framework/types";
import http from "@framework/utils/http";
import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";

export const fetchBestSellerProducts = async ({ queryKey }: any) => {
	const [_key, _params] = queryKey;
	try {
		// Use server-side filtering
		const { data: resp } = await http.get(API_ENDPOINTS.PRODUCTS, {
			params: { ..._params, bestSeller: true, limit: 10 }
		});
		// Handle paginated response structure { data: [...], paginatorInfo: ... }
		return resp?.data || [];
	} catch (error) {
		console.error('Error fetching best seller products:', error);
		return [] as Product[];
	}
};
export const useBestSellerProductsQuery = (options: QueryOptionsType) => {
	return useQuery<Product[], Error>(
		[API_ENDPOINTS.BEST_SELLER_PRODUCTS, options],
		fetchBestSellerProducts
	);
};
