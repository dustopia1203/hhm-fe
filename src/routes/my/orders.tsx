import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import Header from '@components/features/Header.tsx'
import Footer from '@components/features/Footer.tsx'
import { FaStar } from 'react-icons/fa'
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@components/ui/dialog.tsx"
import { X } from "lucide-react"
import RefundForm from "@components/features/RefundForm.tsx"
import { toast } from "sonner"
import ReviewForm from "@components/features/ReviewForm.tsx";
import auth from "@utils/auth.ts";
import { useSearchMyOrderApi, useCompleteMyOrderApi, useRefundMyOrderApi, OrderItemStatus } from "@apis/useOrderApis.ts";
import { useCreateMyReviewApi } from "@apis/useReviewApis.ts";
import Loader from "@components/common/Loader.tsx";
import uploadFile from "@utils/cloudinary.ts";
import { useQueryClient } from '@tanstack/react-query';

// Order interface structure
interface Order {
  id: string;
  productId: string;
  shippingId: string;
  price: number;
  amount: number;
  address: string;
  orderItemStatus: OrderItemStatus;
  productName: string;
  productImage: string;
  shopName: string;
}

export const Route = createFileRoute('/my/orders')({
  beforeLoad: () => auth([]),
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: search.tab as string | null
    }
  }
})

function RouteComponent() {
  const search = Route.useSearch()
  const orderType = search.tab || '1'
  const queryClient = useQueryClient();

  // Dialog states
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Define tab configuration
  const tabs = [
    { type: '1', label: 'Chờ xác nhận' },
    { type: '2', label: 'Đang vận chuyển' },
    { type: '3', label: 'Đã hoàn thành' },
    { type: '4', label: 'Đã hủy' },
    { type: '5', label: 'Trả hàng/Hoàn tiền' }
  ]

  // Define search params for each tab
  const getSearchParams = () => {
    switch (orderType) {
      case '1':
        return { orderItemStatuses: [OrderItemStatus.PENDING] };
      case '2':
        return {
          orderItemStatuses: [
            OrderItemStatus.SHIPPING,
            OrderItemStatus.DELIVERED,
            OrderItemStatus.REFUND_PROGRESSING
          ]
        };
      case '3':
        return {
          orderItemStatuses: [
            OrderItemStatus.COMPLETED,
            OrderItemStatus.REVIEWED
          ]
        };
      case '4':
        return { orderItemStatuses: [OrderItemStatus.CANCELLED] };
      case '5':
        return { orderItemStatuses: [OrderItemStatus.REFUND] };
      default:
        return {};
    }
  };

  // API hooks
  const {
    data: ordersData,
    isLoading,
    error,
    refetch
  } = useSearchMyOrderApi(getSearchParams());

  const completeOrderMutation = useCompleteMyOrderApi();
  const refundOrderMutation = useRefundMyOrderApi();
  const reviewMutation = useCreateMyReviewApi();

  // Transform API data to our Order interface
  const orders: Order[] = ordersData?.data ? ordersData.data.map((item: any) => ({
    id: item.id,
    productId: item.productId,
    shippingId: item.shippingId,
    price: Number(item.price),
    amount: item.amount,
    address: item.address || '',
    orderItemStatus: item.orderItemStatus,
    productName: item.productName,
    productImage: item.productImage || '/placeholder.jpg',
    shopName: item.shopName || 'Shop'
  })) : [];

  // Open refund dialog
  const handleRefundClick = (order: Order) => {
    setSelectedOrder(order)
    setRefundDialogOpen(true)
  }

  // Open review dialog
  const handleReviewClick = (order: Order) => {
    setSelectedOrder(order)
    setReviewDialogOpen(true)
  }

  // Handle received order button
  const handleOrderReceived = async (orderId: string) => {
    try {
      await completeOrderMutation.mutateAsync(orderId);

      toast.success("Đã xác nhận nhận hàng", {
        description: "Cảm ơn bạn đã xác nhận"
      });

      // Refetch orders to update the list
      queryClient.invalidateQueries({ queryKey: ['order/search'] });
    } catch (error: any) {
      toast.error("Không thể xác nhận đơn hàng", {
        description: error?.message || "Đã xảy ra lỗi, vui lòng thử lại sau"
      });
    }
  }

  // Handle refund form submission with image uploads
  const handleRefundSubmit = async (data: {
    orderItemId: string
    reason: string
    notes: string
    images: File[]
  }) => {
    try {
      setIsSubmitting(true);

      // Upload images to Cloudinary first if any
      let imageUrls = '';
      if (data.images && data.images.length > 0) {
        const uploadPromises = data.images.map(image => uploadFile(image));
        const uploadedUrls = await Promise.all(uploadPromises);
        imageUrls = uploadedUrls.join(',');
      }

      // Submit refund request with uploaded image URLs
      await refundOrderMutation.mutateAsync({
        id: data.orderItemId,
        request: {
          reason: data.reason,
          note: data.notes || '',
          images: imageUrls
        }
      });

      toast.success("Yêu cầu hoàn tiền đã được gửi", {
        description: "Bạn sẽ nhận được phản hồi trong 24 giờ tới"
      });

      setRefundDialogOpen(false);

      // Refetch orders to update the list
      queryClient.invalidateQueries({ queryKey: ['order/search'] });
    } catch (error: any) {
      toast.error("Không thể gửi yêu cầu hoàn tiền", {
        description: error?.message || "Đã xảy ra lỗi, vui lòng thử lại sau"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle review form submission with image uploads
  const handleReviewSubmit = async (data: {
    orderItemId: string
    rating: number
    comment: string
    images: File[]
  }) => {
    try {
      setIsSubmitting(true);

      // Upload images to Cloudinary first if any
      let imageUrls = '';
      if (data.images && data.images.length > 0) {
        const uploadPromises = data.images.map(image => uploadFile(image));
        const uploadedUrls = await Promise.all(uploadPromises);
        imageUrls = uploadedUrls.join(',');
      }

      // Submit review with uploaded image URLs
      await reviewMutation.mutateAsync({
        orderItemId: data.orderItemId,
        rating: data.rating,
        description: data.comment,
        contentUrls: imageUrls
      });

      toast.success("Cảm ơn bạn đã đánh giá", {
        description: `Bạn đã đánh giá ${data.rating} sao cho sản phẩm này`
      });

      setReviewDialogOpen(false);

      // Refetch orders to update the list
      queryClient.invalidateQueries({ queryKey: ['order/search'] });
    } catch (error: any) {
      toast.error("Không thể gửi đánh giá", {
        description: error?.message || "Đã xảy ra lỗi, vui lòng thử lại sau"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle dialog close
  const handleRefundDialogClose = () => {
    if (!isSubmitting) {
      setRefundDialogOpen(false)
    }
  }

  // Handle review dialog close
  const handleReviewDialogClose = () => {
    if (!isSubmitting) {
      setReviewDialogOpen(false)
    }
  }

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

  // Render actions buttons based on order status
  const renderActions = (order: Order) => {
    switch (order.orderItemStatus) {
      case OrderItemStatus.DELIVERED:
        return (
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 border border-green-600"
              onClick={() => handleOrderReceived(order.id)}
              disabled={completeOrderMutation.isPending}
            >
              {completeOrderMutation.isPending ? "Đang xử lý..." : "Đã nhận được hàng"}
            </button>
            <button
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 border border-gray-600"
              onClick={() => handleRefundClick(order)}
              disabled={refundOrderMutation.isPending}
            >
              Trả hàng/Hoàn tiền
            </button>
          </div>
        )
      case OrderItemStatus.REFUND_PROGRESSING:
        return (
          <button
            className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg border border-gray-700 cursor-not-allowed"
            disabled
          >
            Đang xử lý hoàn tiền
          </button>
        )
      case OrderItemStatus.COMPLETED:
        return (
          <button
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 border border-gray-700 flex items-center"
            onClick={() => handleReviewClick(order)}
            disabled={reviewMutation.isPending}
          >
            <FaStar className="mr-2 text-yellow-400"/>
            {reviewMutation.isPending ? "Đang xử lý..." : "Đánh giá sản phẩm"}
          </button>
        )
      default:
        return null
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

  // Handle error display
  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể tải đơn hàng",
        {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss(),
          },
        }
      );
    }
  }, [error]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen w-full">
        <Header/>
        <main className="flex-grow py-6 flex items-center justify-center">
          <Loader />
        </main>
        <Footer/>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header/>

      <main className="flex-grow py-6 max-w-6xl mx-auto w-full px-4">
        {/* Navigation Tabs */}
        <div className="border border-gray-800 rounded-lg overflow-hidden mb-6">
          <div className="flex flex-wrap text-center">
            {tabs.map(tab => (
              <Link
                key={tab.type}
                to="/my/orders"
                search={{ tab: tab.type }}
                className={`flex-1 py-4 px-2 ${
                  orderType === tab.type
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border border-gray-800 rounded-lg overflow-hidden">
              {/* Shop Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="font-medium text-white">{order.shopName}</div>
                <div className={`${getStatusStyle(order.orderItemStatus)}`}>
                  {getStatusText(order.orderItemStatus)}
                </div>
              </div>

              {/* Product Item */}
              <div className="flex items-center p-4 gap-4 border-b border-gray-700/30">
                <div className="h-20 w-20 bg-gray-800 rounded-lg overflow-hidden">
                  <div className="h-full w-full flex items-center justify-center bg-blue-100/10">
                    <img src={order.productImage} alt={order.productName} className="max-h-16 max-w-16"/>
                  </div>
                </div>

                <div className="flex-grow">
                  <h3 className="text-white font-medium">{order.productName}</h3>
                  <div className="mt-2">
                    <span className="text-white">${order.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-gray-400">
                  × {order.amount}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end p-4 border-t border-gray-800">
                {renderActions(order)}
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              Không có đơn hàng nào
            </div>
          )}
        </div>
      </main>

      <Footer/>

      {/* Refund Dialog */}
      <Dialog open={refundDialogOpen} onOpenChange={handleRefundDialogClose}>
        <DialogContent
          className="bg-gray-900 border border-gray-800 text-white sm:max-w-[550px] p-0 overflow-hidden"
          onInteractOutside={(e) => {
            if (isSubmitting) {
              e.preventDefault();
            }
          }}
        >
          <div className="sticky top-0 z-20 bg-gray-900 px-6 pt-6 pb-2 border-b border-gray-800 shadow-md">
            <DialogTitle className="text-xl font-bold text-white mb-1">
              Trả hàng/Hoàn tiền
            </DialogTitle>
            <DialogClose
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 disabled:pointer-events-none"
              disabled={isSubmitting}
            >
              <X className="h-4 w-4"/>
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>

          {/* Use a scrollable container for the content */}
          <div className="overflow-y-auto scrollbar-hide max-h-[calc(90vh-80px)]">
            {selectedOrder && (
              <div className="px-6 py-6">
                <RefundForm
                  orderItemId={selectedOrder.id}
                  productName={selectedOrder.productName}
                  price={selectedOrder.price}
                  quantity={selectedOrder.amount}
                  productImage={selectedOrder.productImage}
                  onSubmit={handleRefundSubmit}
                  onClose={handleRefundDialogClose}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={handleReviewDialogClose}>
        <DialogContent
          className="bg-gray-900 border border-gray-800 text-white sm:max-w-[550px] p-0 overflow-hidden"
          onInteractOutside={(e) => {
            if (isSubmitting) {
              e.preventDefault();
            }
          }}
        >
          <div className="sticky top-0 z-20 bg-gray-900 px-6 pt-6 pb-2 border-b border-gray-800 shadow-md">
            <DialogTitle className="text-xl font-bold text-white mb-1">
              Đánh giá sản phẩm
            </DialogTitle>
            <DialogClose
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 disabled:pointer-events-none"
              disabled={isSubmitting}
            >
              <X className="h-4 w-4"/>
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>

          {/* Use a scrollable container for the content */}
          <div className="overflow-y-auto scrollbar-hide max-h-[calc(90vh-80px)]">
            {selectedOrder && (
              <div className="px-6 py-6">
                <ReviewForm
                  orderItemId={selectedOrder.id}
                  productName={selectedOrder.productName}
                  price={selectedOrder.price}
                  quantity={selectedOrder.amount}
                  productImage={selectedOrder.productImage}
                  onSubmit={handleReviewSubmit}
                  onClose={handleReviewDialogClose}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
