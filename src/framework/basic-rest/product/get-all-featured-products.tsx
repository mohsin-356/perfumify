import { QueryOptionsType, Product } from "@framework/types";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints"; // keep import
import { useQuery } from "react-query";

export const fetchFeaturedProducts = async ({ queryKey }: any) => {
  const [_key, _params] = queryKey;
  const { data: resp } = await http.get(API_ENDPOINTS.PRODUCTS, { params: { limit: 100 } });
  const items = Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : [];
  return (items as Product[]).filter((p) => p.featured || p.isFeatured).slice(0, 10);
};
export const useFeaturedProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>(
    [API_ENDPOINTS.FEATURED_PRODUCTS, options],
    fetchFeaturedProducts
  );
};
