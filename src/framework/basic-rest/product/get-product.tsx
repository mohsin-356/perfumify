import { Product } from "@framework/types";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useQuery } from "react-query";

export const fetchProduct = async (_slug: string) => {
	// Fetch product by slug using the dedicated by-slug API route
	const { data } = await http.get(`${API_ENDPOINTS.PRODUCT}/by-slug/${_slug}`);
	return data;
};
export const useProductQuery = (slug: string) => {
	return useQuery<Product, Error>([API_ENDPOINTS.PRODUCT, slug], () =>
		fetchProduct(slug)
	);
};
