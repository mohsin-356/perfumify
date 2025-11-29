import { QueryOptionsType, Product } from "@framework/types";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useQuery } from "react-query";

export const fetchNewArrivalProducts = async ({ queryKey }: any) => {
  const [_key, _params] = queryKey;
  try {
    const { data: resp } = await http.get(API_ENDPOINTS.PRODUCTS, {
      params: { ..._params, newArrival: true, sort: "-createdAt", limit: 10 }
    });
    return resp?.data || [];
  } catch (error) {
    console.error('Error fetching new arrival products:', error);
    return [] as Product[];
  }
};
export const useNewArrivalProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>(
    [API_ENDPOINTS.NEW_ARRIVAL_PRODUCTS, options],
    fetchNewArrivalProducts
  );
};
