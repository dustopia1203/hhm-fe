import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import ShopHeader from "@components/features/ShopHeader.tsx";
import ShopSidebar from "@components/features/ShopSidebar.tsx";
import Footer from "@components/features/Footer.tsx";
import { useSearchMyShopOrderApi, OrderItemStatus } from "@apis/useOrderApis.ts";
import {
  useConfirmMyShopOrderApi,
  useGetMyShopRefundApi,
  useConfirmMyShopRefundApi
} from "@apis/useShopApis.ts";
import Loader from "@components/common/Loader.tsx";
import { FiChevronDown, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import auth from "@utils/auth.ts";

export const Route = createFileRoute('/my/shop/orders')({
  beforeLoad: () => auth([]),
  component: RouteComponent,
})

function RouteComponent() {
  // Filtering and sorting state
  const [selectedStatus, setSelectedStatus] = useState<OrderItemStatus | "ALL">("ALL");
  const [sortOrder, setSortOrder] = useState<"DESC" | "ASC">("DESC");
  const [currentPage, setCurrentPage] = useState(1);

  // Refund dialog state
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [currentRefund, setCurrentRefund] = useState<any>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string>("");

  const queryClient = useQueryClient();

  // Refund query - enabled false so it doesn't auto-run
  const refundQuery = useGetMyShopRefundApi(currentOrderId);

  // API request parameters
  const requestParams = {
    pageIndex: currentPage,
    pageSize: 10,
    sortBy: "createdAt",
    sortOrder,
    ...(selectedStatus !== "ALL" ? { orderItemStatuses: [selectedStatus] } : {})
  };

  // Fetch orders data
  const { data, isLoading } = useSearchMyShopOrderApi(requestParams);

  // Confirm order mutation
  const confirmOrderMutation = useConfirmMyShopOrderApi(currentOrderId);

  // Confirm refund mutation
  const confirmRefundMutation = useConfirmMyShopRefundApi(currentOrderId);

  // Total pages for pagination
  const totalPages = Math.ceil(data?.total / data?.pageSize) || 1;

  // Handle view refund details
  const handleViewRefund = async (orderId: string) => {
    try {
      setCurrentOrderId(orderId);

      // Manually trigger the query
      const result = await refundQuery.refetch();

      if (result.data) {
        setCurrentRefund(result.data);
        setRefundDialogOpen(true);
      } else {
        toast.error("Không tìm thấy thông tin hoàn tiền");
      }
    } catch (error) {
      toast.error("Không thể tải thông tin hoàn tiền");
    }
  };

  // Get status text based on OrderItemStatus
  const getStatusText = (status: OrderItemStatus): string => {
    switch (status) {
      case OrderItemStatus.PENDING:
        return 'Đang xác nhận'
      case OrderItemStatus.SHIPPING:
        return 'Đang vận chuyển'
      case OrderItemStatus.DELIVERED:
        return 'Đã giao hàng'
      case OrderItemStatus.REFUND_PROGRESSING:
        return 'Đang xử lý hoàn tiền'
      case OrderItemStatus.COMPLETED:
        return 'Đã hoàn thành'
      case OrderItemStatus.REVIEWED:
        return 'Đã đánh giá'
      case OrderItemStatus.CANCELLED:
        return 'Đã hủy'
      case OrderItemStatus.REFUND:
        return 'Đã hoàn tiền'
      default:
        return 'Không xác định'
    }
  }

  // Generate status label styling
  const getStatusStyle = (status: OrderItemStatus) => {
    switch (status) {
      case OrderItemStatus.PENDING:
        return 'text-yellow-300'
      case OrderItemStatus.SHIPPING:
        return 'text-blue-300'
      case OrderItemStatus.DELIVERED:
        return 'text-blue-300'
      case OrderItemStatus.COMPLETED:
        return 'text-green-300'
      case OrderItemStatus.REVIEWED:
        return 'text-green-300'
      case OrderItemStatus.CANCELLED:
        return 'text-red-300'
      case OrderItemStatus.REFUND:
        return 'text-purple-300'
      case OrderItemStatus.REFUND_PROGRESSING:
        return 'text-orange-300'
      default:
        return 'text-gray-300'
    }
  }

  // Handle confirm refund
  const handleConfirmRefund = async () => {
    if (!currentOrderId) return;

    try {
      await confirmRefundMutation.mutateAsync();

      toast.success("Đã xác nhận hoàn tiền cho đơn hàng");
      setRefundDialogOpen(false);

      // Refetch orders data
      queryClient.invalidateQueries({ queryKey: ['order/search'] });
    } catch (error: any) {
      toast.error(
        error.message || error.response?.data?.message || "Không thể xác nhận hoàn tiền"
      );
    }
  };

  // Handle confirm order
  const handleConfirmOrder = async (orderId: string) => {
    try {
      setCurrentOrderId(orderId);
      await confirmOrderMutation.mutateAsync();

      toast.success("Đã xác nhận đơn hàng");

      // Refetch orders data
      queryClient.invalidateQueries({ queryKey: ['order/search'] });
    } catch (error: any) {
      toast.error(
        error.message || error.response?.data?.message || "Không thể xác nhận đơn hàng"
      );
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-900">
      <ShopHeader/>

      <div className="flex flex-1">
        <div className="w-64 bg-gray-800">
          <ShopSidebar/>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Quản lý đơn hàng</h1>

          {/* Filter and sort options */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Status filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderItemStatus | "ALL")}
                className="appearance-none bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-gray-600"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value={OrderItemStatus.PENDING}>Chờ xử lý</option>
                <option value={OrderItemStatus.SHIPPING}>Đang giao</option>
                <option value={OrderItemStatus.DELIVERED}>Đã giao</option>
                <option value={OrderItemStatus.COMPLETED}>Hoàn thành</option>
                <option value={OrderItemStatus.REVIEWED}>Đã đánh giá</option>
                <option value={OrderItemStatus.CANCELLED}>Đã hủy</option>
                <option value={OrderItemStatus.REFUND_PROGRESSING}>Đang hoàn tiền</option>
                <option value={OrderItemStatus.REFUND}>Đã hoàn tiền</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FiChevronDown className="text-gray-400"/>
              </div>
            </div>

            {/* Sort order */}
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "ASC" | "DESC")}
                className="appearance-none bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-gray-600"
              >
                <option value="DESC">Mới nhất</option>
                <option value="ASC">Cũ nhất</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FiChevronDown className="text-gray-400"/>
              </div>
            </div>
          </div>

          {isLoading ?
            <div className="flex-1 flex items-center justify-center">
              <Loader/>
            </div> :
            <div>
              {/* Orders List */}
              <div className="space-y-4">
                {data?.data?.map((order) => (
                  <div key={order.id} className="border border-gray-800 rounded-lg overflow-hidden">
                    {/* Order Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-800">
                      <div className="font-medium text-white">
                        Mã đơn hàng: {order.id}
                      </div>
                      <div className={`${getStatusStyle(order.orderItemStatus)}`}>
                        {getStatusText(order.orderItemStatus)}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex items-center p-4 gap-4">
                      <div className="h-20 w-20 bg-gray-800 rounded-lg overflow-hidden">
                        <div className="h-full w-full flex items-center justify-center bg-blue-100/10">
                          <img
                            src={order.productImage}
                            alt={order.productName}
                            className="max-h-16 max-w-16"
                          />
                        </div>
                      </div>

                      <div className="flex-grow">
                        <h3 className="text-white font-medium">{order.productName}</h3>
                        <div className="mt-2">
                          <span className="text-white">₫{Number(order.price).toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="text-gray-400">
                        × {order.amount}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="p-4 border-t border-gray-800">
                      <div className="text-white">
                        <span className="text-gray-400">Địa chỉ: </span>
                        {order.address}
                      </div>
                      <div className="text-white mt-1">
                        <span className="text-gray-400">Ngày đặt: </span>
                        {new Date(order.createdAt).toLocaleString('vi-VN')}
                      </div>

                      {/* Action buttons based on order status */}
                      <div className="flex justify-end">
                        {order.orderItemStatus === OrderItemStatus.PENDING && (
                          <button
                            onClick={() => handleConfirmOrder(order.id)}
                            disabled={confirmOrderMutation.isPending}
                            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                          >
                            {confirmOrderMutation.isPending && currentOrderId === order.id
                              ? "Đang xác nhận..."
                              : "Xác nhận đơn hàng"}
                          </button>
                        )}
                      </div>

                      <div className="flex justify-end">
                        {order.orderItemStatus === OrderItemStatus.REFUND_PROGRESSING && (
                          <button
                            onClick={() => handleViewRefund(order.id)}
                            className="mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
                          >
                            Xem yêu cầu hoàn tiền
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {(!data?.data || data.data.length === 0) && (
                  <div className="text-center py-12 text-gray-400">
                    Không có đơn hàng nào
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-1">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-md ${
                        currentPage === 1
                          ? 'text-gray-500 cursor-not-allowed'
                          : 'text-white hover:bg-gray-800'
                      }`}
                    >
                      <FiChevronLeft size={16}/>
                    </button>

                    {Array.from({ length: totalPages }).map((_, index) => {
                      const pageNumber = index + 1;
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        Math.abs(pageNumber - currentPage) <= 1
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`w-8 h-8 flex items-center justify-center rounded-md ${
                              pageNumber === currentPage
                                ? 'bg-white text-gray-800 font-medium'
                                : 'text-gray-300 hover:bg-gray-800'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      }

                      if (
                        (pageNumber === 2 && currentPage > 3) ||
                        (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return <span key={`ellipsis-${pageNumber}`} className="px-2 text-gray-500">...</span>;
                      }

                      return null;
                    })}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-md ${
                        currentPage === totalPages
                          ? 'text-gray-500 cursor-not-allowed'
                          : 'text-white hover:bg-gray-800'
                      }`}
                    >
                      <FiChevronRight size={16}/>
                    </button>
                  </nav>
                </div>
              )}
            </div>
          }
        </div>
      </div>

      {/* Refund Dialog */}
      {refundDialogOpen && currentRefund && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Thông tin yêu cầu hoàn tiền</h2>
              <button
                onClick={() => setRefundDialogOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <FiX size={20}/>
              </button>
            </div>

            <div className="space-y-4 mb-4">
              <div>
                <span className="text-gray-400 block mb-1">ID yêu cầu:</span>
                <span className="text-white">{currentRefund.data.id}</span>
              </div>

              <div>
                <span className="text-gray-400 block mb-1">Ngày yêu cầu:</span>
                <span className="text-white">
                  {new Date(currentRefund.data.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>

              <div>
                <span className="text-gray-400 block mb-1">Mã đơn hàng:</span>
                <span className="text-white">{currentRefund.data.orderItemId}</span>
              </div>

              <div>
                <span className="text-gray-400 block mb-1">Lý do hoàn tiền:</span>
                <p className="text-white">{currentRefund.data.reason}</p>
              </div>

              {currentRefund.data.note && (
                <div>
                  <span className="text-gray-400 block mb-1">Ghi chú:</span>
                  <p className="text-white">{currentRefund.data.note}</p>
                </div>
              )}

              {currentRefund.data.images && (
                <div>
                  <span className="text-gray-400 block mb-2">Hình ảnh:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {currentRefund.data.images.split(';').map((imageUrl: string, index: number) => (
                      <div key={index} className="h-20 w-20 rounded overflow-hidden bg-gray-700">
                        <img
                          src={imageUrl}
                          alt={`Refund image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRefundDialogOpen(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
              >
                Đóng
              </button>
              <button
                onClick={handleConfirmRefund}
                disabled={confirmRefundMutation.isPending}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {confirmRefundMutation.isPending
                  ? "Đang xác nhận..."
                  : "Xác nhận hoàn tiền"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer/>
    </div>
  )
}
