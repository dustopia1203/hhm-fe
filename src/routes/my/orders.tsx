import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import Header from '@components/features/Header.tsx'
import Footer from '@components/features/Footer.tsx'
import { FaStar } from 'react-icons/fa'
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@components/ui/dialog.tsx"
import { X } from "lucide-react"
import RefundForm from "@components/features/RefundForm.tsx"
import { toast } from "sonner"
import ReviewForm from "@components/features/ReviewForm.tsx";
import auth from "@utils/auth.ts";

// Updated enum to match required structure
enum OrderItemStatus {
  PENDING = 'PENDING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  REFUND_PROGRESSING = 'REFUND_PROGRESSING',
  COMPLETED = 'COMPLETED',
  REVIEWED = 'REVIEWED',
  CANCELLED = 'CANCELLED',
  REFUND = 'REFUND',
}

// Updated Order interface structure
interface Order {
  id: string; // UUID
  productId: string; // UUID
  shippingId: string; // UUID
  price: number; // BigDecimal
  amount: number; // Integer
  address: string;
  orderItemStatus: OrderItemStatus;
  productName: string;
  productImage: string;
  shop: string; // Added for UI purposes
  statusText: string; // Added for UI display
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

  // Dialog states
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Orders state - updated to match new structure
  const [ordersState, setOrdersState] = useState<Order[]>([
    {
      id: 'order1',
      productId: 'product1',
      shippingId: 'shipping1',
      price: 89.99,
      amount: 1,
      address: '123 Main St, City',
      orderItemStatus: OrderItemStatus.PENDING,
      productName: 'PlayStation 5',
      productImage: '/images/products/ps5-1.jpg',
      shop: 'TTGShop',
      statusText: 'Đang xác nhận'
    },
    {
      id: 'order2',
      productId: 'product2',
      shippingId: 'shipping2',
      price: 89.99,
      amount: 1,
      address: '456 Elm St, City',
      orderItemStatus: OrderItemStatus.COMPLETED,
      productName: 'PlayStation 5',
      productImage: '/images/products/ps5-1.jpg',
      shop: 'TTGShop',
      statusText: 'Đã hoàn thành'
    },
    {
      id: 'order3',
      productId: 'product3',
      shippingId: 'shipping3',
      price: 89.99,
      amount: 1,
      address: '789 Oak St, City',
      orderItemStatus: OrderItemStatus.SHIPPING,
      productName: 'PlayStation 5',
      productImage: '/images/products/ps5-1.jpg',
      shop: 'TTGShop',
      statusText: 'Đang vận chuyển'
    },
    {
      id: 'order4',
      productId: 'product4',
      shippingId: 'shipping4',
      price: 499.99,
      amount: 1,
      address: '101 Pine St, City',
      orderItemStatus: OrderItemStatus.DELIVERED,
      productName: 'Xbox Series X',
      productImage: '/images/products/xbox.jpg',
      shop: 'GameZone',
      statusText: 'Đã giao hàng'
    },
    {
      id: 'order5',
      productId: 'product7',
      shippingId: 'shipping5',
      price: 1299.99,
      amount: 1,
      address: '202 Maple St, City',
      orderItemStatus: OrderItemStatus.COMPLETED,
      productName: 'iPhone 16 Pro Max',
      productImage: '/images/products/iphone.jpg',
      shop: 'ElectronicHub',
      statusText: 'Đã hoàn thành'
    },
    {
      id: 'order6',
      productId: 'product8',
      shippingId: 'shipping6',
      price: 69.99,
      amount: 2,
      address: '303 Cedar St, City',
      orderItemStatus: OrderItemStatus.DELIVERED,
      productName: 'DualSense Controller',
      productImage: '/images/products/controller.jpg',
      shop: 'TTGShop',
      statusText: 'Đã giao hàng'
    },
    {
      id: 'order7',
      productId: 'product9',
      shippingId: 'shipping7',
      price: 349.99,
      amount: 1,
      address: '404 Birch St, City',
      orderItemStatus: OrderItemStatus.REVIEWED,
      productName: 'Nintendo Switch OLED',
      productImage: '/images/products/switch.jpg',
      shop: 'GameZone',
      statusText: 'Đã đánh giá'
    },
    {
      id: 'order8',
      productId: 'product10',
      shippingId: 'shipping8',
      price: 1199.99,
      amount: 1,
      address: '505 Walnut St, City',
      orderItemStatus: OrderItemStatus.REVIEWED,
      productName: 'Samsung Galaxy S24 Ultra',
      productImage: '/images/products/galaxy.jpg',
      shop: 'TechGadgets',
      statusText: 'Đã đánh giá'
    },
    {
      id: 'order9',
      productId: 'product11',
      shippingId: 'shipping9',
      price: 349.99,
      amount: 1,
      address: '606 Spruce St, City',
      orderItemStatus: OrderItemStatus.REFUND_PROGRESSING,
      productName: 'Sony WH-1000XM5',
      productImage: '/images/products/headphones.jpg',
      shop: 'TTGShop',
      statusText: 'Đang xử lý hoàn tiền'
    }
  ])

  // Filter orders based on orderType
  const filteredOrders = ordersState.filter(order => {
    switch (orderType) {
      case '1':
        return order.orderItemStatus === OrderItemStatus.PENDING
      case '2':
        return order.orderItemStatus === OrderItemStatus.SHIPPING ||
          order.orderItemStatus === OrderItemStatus.DELIVERED ||
          order.orderItemStatus === OrderItemStatus.REFUND_PROGRESSING
      case '3':
        return order.orderItemStatus === OrderItemStatus.COMPLETED ||
          order.orderItemStatus === OrderItemStatus.REVIEWED
      case '4':
        return order.orderItemStatus === OrderItemStatus.CANCELLED
      case '5':
        return order.orderItemStatus === OrderItemStatus.REFUND
      default:
        return true
    }
  })

  // Define tab configuration
  const tabs = [
    { type: '1', label: 'Chờ xác nhận' },
    { type: '2', label: 'Đang vận chuyển' },
    { type: '3', label: 'Đã hoàn thành' },
    { type: '4', label: 'Đã hủy' },
    { type: '5', label: 'Trả hàng/Hoàn tiền' }
  ]

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
  const handleOrderReceived = (orderId: string) => {
    // Update the order status to completed
    setOrdersState(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId && order.orderItemStatus === OrderItemStatus.DELIVERED) {
          return {
            ...order,
            orderItemStatus: OrderItemStatus.COMPLETED,
            statusText: 'Đã hoàn thành'
          }
        }
        return order
      })
    )

    toast.success("Đã xác nhận nhận hàng", {
      description: "Cảm ơn bạn đã xác nhậny"
    })
  }

  // Handle refund form submission
  const handleRefundSubmit = (data: {
    orderItemId: string
    reason: string
    notes: string
    images: File[]
  }) => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Update the order status to refund_progressing
      setOrdersState(prevOrders =>
        prevOrders.map(order => {
          if (order.id === data.orderItemId && order.orderItemStatus === OrderItemStatus.DELIVERED) {
            return {
              ...order,
              orderItemStatus: OrderItemStatus.REFUND_PROGRESSING,
              statusText: 'Đang xử lý hoàn tiền'
            }
          }
          return order
        })
      )

      // Show success message
      toast.success("Yêu cầu hoàn tiền đã được gửi", {
        description: "Bạn sẽ nhận được phản hồi trong 24 giờ tới"
      })

      setIsSubmitting(false)
      setRefundDialogOpen(false)
    }, 1500)
  }

  // Handle review form submission
  const handleReviewSubmit = (data: {
    orderItemId: string
    rating: number
    comment: string
    images: File[]
  }) => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Update the order status to reviewed
      setOrdersState(prevOrders =>
        prevOrders.map(order => {
          if (order.id === data.orderItemId && order.orderItemStatus === OrderItemStatus.COMPLETED) {
            return {
              ...order,
              orderItemStatus: OrderItemStatus.REVIEWED,
              statusText: 'Đã đánh giá'
            }
          }
          return order
        })
      )

      // Show success message
      toast.success("Cảm ơn bạn đã đánh giá", {
        description: `Bạn đã đánh giá ${data.rating} sao cho sản phẩm này`
      })

      setIsSubmitting(false)
      setReviewDialogOpen(false)
    }, 1500)
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

  // Render actions buttons based on order status
  const renderActions = (order: Order) => {
    switch (order.orderItemStatus) {
      case OrderItemStatus.DELIVERED:
        return (
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 border border-green-600"
              onClick={() => handleOrderReceived(order.id)}
            >
              Đã nhận được hàng
            </button>
            <button
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 border border-gray-600"
              onClick={() => handleRefundClick(order)}
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
          >
            <FaStar className="mr-2 text-yellow-400"/>
            Đánh giá sản phẩm
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
          {filteredOrders.map(order => (
            <div key={order.id} className="border border-gray-800 rounded-lg overflow-hidden">
              {/* Shop Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="font-medium text-white">{order.shop}</div>
                <div className={`${getStatusStyle(order.orderItemStatus)}`}>{order.statusText}</div>
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

          {filteredOrders.length === 0 && (
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
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
