import { authClient, publicClient } from "@apis/axiosClient.ts";
import resourceUrls from "@constants/resourceUrls.ts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { prepareParams, serializeParams } from "@utils/searchUtils.ts";

// Search API
interface ProductSearchRequest {
  keyword?: string;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  ids?: string[];
  shopIds?: string[];
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  status?: "ACTIVE" | "INACTIVE";
}

async function searchProducts(request: ProductSearchRequest) {
  const params = prepareParams(request)

  const response = await publicClient.get(resourceUrls.PRODUCT_RESOURCE.SEARCH_PRODUCTS, {
    params,
    paramsSerializer: {
      serialize: serializeParams
    }
  });

  return response.data;
}

function useSearchProductsApi(request: ProductSearchRequest) {
  return useQuery({
    queryKey: ["product/search", request],
    queryFn: () => searchProducts(request)
  })
}

// Get by id API
async function getProductById(id: string) {
  const response = await publicClient.get(resourceUrls.PRODUCT_RESOURCE.GET_PRODUCT_BY_ID.replace("{id}", id));

  return response.data;
}

function useGetProductByIdApi(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id)
  })
}

// Create product api
interface ProductCreateOrUpdateRequest {
  shopId: string,
  categoryId: string,
  name: string,
  description: string,
  contentUrls: string,
  price: number,
  amount: number
}

async function createMyShopProduct(data: ProductCreateOrUpdateRequest) {
  const response = await authClient.post(resourceUrls.PRODUCT_RESOURCE.CREATE_MY_SHOP_PRODUCT, data);

  return response.data;
}

function useCreateMyShopProductApi() {
  return useMutation({
    mutationFn: createMyShopProduct
  })
}

// Update my shop product API
async function updateMyShopProduct(id: string, data: ProductCreateOrUpdateRequest) {
  const response = await authClient.put(resourceUrls.PRODUCT_RESOURCE.UPDATE_MY_SHOP_PRODUCT.replace("{id}", id), data);

  return response.data;
}

function useUpdateMyShopProductApi(id: string) {
  return useMutation({
    mutationFn: (data: ProductCreateOrUpdateRequest) => updateMyShopProduct(id, data)
  })
}

// Active my shop product API
interface IdsRequest {
  ids: string[]
}

async function activeMyShopProduct(data: IdsRequest) {
  const response = await authClient.put(resourceUrls.PRODUCT_RESOURCE.ACTIVE_MY_SHOP_PRODUCT, data);

  return response.data;
}

function useActiveMyShopProductApi() {
  return useMutation({
    mutationFn: activeMyShopProduct
  })
}

// Inactive my shop product API
async function inactiveMyShopProduct(data: IdsRequest) {
  const response = await authClient.put(resourceUrls.PRODUCT_RESOURCE.INACTIVE_MY_SHOP_PRODUCT, data);

  return response.data;
}

function useInactiveMyShopProductApi() {
  return useMutation({
    mutationFn: inactiveMyShopProduct
  })
}

// Delete my shop product API
async function deleteMyShopProduct(data: IdsRequest) {
  const response = await authClient.delete(resourceUrls.PRODUCT_RESOURCE.DELETE_MY_SHOP_PRODUCT, { data });

  return response.data;
}

function useDeleteMyShopProductApi() {
  return useMutation({
    mutationFn: deleteMyShopProduct
  })
}

export {
  useSearchProductsApi,
  useGetProductByIdApi,
  useCreateMyShopProductApi,
  useUpdateMyShopProductApi,
  useActiveMyShopProductApi,
  useInactiveMyShopProductApi,
  useDeleteMyShopProductApi
}
