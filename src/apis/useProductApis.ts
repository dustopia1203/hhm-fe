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

  const response = await authClient.get(resourceUrls.PRODUCT_RESOURCE.SEARCH_PRODUCTS, {
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

// Get similar products from searches API
async function getSimilarProductsFromSearches(size: number = 4) {
  const response = await authClient.get(resourceUrls.PRODUCT_RESOURCE.GET_SIMILAR_PRODUCTS_FROM_SEARCHES, {
    params: { size }
  });

  return response.data;
}

function useGetSimilarProductsFromSearchesApi(size: number = 4) {
  return useQuery({
    queryKey: ["product/similar-from-searches", size],
    queryFn: () => getSimilarProductsFromSearches(size)
  })
}

// Get similar products API
async function getSimilarProducts(productId: string, size: number = 10) {
  const response = await publicClient.get(resourceUrls.PRODUCT_RESOURCE.GET_SIMILAR_PRODUCTS.replace("{productId}", productId), {
    params: { size }
  });

  return response.data;
}

function useGetSimilarProductsApi(productId: string, size: number = 10) {
  return useQuery({
    queryKey: ["product/similar", productId, size],
    queryFn: () => getSimilarProducts(productId, size)
  })
}

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

function useTrackBehaviorApi() {
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

function useSuggestProductsApi(query: string) {
  return useQuery({
    queryKey: ["product/suggest/elastic", query],
    queryFn: () => suggestProducts(query),
    enabled: !!query
  });
} 
export {
  useSearchProductsApi,
  useGetProductByIdApi,
  useCreateMyShopProductApi,
  useUpdateMyShopProductApi,
  useActiveMyShopProductApi,
  useInactiveMyShopProductApi,
  useDeleteMyShopProductApi,
  useGetSimilarProductsFromSearchesApi,
  useGetSimilarProductsApi,
  useTrackBehaviorApi,
  useSuggestProductsApi
}
