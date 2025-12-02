import { QueryOptionsType, Product } from "@framework/types";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useQuery } from "react-query";

const fetchAllSearchItems = async (): Promise<Product[]> => {
  const { data: resp } = await http.get(API_ENDPOINTS.SEARCH, { params: { limit: 1000 } });
  const items = Array.isArray(resp) ? resp : (resp?.data ?? []);
  return (items || []) as Product[];
};

export const useSearchQuery = (
  options: QueryOptionsType & { enabled?: boolean }
) => {
  const enabled = Boolean(options?.enabled);
  const text = String(options?.text || "").toLowerCase().trim();

  return useQuery<Product[], Error>([API_ENDPOINTS.SEARCH], fetchAllSearchItems, {
    enabled,
    staleTime: 1000 * 60 * 5,
    select: (items) => {
      if (!text) return items;
      try {
        return items.filter((p: any) =>
          String(p?.name || "").toLowerCase().includes(text)
        );
      } catch {
        return items;
      }
    },
  });
};
