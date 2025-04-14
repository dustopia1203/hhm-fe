import { Link } from "@tanstack/react-router";
import { FiMenu } from "react-icons/fi";

interface CategoriesProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function Categories({ isOpen, onMouseEnter, onMouseLeave }: CategoriesProps) {
  return (
    <div className="relative bg-gray-800 border-t border-gray-700">
      <div
        className="container mx-auto px-48 py-2"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="flex items-center">
          <div className="flex items-center cursor-pointer text-gray-300 hover:text-white">
            <FiMenu className="mr-2" size={20} />
            <span>Danh mục sản phẩm</span>
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute left-0 top-full w-full bg-gray-700 shadow-lg z-50">
            <div className="container mx-auto px-48 py-4">
              <ul className="grid grid-cols-4 gap-4">
                <li className="text-gray-300 hover:text-white">
                  <Link to="/category/electronics" className="block">Điện thoại & Máy tính bảng</Link>
                </li>
                <li className="text-gray-300 hover:text-white">
                  <Link to="/category/laptops" className="block">Laptop & Máy tính</Link>
                </li>
                <li className="text-gray-300 hover:text-white">
                  <Link to="/category/cameras" className="block">Máy ảnh & Quay phim</Link>
                </li>
                <li className="text-gray-300 hover:text-white">
                  <Link to="/category/tv" className="block">TV & Thiết bị điện tử</Link>
                </li>
                <li className="text-gray-300 hover:text-white">
                  <Link to="/category/fashion" className="block">Thời trang</Link>
                </li>
                <li className="text-gray-300 hover:text-white">
                  <Link to="/category/home" className="block">Nhà cửa & Đời sống</Link>
                </li>
                <li className="text-gray-300 hover:text-white">
                  <Link to="/category/beauty" className="block">Làm đẹp</Link>
                </li>
                <li className="text-gray-300 hover:text-white">
                  <Link to="/category/books" className="block">Sách & Văn phòng phẩm</Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Categories;