import { Link } from "@tanstack/react-router";
import { FiMenu } from "react-icons/fi";
import { useState } from "react";

// Data structure for categories and subcategories
const categoriesData = [
  {
    id: "electronics",
    name: "Điện thoại & Máy tính bảng",
    subcategories: [
      { id: "smartphones", name: "Điện thoại thông minh", path: "/category/electronics/smartphones" },
      { id: "tablets", name: "Máy tính bảng", path: "/category/electronics/tablets" },
      { id: "accessories", name: "Phụ kiện", path: "/category/electronics/accessories" },
      { id: "wearables", name: "Thiết bị đeo", path: "/category/electronics/wearables" },
    ]
  },
  {
    id: "laptops",
    name: "Laptop & Máy tính",
    subcategories: [
      { id: "laptops", name: "Laptop", path: "/category/laptops/notebooks" },
      { id: "desktops", name: "Máy tính để bàn", path: "/category/laptops/desktops" },
      { id: "components", name: "Linh kiện máy tính", path: "/category/laptops/components" },
      { id: "monitors", name: "Màn hình", path: "/category/laptops/monitors" },
    ]
  },
  {
    id: "cameras",
    name: "Máy ảnh & Quay phim",
    subcategories: [
      { id: "dslr", name: "Máy ảnh DSLR", path: "/category/cameras/dslr" },
      { id: "mirrorless", name: "Máy ảnh không gương lật", path: "/category/cameras/mirrorless" },
      { id: "lenses", name: "Ống kính", path: "/category/cameras/lenses" },
      { id: "accessories", name: "Phụ kiện", path: "/category/cameras/accessories" },
    ]
  },
  {
    id: "tv",
    name: "TV & Thiết bị điện tử",
    subcategories: [
      { id: "tvs", name: "Tivi", path: "/category/tv/televisions" },
      { id: "audio", name: "Âm thanh", path: "/category/tv/audio" },
      { id: "projectors", name: "Máy chiếu", path: "/category/tv/projectors" },
      { id: "streaming", name: "Thiết bị phát trực tuyến", path: "/category/tv/streaming" },
    ]
  },
  {
    id: "fashion",
    name: "Thời trang",
    subcategories: [
      { id: "men", name: "Thời trang nam", path: "/category/fashion/men" },
      { id: "women", name: "Thời trang nữ", path: "/category/fashion/women" },
      { id: "kids", name: "Thời trang trẻ em", path: "/category/fashion/kids" },
      { id: "accessories", name: "Phụ kiện thời trang", path: "/category/fashion/accessories" },
    ]
  },
  {
    id: "home",
    name: "Nhà cửa & Đời sống",
    subcategories: [
      { id: "furniture", name: "Nội thất", path: "/category/home/furniture" },
      { id: "kitchenware", name: "Đồ dùng nhà bếp", path: "/category/home/kitchenware" },
      { id: "decoration", name: "Trang trí nhà cửa", path: "/category/home/decoration" },
      { id: "bedding", name: "Chăn ga gối đệm", path: "/category/home/bedding" },
    ]
  },
  {
    id: "beauty",
    name: "Làm đẹp",
    subcategories: [
      { id: "skincare", name: "Chăm sóc da", path: "/category/beauty/skincare" },
      { id: "makeup", name: "Trang điểm", path: "/category/beauty/makeup" },
      { id: "haircare", name: "Chăm sóc tóc", path: "/category/beauty/haircare" },
      { id: "fragrances", name: "Nước hoa", path: "/category/beauty/fragrances" },
    ]
  },
  {
    id: "books",
    name: "Sách & Văn phòng phẩm",
    subcategories: [
      { id: "fiction", name: "Tiểu thuyết", path: "/category/books/fiction" },
      { id: "nonfiction", name: "Sách phi hư cấu", path: "/category/books/nonfiction" },
      { id: "stationery", name: "Văn phòng phẩm", path: "/category/books/stationery" },
      { id: "gifts", name: "Quà tặng", path: "/category/books/gifts" },
    ]
  },
];

interface CategoriesProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function Categories({ isOpen, onMouseEnter, onMouseLeave }: CategoriesProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryHover = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

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
              <div className="flex">
                {/* Main categories (scrollable list) */}
                <div className="w-1/4 pr-4 max-h-80 overflow-y-auto">
                  <ul>
                    {categoriesData.map((category) => (
                      <li
                        key={category.id}
                        className={`py-2 px-3 rounded text-gray-300 hover:text-white hover:bg-gray-600 cursor-pointer transition-colors ${
                          activeCategory === category.id ? 'bg-gray-600 text-white' : ''
                        }`}
                        onMouseEnter={() => handleCategoryHover(category.id)}
                      >
                        <Link to={`/category/${category.id}`} className="block">
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Subcategories */}
                <div className="w-3/4 pl-4 border-l border-gray-600">
                  {activeCategory && (
                    <div>
                      <h3 className="text-white font-medium mb-4">
                        {categoriesData.find(c => c.id === activeCategory)?.name}
                      </h3>
                      <ul className="grid grid-cols-3 gap-3">
                        {categoriesData
                          .find(c => c.id === activeCategory)
                          ?.subcategories.map(sub => (
                            <li key={sub.id} className="text-gray-300 hover:text-white">
                              <Link to={sub.path} className="block py-1">
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Categories;