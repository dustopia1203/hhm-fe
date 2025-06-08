import { useEffect, useState } from "react";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { FaBell } from "react-icons/fa6";
import { BsReceiptCutoff } from "react-icons/bs";
import { RxAvatar } from "react-icons/rx";
import { Link, useNavigate } from "@tanstack/react-router";
import useProfileStore from "@stores/useProfileStore.ts";
import Logout from "./Logout.tsx";
import { useGetAccountProfileApi } from "@apis/useAccountApis.ts";
import { useDebounce } from "@hooks/useDebounce.ts";
import { useSuggestProductsApi } from "@apis/useProductApis.ts";

interface ProductSuggestion {
  id: string;
  name: string;
  description: string;
  shopId: string;
  categoryId: string;
  price: number;
  amount: number;
  status: string;
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const { profile, setProfile } = useProfileStore();
  const { refetch } = useGetAccountProfileApi({ enabled: false });
  const { data: suggestions } = useSuggestProductsApi(debouncedSearchQuery);
  const navigate = useNavigate();

  let timeoutId: NodeJS.Timeout;

  useEffect(() => {
    if (!profile) {
      const fetchProfile = async () => {
        const accessToken = localStorage.getItem("access_token");

        if (accessToken) {
          try {
            const result = await refetch();
            if (result.data?.data) {
              setProfile(result.data.data);
            }
          } catch (error) {
            console.error("Failed to fetch profile:", error);

            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("remember_me");
          }
        }
      };

      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsMenuOpen(false);
    }, 200);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/products", search: { keyword: searchQuery } });
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productName: string) => {
      setSearchQuery(productName);
      setShowSuggestions(false);
      navigate({ to: "/products", search: { keyword: productName } });
    };

  return (
    <header className="shadow-md bg-gray-800 top-0 left-0 w-full z-50">
      {/* Top bar */}
      <div className="relative container mx-auto flex items-center justify-between py-4 px-48 text-gray-400 text-sm">
        <div className="space-x-2">
          <Link to="/my/shop" className="text-gray-500 hover:underline">
            Kênh người bán
          </Link>

          <span>|</span>

          <Link to="/support" className="text-gray-500 hover:underline">
            Hỗ trợ
          </Link>
        </div>
        {/* Checking logged in */}
        {profile ?
          // Logged in -> notification + avatar
          (
            <div className="relative flex items-center space-x-4">
              {/* Notification */}
              <FaBell className="text-gray-300 cursor-pointer" size={20}/>
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Avatar - conditionally render based on profile.avatarUrl */}
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="Avatar"
                    className="h-6 w-6 rounded-full cursor-pointer object-cover"
                  />
                ) : (
                  <RxAvatar size={24} className="cursor-pointer text-gray-300"/>
                )}

                {/* Menu when hover */}
                {isMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                    <ul className="py-2">
                      <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Đơn mua</li>
                      <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                        <Link to="/my/profile">Tài khoản</Link>
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer"><Logout /></li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )
          :
          // Unlogged in -> Login/Register
          (
            <div className="space-x-2">
              <Link to="/login" className="text-gray-500 hover:underline">
                Đăng nhập
              </Link>
              <span>|</span>
              <Link to="/register" className="text-gray-500 hover:underline">
                Đăng ký
              </Link>
            </div>
          )}

        <div className="absolute bottom-0 left-48 right-48 h-[1px] bg-gray-700"></div>

      </div>

      <div className="container mx-auto flex items-center justify-between py-4 px-48">
        <div className="flex items-center space-x-2">
          <img src="/vite.svg" alt="HHMShop Logo" className="h-8 w-8"/>
          <Link to="/" className="text-lg font-bold text-white">HHMShop</Link>
        </div>

        {/* Search bar */}
        <form className="flex-1 mx-6 relative" onSubmit={handleSearch}>
          <input
            type="text"
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Tìm kiếm sản phẩm"
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <button
            type="submit"
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          >
            <FiSearch size={20}/>
          </button>
          
          {/* Suggestions dropdown */}
          {showSuggestions && suggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
              <ul className="py-2">
                {suggestions.slice(0, 5).map((product: ProductSuggestion) => (
                  <li
                    key={product.id}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-300"
                    onClick={() => handleSuggestionClick(product.name)}
                  >
                    {product.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>

        {/* Orders + Cart */}
        <div className="flex items-center space-x-4">
          <Link to="/my/orders" search={{ tab: null }}>
            <BsReceiptCutoff className="text-gray-300 cursor-pointer" size={24}/>
          </Link>
          <Link to="/my/cart">
            <FiShoppingCart className="text-gray-300 cursor-pointer" size={22}/>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
