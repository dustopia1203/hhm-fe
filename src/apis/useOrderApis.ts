import { prepareParams, serializeParams } from "@utils/searchUtils.ts";
import resourceUrls from "@constants/resourceUrls.ts";
import { authClient } from "@apis/axiosClient.ts";
import { useMutation, useQuery } from "@tanstack/react-query";

// Search my orders API
export enum OrderItemStatus {
  PENDING = 'PENDING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  REFUND_PROGRESSING = 'REFUND_PROGRESSING',
  COMPLETED = 'COMPLETED',
  REVIEWED = 'REVIEWED',
  CANCELLED = 'CANCELLED',
  REFUND = 'REFUND',
}

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
  orderItemStatuses?: OrderItemStatus[];
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

// Create my cod order API
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

async function codPaymentMyOrder(request: CreateOrderRequest) {
  const response = await authClient.post(resourceUrls.ORDER_RESOURCE.COD_PAYMENT_MY_ORDER, request);

  return response.data;
}

function useCodPaymentMyOrderApi() {
  return useMutation({
    mutationFn: codPaymentMyOrder
  });
}

// Create my VNPay order API
interface VNPayCreateOrderRequest extends CreateOrderRequest{
  transactionNumber: string;
}

async function vnPayPaymentMyOrder(request: VNPayCreateOrderRequest) {
  const response = await authClient.post(resourceUrls.ORDER_RESOURCE.VNPAY_PAYMENT_MY_ORDER, request);

  return response.data;
}

function useVNPayPaymentMyOrderApi() {
  return useMutation({
    mutationFn: vnPayPaymentMyOrder
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

// Refund my order API
interface RefundOrderRequest {
  reason: string;
  images: string;
  note: string;
}

async function refundMyOrder(id: string, request: RefundOrderRequest) {
  const response = await authClient.post(resourceUrls.ORDER_RESOURCE.REFUND_MY_ORDER.replace("{id}", id), request);

  return response.data;
}

function useRefundMyOrderApi() {
  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: RefundOrderRequest }) => refundMyOrder(id, request)
  });
}

export {
  useSearchMyOrderApi,
  useSearchMyShopOrderApi,
  useCodPaymentMyOrderApi,
  useVNPayPaymentMyOrderApi,
  useCompleteMyOrderApi,
  useRefundMyOrderApi
}
