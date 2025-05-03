import { prepareParams, serializeParams } from "@utils/searchUtils.ts";
import { publicClient } from "@apis/axiosClient.ts";
import resourceUrls from "@constants/resourceUrls.ts";
import { useQuery } from "@tanstack/react-query";

// Shipping search API
interface ShippingSearchRequest {
  keyword?: string;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  ids?: string[];
  status?: "ACTIVE" | "INACTIVE";
}

async function searchShipping(request: ShippingSearchRequest) {
  const params = prepareParams(request);

  const response = await publicClient.get(resourceUrls.SHIPPING_RESOURCE.SEARCH_SHIPPING, {
    params,
    paramsSerializer: {
      serialize: serializeParams
    }
  });

  return response.data;
}

function useSearchShippingApi(request: ShippingSearchRequest) {
  return useQuery({
    queryKey: ["product/search", request],
    queryFn: () => searchShipping(request)
  })
}

export {
  useSearchShippingApi
}
