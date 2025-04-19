import { authClient } from "@apis/axiosClient.ts";
import resourceUrls from "@constants/resourceUrls.ts";
import { useMutation, useQuery } from "@tanstack/react-query";

// Get my shop API
interface ShopDetailResponse {
  data: {
    id: string,
    name: string,
    address: string,
    avatarUrl: string,
    productCount: number,
    reviewCount: number,
    rating: number,
    status: 'ACTIVE' | 'INACTIVE',
  }
}

async function getMyShop(): Promise<ShopDetailResponse> {
  const response = await authClient.get(resourceUrls.SHOP_RESOURCES.GET_MY_SHOP);

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
  avatarUrl: string
}

interface ShopCreateOrUpdateResponse {
  data: {
    id: string,
    name: string,
    address: string,
    avatarUrl: string,
    status: 'ACTIVE' | 'INACTIVE',
  }
}

async function createMyShop(data: ShopCreateOrUpdateRequest): Promise<ShopCreateOrUpdateResponse> {
  const response = await authClient.post(resourceUrls.SHOP_RESOURCES.CREATE_MY_SHOP, data);

  return response.data;
}

function useCreateMyShopApi() {
  return useMutation({
    mutationFn: createMyShop
  })
}

export {
  useGetMyShopApi,
  useCreateMyShopApi
}
