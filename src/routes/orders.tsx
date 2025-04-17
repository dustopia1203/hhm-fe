import { createFileRoute, Link } from '@tanstack/react-router'
import Header from '@components/features/Header'
import Footer from '@components/features/Footer'
import { FaStar } from 'react-icons/fa'

// Define types for our orders
interface OrderProduct {
  id: string
  name: string
  image: string
  price: number
  originalPrice?: number  // Added originalPrice field as optional
  quantity: number
}

interface Order {
  id: string
  shop: string
  products: OrderProduct[]
  status: 'pending' | 'shipping' | 'delivered' | 'completed' | 'cancelled' | 'refund' | 'reviewed'
  statusText: string
}

export const Route = createFileRoute('/orders')({
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()
  const orderType = search.tab || '1'  // Changed from order_type to tab

  // Mock orders data with updated statuses
  const orders: Order[] = [
    {
      id: 'order1',
      shop: 'TTGShop',
      products: [
        {
          id: 'product1',
          name: 'PlayStation 5',
          image: '/images/products/ps5-1.jpg',
          originalPrice: 99.99,
          price: 89.99,
          quantity: 1
        }
      ],
      status: 'pending',
      statusText: 'Đang xác nhận'
    },
    {
      id: 'order2',
      shop: 'TTGShop',
      products: [
        {
          id: 'product2',
          name: 'PlayStation 5',
          image: '/images/products/ps5-1.jpg',
          originalPrice: 99.99,
          price: 89.99,
          quantity: 1
        }
      ],
      status: 'completed',
      statusText: 'Đã hoàn thành'
    },
    {
      id: 'order3',
      shop: 'TTGShop',
      products: [
        {
          id: 'product3',
          name: 'PlayStation 5',
          image: '/images/products/ps5-1.jpg',
          price: 89.99,
          quantity: 1
        }
      ],
      status: 'shipping',
      statusText: 'Đang vận chuyển'
    },
    {
      id: 'order4',
      shop: 'GameZone',
      products: [
        {
          id: 'product4',
          name: 'Xbox Series X',
          image: '/images/products/xbox.jpg',
          originalPrice: 549.99,
          price: 499.99,
          quantity: 1
        }
      ],
      status: 'delivered',
      statusText: 'Đã giao hàng'
    },
    {
      id: 'order5',
      shop: 'ElectronicHub',
      products: [
        {
          id: 'product7',
          name: 'iPhone 16 Pro Max',
          image: '/images/products/iphone.jpg',
          price: 1299.99,
          quantity: 1
        }
      ],
      status: 'completed',
      statusText: 'Đã hoàn thành'
    },
    {
      id: 'order6',
      shop: 'TTGShop',
      products: [
        {
          id: 'product8',
          name: 'DualSense Controller',
          image: '/images/products/controller.jpg',
          price: 69.99,
          quantity: 2
        }
      ],
      status: 'delivered',
      statusText: 'Đã giao hàng'
    },
    {
      id: 'order7',
      shop: 'GameZone',
      products: [
        {
          id: 'product9',
          name: 'Nintendo Switch OLED',
          image: '/images/products/switch.jpg',
          price: 349.99,
          quantity: 1
        }
      ],
      status: 'reviewed',
      statusText: 'Đã đánh giá'
    },
    {
      id: 'order8',
      shop: 'TechGadgets',
      products: [
        {
          id: 'product10',
          name: 'Samsung Galaxy S24 Ultra',
          image: '/images/products/galaxy.jpg',
          price: 1199.99,
          quantity: 1
        }
      ],
      status: 'reviewed',
      statusText: 'Đã đánh giá'
    }
  ]

  // Filter orders based on orderType
  const filteredOrders = orders.filter(order => {
    switch (orderType) {
      case '1': return order.status === 'pending'
      case '2': return order.status === 'shipping' || order.status === 'delivered' // Include both shipping and delivered
      case '3': return order.status === 'completed' || order.status === 'reviewed' // Include both completed and reviewed
      case '4': return order.status === 'cancelled'
      case '5': return order.status === 'refund'
      default: return true
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

  // Render actions buttons based on order status
  const renderActions = (order: Order) => {
    switch (order.status) {
      case 'delivered': // Only delivered orders have refund button in tab 2
        return (
          <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 border border-gray-600">
            Trả hàng/Hoàn tiền
          </button>
        )
      case 'completed': // Show review button only for completed orders, not for reviewed ones
        return (
          <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 border border-gray-700 flex items-center">
            <FaStar className="mr-2 text-yellow-400" />
            Đánh giá sản phẩm
          </button>
        )
      // For reviewed status, don't return any action buttons
      default:
        return null
    }
  }

  // Generate status label styling
  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-300'
      case 'shipping':
        return 'text-blue-300'
      case 'delivered':
        return 'text-blue-300'
      case 'completed':
        return 'text-green-300'
      case 'reviewed':
        return 'text-green-300'
      case 'cancelled':
        return 'text-red-300'
      case 'refund':
        return 'text-purple-300'
      default:
        return 'text-gray-300'
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow py-6 max-w-6xl mx-auto w-full">
        {/* Navigation Tabs */}
        <div className="border border-gray-800 rounded-lg overflow-hidden mb-6">
          <div className="flex flex-wrap text-center">
            {tabs.map(tab => (
              <Link
                key={tab.type}
                to="/orders"
                search={{ tab: tab.type }}  // Changed from order_type to tab
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
                <div className={`${getStatusStyle(order.status)}`}>{order.statusText}</div>
              </div>

              {/* Products */}
              {order.products.map(product => (
                <div key={product.id} className="flex items-center p-4 gap-4 border-b border-gray-700/30 last:border-b-0">
                  <div className="h-20 w-20 bg-gray-800 rounded-lg overflow-hidden">
                    <div className="h-full w-full flex items-center justify-center bg-blue-100/10">
                      <img src={product.image} alt={product.name} className="max-h-16 max-w-16" />
                    </div>
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-white font-medium">{product.name}</h3>
                    <div className="mt-2">
                      {product.originalPrice ? (
                        <div className="flex items-center">
                          <span className="line-through text-gray-500 mr-2">${product.originalPrice.toFixed(2)}</span>
                          <span className="text-white">${product.price.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="text-white">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-gray-400">
                    × {product.quantity}
                  </div>
                </div>
              ))}

              {/* Actions */}
              {renderActions(order) && (
                <div className="flex justify-end p-4 border-t border-gray-800">
                  {renderActions(order)}
                </div>
              )}
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              Không có đơn hàng nào
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
