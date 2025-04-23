import { Link } from '@tanstack/react-router';
import { FiBarChart2, FiHome, FiPackage, FiSettings, FiShoppingBag, FiUsers } from 'react-icons/fi';

function ShopSidebar() {
  const menuItems = [
    { icon: <FiHome size={20} />, label: 'Tổng quan', path: '/my/shop/' },
    { icon: <FiPackage size={20} />, label: 'Sản phẩm', path: '/my/shop/products' },
    { icon: <FiShoppingBag size={20} />, label: 'Đơn hàng', path: '/my/shop/orders' },
    { icon: <FiUsers size={20} />, label: 'Đánh giá', path: '/my/shop/reviews' },
    { icon: <FiBarChart2 size={20} />, label: 'Thống kê', path: '/my/shop/analytics' },
    { icon: <FiSettings size={20} />, label: 'Cài đặt', path: '/my/shop/settings' },
  ];

  return (
    <div className="bg-gray-800 h-full w-64">
      <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
        <div className="text-white font-medium truncate">Quản lý cửa hàng</div>
      </div>

      <nav className="p-3 space-y-2 overflow-y-auto max-h-[calc(100vh-12rem)]">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            activeProps={{ className: 'bg-gray-700' }}
            className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200 px-4 py-2.5"
          >
            <span>{item.icon}</span>
            <span className="ml-3 truncate">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default ShopSidebar;
