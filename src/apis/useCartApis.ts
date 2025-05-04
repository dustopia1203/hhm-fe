import { authClient } from "@apis/axiosClient.ts";
import resourceUrls from "@constants/resourceUrls.ts";
import { useMutation, useQuery } from "@tanstack/react-query";

// Get my cart API
async function getMyCart() {
  const response = await authClient.get(resourceUrls.CART_RESOURCE.GET_MY_CART);

  return response.data;
}

function useGetMyCartApi() {
  return useQuery({
    queryKey: ["cart/my"],
    queryFn: getMyCart
  })
}

// Add my cart API
interface AddCartRequest {
  productId: string;
  amount: number
}

async function addMyCart(data: AddCartRequest) {
  const response = await authClient.post(resourceUrls.CART_RESOURCE.ADD_MY_CART, data);

  return response.data;
}

function useAddMyCartApi() {
  return useMutation({
    mutationFn: addMyCart
  })
}

// Delete my cart API
interface IdsRequest {
  ids: string[]
}

async function deleteMyCart(data: IdsRequest) {
  const response = await authClient.delete(resourceUrls.CART_RESOURCE.DELETE_MY_CART, { data });

  return response.data;
}

function useDeleteMyCartApi() {
  return useMutation({
    mutationFn: deleteMyCart
  })
}

export {
  useGetMyCartApi,
  useAddMyCartApi,
  useDeleteMyCartApi
}
