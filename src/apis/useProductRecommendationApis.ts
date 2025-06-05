import { authClient, publicClient } from "@apis/axiosClient.ts";
import resourceUrls from "@constants/resourceUrls.ts";
import { useMutation, useQuery } from "@tanstack/react-query";

interface TrackBehaviorRequest {
  productId?: string;
  behaviorType: "VIEW" | "SEARCH" | "PURCHASE" | "CART_ADD";
  searchQuery?: string;
  categoryId?: string;
  shopId?: string;
}

async function trackBehavior(request: TrackBehaviorRequest) {
  const response = await authClient.post(resourceUrls.PRODUCT_RESOURCE.TRACK_BEHAVIOR, request);
  return response.data;
}

export function useTrackBehaviorApi() {
  return useMutation({
    mutationFn: trackBehavior
  });
} 

async function suggestProducts(query: string) {
  const response = await publicClient.get(resourceUrls.PRODUCT_RESOURCE.SUGGEST_PRODUCTS_ELASTIC, {
    params: { query }
  });
  return response.data;
}

export function useSuggestProductsApi(query: string) {
  return useQuery({
    queryKey: ["product/suggest/elastic", query],
    queryFn: () => suggestProducts(query),
    enabled: !!query
  });
} 