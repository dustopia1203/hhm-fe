import { publicClient } from "@apis/axiosClient.ts";
import resourceUrls from "@constants/resourceUrls.ts";
import { useQuery } from "@tanstack/react-query";

async function getProductById(id: string) {
  const response = await publicClient.get(resourceUrls.PRODUCT_RESOURCE.GET_PRODUCT_BY_ID.replace("{id}", id));

  return response.data;
}

function useGetProductById(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id)
  })
}

export {
  useGetProductById
}
