import { QueryOptionsType, Product } from "@framework/types";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useQuery } from "react-query";

export const fetchBestSellerProducts = async ({ queryKey }: any) => {
	const [_key, _params] = queryKey;
	try {
		const { data } = await http.get(API_ENDPOINTS.BEST_SELLER_PRODUCTS);
		return Array.isArray(data) ? data as Product[] : [];
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
