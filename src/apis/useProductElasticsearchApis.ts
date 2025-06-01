import { publicClient } from "@apis/axiosClient.ts";
import resourceUrls from "@constants/resourceUrls.ts";
import { useQuery } from "@tanstack/react-query";

async function suggestProducts(query: string) {
  const response = await publicClient.get(resourceUrls.PRODUCT_RESOURCE.SUGGEST_PRODUCTS_ELASTIC, {
    params: { query }
  });
  return response.data;
}

export function useSuggestProducts(query: string) {
  return useQuery({
    queryKey: ["product/suggest/elastic", query],
    queryFn: () => suggestProducts(query),
    enabled: !!query
  });
} 