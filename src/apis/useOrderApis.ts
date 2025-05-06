import { prepareParams, serializeParams } from "@utils/searchUtils.ts";
import resourceUrls from "@constants/resourceUrls.ts";
import { authClient } from "@apis/axiosClient.ts";
import { useMutation, useQuery } from "@tanstack/react-query";

// Search my orders API
interface OrderSearchRequest {
  keyword?: string;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  ids?: string[];
  userIds?: string[];
  shopIds?: string[];
  shippingIds?: string[];
  orderItemStatus?: 'PENDING' | 'SHIPPING' | 'DELIVERED' | 'REFUND_PROGRESSING' | 'COMPLETED' | 'REVIEWED' | 'CANCELLED' | 'REFUND';
}

async function searchMyOrders(request: OrderSearchRequest) {
  const params = prepareParams(request)

  const response = await authClient.get(resourceUrls.ORDER_RESOURCE.SEARCH_MY_ORDERS, {
    params,
    paramsSerializer: {
      serialize: serializeParams
    }
  });

  return response.data;
}

function useSearchMyOrderApi(request: OrderSearchRequest) {
  return useQuery({
    queryKey: ["order/search", request],
    queryFn: () => searchMyOrders(request)
  })
}

// Search my shop orders API
async function searchMyShopOrders(request: OrderSearchRequest) {
  const params = prepareParams(request)

  const response = await authClient.get(resourceUrls.ORDER_RESOURCE.SEARCH_MY_SHOP_ORDERS, {
    params,
    paramsSerializer: {
      serialize: serializeParams
    }
  });

  return response.data;
}

function useSearchMyShopOrderApi(request: OrderSearchRequest) {
  return useQuery({
    queryKey: ["order/search", request],
    queryFn: () => searchMyShopOrders(request)
  })
}

// Create my order API
interface OrderItemCreateRequest {
  productId: string;
  price: number;
  amount: number;
}

interface CreateOrderRequest {
  shippingId: string;
  address: string;
  orderItemCreateRequests: OrderItemCreateRequest[];
}

async function createMyOrder(request: CreateOrderRequest) {
  const response = await authClient.post(resourceUrls.ORDER_RESOURCE.CREATE_MY_ORDER, request);

  return response.data;
}

function useCreateMyOrderApi() {
  return useMutation({
    mutationFn: createMyOrder
  });
}

// Complete my order API
async function completeMyOrder(id: string) {
  const response = await authClient.post(resourceUrls.ORDER_RESOURCE.COMPLETED_MY_ORDER.replace("{id}", id));

  return response.data;
}

function useCompleteMyOrderApi() {
  return useMutation({
    mutationFn: (id: string) => completeMyOrder(id)
  });
}

export {
  useSearchMyOrderApi,
  useSearchMyShopOrderApi,
  useCreateMyOrderApi,
  useCompleteMyOrderApi
}
