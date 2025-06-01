import { Link } from "@tanstack/react-router";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 w-full z-10 shadow-[0_-1px_3px_0px_rgba(0,0,0,0.1),0_-1px_2px_-1px_rgba(0,0,0,0.1)]">
      {/* Main footer content */}
      <div className="container mx-auto py-8 px-48">
        <div className="grid grid-cols-6 gap-8">
          {/* Logo and Map */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/vite.svg" alt="HHMShop Logo" className="h-8 w-8" />
              <span className="text-lg font-bold text-white">HHMShop</span>
            </div>
            <div className="rounded-lg h-32 overflow-hidden">
              {/* Google Map Embed */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.2924008216164!2d105.78741649999999!3d20.980913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135accdd8a1ad71%3A0xa2f9b16036648187!2zSOG7jWMgdmnhu4duIEPDtG5nIG5naOG7hyBCxrB1IGNow61uaCB2aeG7hW4gdGjDtG5n!5e0!3m2!1svi!2s!4v1744640011823!5m2!1svi!2s"
                className="w-full h-full"
                style={{border: 0}}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="HHMShop Location"
              ></iframe>
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
