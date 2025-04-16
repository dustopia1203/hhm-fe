import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";
import { FiMinus, FiPlus, FiX } from "react-icons/fi";
import Header from "@components/features/Header";
import Footer from "@components/features/Footer";

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  imageUrl: string;
  shop: string;
  stockStatus: string;
  selected: boolean;  // Added selected property
}

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  duration: string;
  selected: boolean;
}

export const Route = createFileRoute('/cart')({
  component: RouteComponent,
})

function RouteComponent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "PlayStation 5",
      price: 89.99,
      originalPrice: 100.00,
      quantity: 1,
      imageUrl: "/images/products/ps5-1.jpg",
      shop: "TTGShop",
      stockStatus: "Còn lại 10 sản phẩm",
      selected: false
    },
    {
      id: "2",
      name: "iPhone 16 Pro Max",
      price: 1000,
      quantity: 1,
      imageUrl: "/images/products/iphone-1.jpg",
      shop: "TTGShop",
      stockStatus: "Còn lại 10 sản phẩm",
      selected: false
    },
    {
      id: "3",
      name: "XBox S",
      price: 89.99,
      originalPrice: 100.00,
      quantity: 1,
      imageUrl: "/images/products/xbox-1.jpg",
      shop: "TTGShop",
      stockStatus: "Còn lại 10 sản phẩm",
      selected: false
    },
    {
      id: "4",
      name: "PlayStation 5",
      price: 89.99,
      originalPrice: 100.00,
      quantity: 1,
      imageUrl: "/images/products/ps5-1.jpg",
      shop: "GameZone",
      stockStatus: "Còn lại 5 sản phẩm",
      selected: false
    },
    {
      id: "5",
      name: "iPhone 16 Pro Max",
      price: 1000,
      quantity: 1,
      imageUrl: "/images/products/iphone-1.jpg",
      shop: "GameZone",
      stockStatus: "Còn lại 8 sản phẩm",
      selected: false
    },
    {
      id: "6",
      name: "XBox S",
      price: 89.99,
      originalPrice: 100.00,
      quantity: 1,
      imageUrl: "/images/products/xbox-1.jpg",
      shop: "GameZone",
      stockStatus: "Còn lại 12 sản phẩm",
      selected: false
    }
  ]);

  // Global shipping methods not tied to any shop
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([
    { id: "express", name: "Giao hàng nhanh", price: 3.99, duration: "2-3 ngày", selected: true },
    { id: "standard", name: "Giao hàng tiêu chuẩn", price: 1.99, duration: "3-5 ngày", selected: false },
    { id: "economy", name: "Giao hàng tiết kiệm", price: 0.99, duration: "5-7 ngày", selected: false }
  ]);

  const [couponCode, setCouponCode] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");

  const updateQuantity = (id: string, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const toggleItemSelection = (id: string) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const toggleAllSelection = (selected: boolean) => {
    setCartItems(items =>
      items.map(item => ({ ...item, selected }))
    );
  };

  const selectShippingMethod = (methodId: string) => {
    setShippingMethods(prev =>
      prev.map(method => ({
        ...method,
        selected: method.id === methodId
      }))
    );
  };

  // Calculate summary values
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calculate shipping based on selected method (just one method now)
  const selectedShippingMethod = shippingMethods.find(m => m.selected);
  const shipping = selectedShippingMethod ? selectedShippingMethod.price : 0;

  const discount = 100;
  const total = subtotal + shipping - discount;

  const groupedByShop = cartItems.reduce((groups, item) => {
    (groups[item.shop] = groups[item.shop] || []).push(item);
    return groups;
  }, {} as Record<string, CartItem[]>);

  // Check if all items are selected
  const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);

  return (
    <>
      <div className="flex flex-col min-h-screen w-full bg-gray-900">
        <Header />

        {/* Main content */}
        <div className="w-full text-white px-48 py-6">
          <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>

          {/* Header row */}
          <div className="border border-gray-800 rounded-lg p-3 mb-4 grid grid-cols-[auto_2fr_1fr_1fr_1fr_auto] gap-4 items-center bg-gray-800">
            <div className="pl-2">
              <input
                type="checkbox"
                className="h-4 w-4 accent-gray-600"
                checked={allSelected}
                onChange={(e) => toggleAllSelection(e.target.checked)}
              />
            </div>
            <div className="text-sm font-medium">Tên sản phẩm</div>
            <div className="text-sm font-medium">Đơn giá</div>
            <div className="text-sm font-medium">Số lượng</div>
            <div className="text-sm font-medium">Số tiền</div>
            <div></div>
          </div>

          {/* Cart Items by Shop */}
          {Object.entries(groupedByShop).map(([shop, items]) => (
            <div key={shop} className="mb-6 border border-gray-800 rounded-xl overflow-hidden">
              {/* Shop Header */}
              <div className="bg-gray-800 px-4 py-3 flex items-center">
                <input
                  type="checkbox"
                  className="mr-4 h-4 w-4 accent-gray-600"
                  checked={items.every(item => item.selected)}
                  onChange={(e) => {
                    const selected = e.target.checked;
                    setCartItems(cartItems =>
                      cartItems.map(item =>
                        item.shop === shop ? { ...item, selected } : item
                      )
                    );
                  }}
                />
                <span className="text-white font-medium">{shop}</span>
              </div>

              {/* Items from this shop */}
              {items.map(item => (
                <div key={item.id} className="border-t border-gray-800 py-4 px-4">
                  <div className="flex items-center flex-wrap md:grid grid-cols-[auto_2fr_1fr_1fr_1fr_auto] gap-4">
                    {/* Checkbox */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-4 h-4 w-4 accent-gray-600"
                        checked={item.selected}
                        onChange={() => toggleItemSelection(item.id)}
                      />
                    </div>

                    {/* Product info */}
                    <div className="flex items-center">
                      <div className="h-16 w-16 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden">
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover"/>
                      </div>
                      <div className="ml-3">
                        <p className="text-white">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{item.stockStatus}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex flex-col">
                      {item.originalPrice ? (
                        <>
                          <span className="text-gray-400 line-through">${item.originalPrice.toFixed(2)}</span>
                          <span className="text-white">${item.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="text-white">${item.price.toFixed(2)}</span>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center">
                      <div className="flex items-center border border-gray-700 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-3 py-1 text-gray-400 hover:text-white"
                        >
                          <FiMinus size={14}/>
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-3 py-1 text-gray-400 hover:text-white"
                        >
                          <FiPlus size={14}/>
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="text-white font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <FiX size={20}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Shipping Information */}
          <div className="border border-gray-800 rounded-xl p-5 mb-6">
            <h2 className="text-lg font-medium mb-4">Địa chỉ giao hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-white">John Doe (+00) 000000000</p>
              </div>
              <div>
                <p className="text-white">Nguyễn Văn Trỗi, An Lạc, Hà Đông, Hà Nội</p>
              </div>
            </div>
          </div>

          {/* Shipping Methods - Now global, not tied to shops */}
          <div className="border border-gray-800 rounded-xl mb-6">
            <h2 className="text-lg font-medium p-5 border-b border-gray-800">Phương thức vận chuyển</h2>

            {shippingMethods.map((method) => (
              <div key={method.id} className="px-5 py-4 flex items-center border-b border-gray-800 last:border-b-0">
                <input
                  type="checkbox"
                  className="mr-4 h-4 w-4 accent-gray-600"
                  checked={method.selected}
                  onChange={() => selectShippingMethod(method.id)}
                />
                <div className="h-14 w-14 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                  <img
                    src={method.id === "express" ? "/images/shipping/express.png" : "/images/shipping/standard.png"}
                    alt={method.name}
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <div className="ml-3 flex-grow">
                  <p className="text-white">{method.name}</p>
                  <p className="text-xs text-gray-400">{method.duration}</p>
                </div>
                <div className="text-white font-medium">
                  ${method.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Discount Code */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">Nhập mã giảm giá</h2>
            <div className="flex">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon Code"
                className="flex-grow bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-gray-600"
              />
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-r-lg">
                Apply
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-800 pt-6 mb-6">
            <div className="flex justify-between mb-3">
              <span className="text-gray-400">Tổng tiền hàng</span>
              <span className="text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-400">Tổng tiền vận chuyển</span>
              <span className="text-white">${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-400">Giảm giá</span>
              <span className="text-white">-${discount.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-800 pt-3 mt-3">
              <div className="flex justify-between">
                <span className="text-lg font-bold">Tổng số tiền thanh toán</span>
                <span className="text-xl font-bold">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Phương thức thanh toán</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setSelectedPaymentMethod("vnpay")}
                className={`px-6 py-3 rounded-lg border ${
                  selectedPaymentMethod === "vnpay"
                    ? "border-white"
                    : "border-gray-700 text-gray-300"
                }`}
              >
                VNPay
              </button>
              <button
                onClick={() => setSelectedPaymentMethod("cod")}
                className={`px-6 py-3 rounded-lg border ${
                  selectedPaymentMethod === "cod"
                    ? "border-white"
                    : "border-gray-700 text-gray-300"
                }`}
              >
                Thanh toán khi nhận hàng
              </button>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="flex justify-end">
            <button className="bg-white text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors">
              Đặt hàng
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}