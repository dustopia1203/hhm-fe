import { useState } from "react";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { FaBell, FaTruck } from "react-icons/fa6";
import { RxAvatar } from "react-icons/rx";
import { Link } from "@tanstack/react-router";
import useProfileStore from "@stores/useProfileStore.ts";
import Logout from "./Logout.tsx";
import { useGetAllCategoriesApi } from "@apis/useCategoryApis.tsx";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const profile = useProfileStore(state => state.profile)
  const { data: categoryData } = useGetAllCategoriesApi();
  const categories = Array.isArray(categoryData?.data) ? categoryData.data : [];

  let timeoutId: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsMenuOpen(false);
    }, 200);
  };

  const handleCategoryEnter = () => {
    clearTimeout(timeoutId);
    setIsCategoryOpen(true);
  };

  const handleCategoryLeave = () => {
    timeoutId = setTimeout(() => {
      setIsCategoryOpen(false);
    }, 200);
  };

  return (
    <header className="shadow-md bg-gray-800 fixed top-0 left-0 w-full z-50">
      {/* Top bar */}
      <div className="shadow-md flex justify-between items-center text-gray-400 text-sm py-2 px-48">
        <Link to="#" className="text-gray-500 hover:underline">
          Hỗ trợ
        </Link>
        {/* Checking logged in */}
        {profile ?
          // Logged in -> notification + avatar
          (
            <div className="relative flex items-center space-x-4">
              {/* Notification */}
              <FaBell className="text-gray-300 cursor-pointer" size={20} />
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Avatar */}
                <RxAvatar size={24} className="cursor-pointer" />
                {/* Menu when hover */}
                {isMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                    <ul className="py-2">
                      <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Đơn mua</li>
                      <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Tài khoản</li>
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
      </div>
      {/* Main header */}
      <div className="container mx-auto flex items-center justify-between py-4 px-48">
        <div className="flex items-center space-x-2">
          <img src="/vite.svg" alt="HHMShop Logo" className="h-8 w-8" />
          <Link to="/" className="text-lg font-bold text-white">HHMShop</Link>
        </div>
        {/* Search bar */}
        <form className="flex-1 mx-6 relative">
          <input
            type="text"
            name="search"
            placeholder="Tìm kiếm sản phẩm"
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <button
            type="submit"
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          >
            <FiSearch size={20} />
          </button>
        </form>
        {/* Shipping + Cart */}
        <div className="flex items-center space-x-4">
          <Link to="#">
            <FaTruck className="text-gray-300 cursor-pointer" size={24} />
          </Link>
          <Link to="#">
            <FiShoppingCart className="text-gray-300 cursor-pointer" size={22} />
          </Link>
        </div>
      </div>
      <div
        className="bg-gray-800 text-white py-2 px-4 border-b border-gray-700 relative z-40 inline-flex items-center gap-2 cursor-pointer"
        onMouseEnter={handleCategoryEnter}
        onMouseLeave={handleCategoryLeave}
      >
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-lg font-semibold">☰</span>
          <h2 className="text-base font-medium">
            Danh mục sản phẩm
          </h2>
        </div>
        {/* Dropdown menu */}
        {isCategoryOpen && (
          <div className="absolute top-full left-0 w-64 bg-gray-700 shadow-lg z-50 rounded-md">
            <ul className="py-2">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-sm"
                >
                  {category.name}
                </li>
              ))}
            </ul>
          </div>  
        )}
      </div>
    </header>
  );
}

export default Header;
