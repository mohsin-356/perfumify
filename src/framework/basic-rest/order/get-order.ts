import { Order } from "@framework/types";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useQuery } from "react-query";

export const fetchOrder = async (_id: string) => {
  // Fetch by trackingId via query param so it works with our Next.js route
  const { data } = await http.get(`${API_ENDPOINTS.ORDER}?trackingId=${encodeURIComponent(_id)}`);
  return data;
};
export const useOrderQuery = (id: string) => {
  return useQuery<Order, Error>([API_ENDPOINTS.ORDER, id], () =>
    fetchOrder(id)
  );
};
