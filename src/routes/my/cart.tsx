import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useRef } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";
import Header from "@components/features/Header.tsx";
import Footer from "@components/features/Footer.tsx";
import auth from "@utils/auth.ts";
import { useGetMyCartApi, useDeleteMyCartApi, useAddMyCartApi } from "@apis/useCartApis.ts";
import { useSearchShippingApi } from "@apis/useShippingApis.ts";
import Loader from "@components/common/Loader.tsx";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import useProfileStore from "@stores/useProfileStore.ts";
import { useCodPaymentMyOrderApi, useVNPayPaymentMyOrderApi } from "@apis/useOrderApis.ts";
import { useCreateVNPayPaymentURLApi } from "@apis/usePaymentApis.ts";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  salePrice?: number;
  salePercent?: number;
  quantity: number;
  imageUrl: string;
  shop: string;
  stockStatus: string;
  selected: boolean;
}

interface ShippingMethod {
  id: string;
  name: string;
  avatarUrl: string;
  duration: string;
  price: number;
  status: 'ACTIVE' | 'INACTIVE';
  selected: boolean;
}

export const Route = createFileRoute('/my/cart')({
  beforeLoad: () => auth([]),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const { data, isLoading, error } = useGetMyCartApi();
  const deleteCartMutation = useDeleteMyCartApi();
  const addCartMutation = useAddMyCartApi();
  const createCodOrderMutation = useCodPaymentMyOrderApi();
  const createVNPayPaymentURL = useCreateVNPayPaymentURLApi();
  const createVNPayOrderMutation = useVNPayPaymentMyOrderApi();
  const queryClient = useQueryClient();
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const { profile } = useProfileStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");
  const [couponCode, setCouponCode] = useState("");

  // Ref to track if component is mounted (for cleanup)
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (profile) {
      const fullName = [profile.firstName, profile.middleName, profile.lastName]
        .filter(Boolean)
        .join(" ");

      setShippingName(fullName || "");
      setShippingPhone(profile.phone || "");
      setShippingAddress(profile.address || "");
    }
  }, [profile]);

  // Fetch shipping methods
  const { data: shippingData, isLoading: isLoadingShipping } = useSearchShippingApi({
    status: "ACTIVE",
    pageSize: 100
  });

  useEffect(() => {
    if (shippingData?.data) {
      const methods = shippingData.data.map((method, index) => ({
        id: method.id,
        name: method.name,
        avatarUrl: method.avatarUrl || `/images/shipping/${method.name.toLowerCase().replace(/\s+/g, '')}.png`,
        duration: method.duration,
        price: Number(method.price),
        status: method.status,
        selected: index === 0
      }));
      setShippingMethods(methods);
    }
  }, [shippingData]);

  useEffect(() => {
    if (data?.data) {
      const transformedItems = data.data.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        price: Number(item.price),
        salePrice: item.salePrice ? Number(item.salePrice) : undefined,
        salePercent: item.salePercent,
        quantity: item.amount,
        imageUrl: item.images?.length > 0 ? item.images[0] : "/placeholder.jpg",
        shop: item.shopName,
        stockStatus: `Còn lại ${item.leftCount} sản phẩm`,
        selected: false
      }));
      setCartItems(transformedItems);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể tải giỏ hàng",
        {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss(),
          },
        }
      );
    }
  }, [error]);

  const updateQuantity = async (id: string, change: number) => {
    const cartItem = cartItems.find(item => item.id === id);
    if (!cartItem) return;

    const newQuantity = Math.max(1, cartItem.quantity + change);

    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    try {
      await addCartMutation.mutateAsync({
        productId: cartItem.productId,
        amount: newQuantity
      });

      toast.success("Số lượng đã được cập nhật", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });
    } catch (error: any) {
      setCartItems(items =>
        items.map(item =>
          item.id === id
            ? { ...item, quantity: cartItem.quantity }
            : item
        )
      );

      // Show error message
      toast.error("Không thể cập nhật số lượng. Vui lòng thử lại sau.", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  const removeItem = async (id: string) => {
    try {
      await deleteCartMutation.mutateAsync({ ids: [id] });
      setCartItems(items => items.filter(item => item.id !== id));
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });
      queryClient.invalidateQueries({ queryKey: ["cart/my"] });
    } catch (error: any) {
      toast.error("Không thể xóa sản phẩm. Vui lòng thử lại sau.", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });
    }
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

  const subtotal = cartItems
    .filter(item => item.selected)
    .reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);

  const selectedShippingMethod = shippingMethods.find(m => m.selected);
  const shipping = selectedShippingMethod ? selectedShippingMethod.price * cartItems.filter(item => item.selected).length : 0;

  // const discount = 0;
  const total = subtotal + shipping;
  // - discount;

  const groupedByShop = cartItems.reduce((groups, item) => {
    (groups[item.shop] = groups[item.shop] || []).push(item);
    return groups;
  }, {} as Record<string, CartItem[]>);

  const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);

  // Handle checkout process
  const handleCheckout = async () => {
    // Validate selected items
    const selectedItems = cartItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán", {
        description: "Bạn chưa chọn sản phẩm nào",
      });
      return;
    }

    // Validate shipping information
    if (!shippingName || !shippingPhone || !shippingAddress) {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng", {
        description: "Tên, số điện thoại và địa chỉ là bắt buộc",
      });
      return;
    }

    // Validate shipping method
    if (!selectedShippingMethod) {
      toast.error("Vui lòng chọn phương thức vận chuyển", {
        description: "Bạn chưa chọn phương thức vận chuyển",
      });
      return;
    }

    setIsCheckingOut(true);

    try {
      if (selectedPaymentMethod === "cod") {
        // Create order request
        const orderRequest = {
          shippingId: selectedShippingMethod.id,
          address: shippingAddress,
          orderItemCreateRequests: selectedItems.map(item => ({
            productId: item.productId,
            price: item.salePrice || item.price,
            amount: item.quantity
          }))
        };

        // Call create order API
        await createCodOrderMutation.mutateAsync(orderRequest);

        // Show success message
        toast.success("Đặt hàng thành công", {
          description: "Đơn hàng của bạn đã được tạo thành công"
        });

        // Delete selected items from cart
        const selectedIds = selectedItems.map(item => item.id);
        await deleteCartMutation.mutateAsync({ ids: selectedIds });

        // Invalidate cart query to refresh data
        await queryClient.invalidateQueries({ queryKey: ["cart/my"] });

        // Navigate to orders page
        await navigate({ to: "/my/orders" });
      } else if (selectedPaymentMethod === "vnpay") {
        // Create a named function for the event listener
        const handleVNPayCallback = async (event) => {
          if (event.data && event.data.success === true && event.data.vnp_TransactionNo) {
            console.log("VNPay callback received:", event.data);

            try {
              // Remove listener
              window.removeEventListener("message", handleVNPayCallback);

              const { vnp_TransactionNo } = event.data;

              // Create order request
              const orderRequest = {
                shippingId: selectedShippingMethod.id,
                address: shippingAddress,
                orderItemCreateRequests: selectedItems.map(item => ({
                  productId: item.productId,
                  price: item.salePrice || item.price,
                  amount: item.quantity
                })),
                transactionNumber: vnp_TransactionNo
              };

              // Call create order API
              await createVNPayOrderMutation.mutateAsync(orderRequest);

              // Show success message
              toast.success("Đặt hàng thành công", {
                description: "Thanh toán VNPay đã được xác nhận"
              });

              // Delete selected items from cart
              const selectedIds = selectedItems.map(item => item.id);
              await deleteCartMutation.mutateAsync({ ids: selectedIds });

              // Invalidate cart query to refresh data
              await queryClient.invalidateQueries({ queryKey: ["cart/my"] });

              // Navigate to orders page
              navigate({ to: "/my/orders" });
            } catch (error) {
              console.error("VNPay order error:", error);
              toast.error("Không thể tạo đơn hàng", {
                description: error?.message || "Đã xảy ra lỗi, vui lòng thử lại sau"
              });
              setIsCheckingOut(false);
            }
          } else if (event.data && event.data.success === false) {
            // Payment failed
            window.removeEventListener("message", handleVNPayCallback);
            toast.error("Thanh toán VNPay thất bại", {
              description: event.data.errorMessage || "Vui lòng thử lại hoặc chọn phương thức thanh toán khác"
            });
            setIsCheckingOut(false);
          }
        };

        // Add event listener before opening popup
        window.addEventListener("message", handleVNPayCallback);

        try {
          const paymentURLResponse = await createVNPayPaymentURL.mutateAsync({
            orderInfo: `Thanh toán đơn hàng HHMShop ${Date.now()}`,
            amount: total,
            language: "vn"
          });

          const paymentURL = paymentURLResponse.data;

          // Open payment window
          const popupWindow = window.open(paymentURL, "Thanh toán VNPay", "width=1000,height=600");

          // If popup fails to open
          if (!popupWindow) {
            window.removeEventListener("message", handleVNPayCallback);
            setIsCheckingOut(false);
            throw new Error("Không thể mở cửa sổ thanh toán. Vui lòng kiểm tra trình duyệt của bạn.");
          }

          // Simple check if popup is closed
          const popupCheckInterval = setInterval(() => {
            if (popupWindow.closed) {
              clearInterval(popupCheckInterval);
              window.removeEventListener("message", handleVNPayCallback);
              setIsCheckingOut(false);
            }
          }, 1000);

          return;
        } catch (error) {
          window.removeEventListener("message", handleVNPayCallback);
          setIsCheckingOut(false);
          throw error;
        }
      } else {
        // For other payment methods (placeholder for future implementation)
        toast.info("Phương thức thanh toán đang được phát triển", {
          description: "Chức năng thanh toán sẽ sớm được triển khai"
        });
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error("Không thể tạo đơn hàng", {
        description: error?.message || "Đã xảy ra lỗi, vui lòng thử lại sau"
      });
    } finally {
      if (isMounted.current) {
        setIsCheckingOut(false);
      }
    }
  };

  const handleClickPaymentMethod = (paymentMethod: string) => {
    setIsCheckingOut(false);
    setSelectedPaymentMethod(paymentMethod);
  }

  if (isLoading || isLoadingShipping) {
    return (
      <div className="flex flex-col min-h-screen w-full">
        <Header/>
        <div className="flex-grow flex items-center justify-center">
          <Loader/>
        </div>
        <Footer/>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen w-full">
        <Header/>

        {/* Main content */}
        <div className="container text-white mx-auto px-6 lg:px-48 py-6">
          <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              Giỏ hàng trống
            </div>
          ) : (
            <>
              {/* Header row */}
              <div
                className="border border-gray-800 rounded-lg p-3 mb-4 grid grid-cols-[auto_2fr_1fr_1fr_1fr_auto] gap-4 items-center bg-gray-800">
                <div className="px-1">
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
                          {item.salePrice ? (
                            <>
                              <span className="text-white">₫{item.salePrice.toFixed(2)}</span>
                              <span className="text-gray-400 line-through">₫{item.price.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="text-white">₫{item.price.toFixed(2)}</span>
                          )}
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center">
                          <div className="flex items-center border border-gray-700 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="px-3 py-1 text-gray-400 hover:text-white"
                              disabled={item.quantity <= 1 || addCartMutation.isPending}
                            >
                              <FiMinus size={14}/>
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="px-3 py-1 text-gray-400 hover:text-white"
                              disabled={addCartMutation.isPending}
                            >
                              <FiPlus size={14}/>
                            </button>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="text-white font-medium">
                          ₫{((item.salePrice || item.price) * item.quantity).toFixed(2)}
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-white p-1"
                          disabled={deleteCartMutation.isPending}
                        >
                          <FaTrashAlt size={20}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Shipping Information */}
              <div className="border border-gray-800 rounded-xl p-5 mb-6">
                <h2 className="text-lg font-medium mb-4">Địa chỉ giao hàng</h2>
                <form className="grid grid-cols-1 gap-4">
                  <div className="form-group">
                    <label htmlFor="shipping-name" className="block text-sm text-gray-400 mb-1">Họ tên</label>
                    <input
                      id="shipping-name"
                      type="text"
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      placeholder="Nhập họ và tên"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-gray-600"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="shipping-phone" className="block text-sm text-gray-400 mb-1">Số điện thoại</label>
                    <input
                      id="shipping-phone"
                      type="tel"
                      value={shippingPhone}
                      onChange={(e) => setShippingPhone(e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-gray-600"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="shipping-address" className="block text-sm text-gray-400 mb-1">Địa chỉ</label>
                    <input
                      id="shipping-address"
                      type="text"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Nhập địa chỉ giao hàng"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-gray-600"
                    />
                  </div>
                </form>
              </div>

              {/* Shipping Methods from API */}
              {shippingMethods.length > 0 && (
                <div className="border border-gray-800 rounded-xl mb-6">
                  <h2 className="text-lg font-medium p-5 border-b border-gray-800">Phương thức vận chuyển</h2>
                  <h4 className="text-sm text-yellow-400 font-medium px-5 border-b border-gray-800">Lưu ý: tiền dịch vụ vận chuyển sẽ được tính riêng theo mỗi đơn hàng </h4>

                  {shippingMethods.filter(method => method.status === 'ACTIVE').map((method) => (
                    <div key={method.id}
                         className="px-5 py-4 flex items-center border-b border-gray-800 last:border-b-0">
                      <input
                        type="checkbox"
                        className="mr-4 h-4 w-4 accent-gray-600"
                        checked={method.selected}
                        onChange={() => selectShippingMethod(method.id)}
                      />
                      <div
                        className="h-14 w-14 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                        <img
                          src={method.avatarUrl}
                          alt={method.name}
                          className="h-10 w-10 object-contain"
                        />
                      </div>
                      <div className="ml-3 flex-grow">
                        <p className="text-white">{method.name}</p>
                        <p className="text-xs text-gray-400">{method.duration}</p>
                      </div>
                      <div className="text-white font-medium">
                        ₫{method.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Order Summary */}
              <div className="border-t border-gray-800 pt-6 mb-6">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">Tổng tiền hàng</span>
                  <span className="text-white">₫{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">Tổng tiền vận chuyển</span>
                  <span className="text-white">₫{shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-800 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Tổng số tiền thanh toán</span>
                    <span className="text-xl font-bold">₫{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4">Phương thức thanh toán</h2>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => handleClickPaymentMethod("vnpay")}
                    className={`w-48 h-14 flex items-center justify-center rounded-lg border ${
                      selectedPaymentMethod === "vnpay"
                        ? "border-white"
                        : "border-gray-700 text-gray-300"
                    }`}
                  >
                    <div className="flex">
                      <img
                        src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
                        alt="VNPay logo"
                        className="h-6 mr-2"
                      />
                      <span>VNPay</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleClickPaymentMethod("cod")}
                    className={`w-48 h-14 flex items-center justify-center rounded-lg border ${
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
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="bg-white text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                  {isCheckingOut ? "Đang xử lý..." : "Đặt hàng"}
                </button>
              </div>
            </>
          )}
        </div>

        <Footer/>
      </div>
    </>
  )
}
