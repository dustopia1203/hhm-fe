import { authClient, publicClient } from "@apis/axiosClient.ts";
import resourceUrls from "@constants/resourceUrls.ts";
import { useMutation, useQuery } from "@tanstack/react-query";

// Get shop by id API
async function getShopById(id: string) {
  const response = await publicClient.get(resourceUrls.SHOP_RESOURCE.GET_SHOP_BY_ID.replace("{id}", id));

  return response.data;
}

function useGetShopByIdApi(id: string) {
  return useQuery({
    queryKey: ["shop", id],
    queryFn: () => getShopById(id)
  });
}

// Get my shop API
async function getMyShop() {
  const response = await authClient.get(resourceUrls.SHOP_RESOURCE.GET_MY_SHOP);

  return response.data;
}

function useGetMyShopApi() {
  return useQuery({
    queryKey: ["myShop"],
    queryFn: getMyShop
  });
}

// Create my shop API
interface ShopCreateOrUpdateRequest {
  name: string,
  address: string,
  avatarUrl: string | null
}

async function createMyShop(data: ShopCreateOrUpdateRequest) {
  const response = await authClient.post(resourceUrls.SHOP_RESOURCE.CREATE_MY_SHOP, data);

  return response.data;
}

function useCreateMyShopApi() {
  return useMutation({
    mutationFn: createMyShop
  })
}

// Update my shop API
async function updateMyShop(data: ShopCreateOrUpdateRequest) {
  const response = await authClient.put(resourceUrls.SHOP_RESOURCE.UPDATE_MY_SHOP, data);

  return response.data;
}

function useUpdateMyShopApi() {
  return useMutation({
    mutationFn: updateMyShop
  })
}

export {
  useGetShopByIdApi,
  useGetMyShopApi,
  useCreateMyShopApi,
  useUpdateMyShopApi
}
