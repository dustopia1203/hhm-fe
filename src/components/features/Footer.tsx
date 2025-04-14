import { Link } from "@tanstack/react-router";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 w-full z-10">
      {/* Main footer content */}
      <div className="container mx-auto py-8 px-48">
        <div className="grid grid-cols-6 gap-8">
          {/* Logo and Map */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/vite.svg" alt="HHMShop Logo" className="h-8 w-8" />
              <span className="text-lg font-bold text-white">HHMShop</span>
            </div>
            <div className="border border-gray-700 rounded-lg h-32 flex items-center justify-center bg-gray-700">
              <div className="flex flex-col items-center">
                <FaMapLocationDot className="text-gray-300 mb-2" size={24} />
                <span className="text-sm">Google Map</span>
              </div>
            </div>
          </div>

          {/* About Us */}
          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">Về chúng tôi</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-500 hover:underline text-sm">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-gray-500 hover:underline text-sm">
                  Lịch sử
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-500 hover:underline text-sm">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faqs" className="text-gray-500 hover:underline text-sm">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/guides" className="text-gray-500 hover:underline text-sm">
                  Hướng dẫn
                </Link>
              </li>
              <li>
                <Link to="/support-center" className="text-gray-500 hover:underline text-sm">
                  Trung tâm hỗ trợ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">Chăm sóc khách hàng</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/hotline" className="text-gray-500 hover:underline text-sm">
                  Hotline
                </Link>
              </li>
              <li>
                <Link to="/email" className="text-gray-500 hover:underline text-sm">
                  Email
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-gray-500 hover:underline text-sm">
                  Live Chat
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">Phương thức thanh toán</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/credit-card" className="text-gray-500 hover:underline text-sm">
                  Thẻ tín dụng
                </Link>
              </li>
              <li>
                <Link to="/bank-transfer" className="text-gray-500 hover:underline text-sm">
                  Chuyển khoản
                </Link>
              </li>
              <li>
                <Link to="/momo" className="text-gray-500 hover:underline text-sm">
                  Momo
                </Link>
              </li>
            </ul>
          </div>

          {/* Shipping */}
          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">Đơn vị vận chuyển</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/grab" className="text-gray-500 hover:underline text-sm">
                  GrabExpress
                </Link>
              </li>
              <li>
                <Link to="/ghn" className="text-gray-500 hover:underline text-sm">
                  Giao Hàng Nhanh
                </Link>
              </li>
              <li>
                <Link to="/vnpost" className="text-gray-500 hover:underline text-sm">
                  Vietnam Post
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-white font-medium mb-3">Kết nối</h3>
              <div className="flex space-x-4">
                <Link to="#" className="text-gray-400 hover:text-white">
                  <FaFacebookF size={20} />
                </Link>
                <Link to="#" className="text-gray-400 hover:text-white">
                  <FaTwitter size={20} />
                </Link>
                <Link to="#" className="text-gray-400 hover:text-white">
                  <FaInstagram size={20} />
                </Link>
              </div>
            </div>
            <div className="text-sm text-gray-500">© 2024 HHMShop</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
