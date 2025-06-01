import { Link, useMatchRoute } from '@tanstack/react-router';
import { FiBarChart2, FiHome, FiPackage, FiSettings, FiShoppingBag, FiUsers } from 'react-icons/fi';

function ShopSidebar() {
  const matchRoute = useMatchRoute();

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
        {menuItems.map((item, index) => {
          // Check for exact path match or if it's a sub-path (but not for the home path)
          const isExactMatch = matchRoute({ to: item.path, fuzzy: false });
          const isSubPath = item.path !== '/my/shop/' && matchRoute({ to: item.path, fuzzy: true });
          const isActive = isExactMatch || isSubPath;

          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200 px-4 py-2.5 ${
                isActive ? 'bg-gray-700 text-white' : ''
              }`}
            >
              <span>{item.icon}</span>
              <span className="ml-3 truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default ShopSidebar;
