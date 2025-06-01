import { Link } from "@tanstack/react-router";
import { FiMenu } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useSearchCategories, useGetCategoryTreeById } from "@apis/useCategoryApis.ts";
import Loader from "@components/common/Loader";

interface Category {
  id: string;
  name: string;
  subCategories?: Category[];
}

interface CategoriesProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function Categories({ isOpen, onMouseEnter, onMouseLeave }: CategoriesProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoverTimeoutId, setHoverTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Track mouse position for better hover handling
  const isHovering = useRef(false);

  const {
    data: categoriesResponse,
    isLoading: isLoadingCategories
  } = useSearchCategories({
    status: "ACTIVE",
    pageSize: 200,
    sortBy: "name",
    sortOrder: "ASC",
  });

  const {
    data: categoryTree,
    isLoading: isLoadingTree
  } = useGetCategoryTreeById(activeCategory || "", {
    enabled: !!activeCategory && isOpen,
  });

  // Clean up timeout on unmount or when menu closes
  useEffect(() => {
    // Reset active category when menu closes
    if (!isOpen) {
      setActiveCategory(null);
    }

    // Clear timeout on unmount
    return () => {
      if (hoverTimeoutId) {
        clearTimeout(hoverTimeoutId);
      }
    };
  }, [hoverTimeoutId, isOpen]);

  const handleCategoryHover = (categoryId: string) => {
    if (hoverTimeoutId) {
      clearTimeout(hoverTimeoutId);
      setHoverTimeoutId(null);
    }

    const timeoutId = setTimeout(() => {
      setActiveCategory(categoryId);
    }, 100);

    setHoverTimeoutId(timeoutId);
  };

  const handleMenuEnter = () => {
    isHovering.current = true;
    onMouseEnter();
  };

  const handleMenuLeave = () => {
    isHovering.current = false;
    // Small delay to prevent flickering if user briefly moves outside and back in
    setTimeout(() => {
      if (!isHovering.current) {
        onMouseLeave();
        setActiveCategory(null);
      }
    }, 100);
  };

  const renderSubcategories = (categories?: Category[], depth = 0) => {
    if (!categories || categories.length === 0) return null;

    if (depth === 0) {
      return (
        <div className="grid grid-cols-3 gap-x-8 gap-y-6">
          {categories.map((category) => (
            <div key={category.id} className="mb-4">
              <Link
                to={`/category/${category.id}`}
                className="text-white font-medium text-base hover:text-blue-400 block mb-3 border-b border-gray-600 pb-1"
              >
                {category.name}
              </Link>
              {category.subCategories && category.subCategories.length > 0 && (
                <div>
                  {renderSubcategories(category.subCategories, depth + 1)}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                to={`/category/${category.id}`}
                className="text-gray-300 hover:text-white text-sm block py-1 hover:translate-x-1 transition-transform duration-150"
              >
                • {category.name}
              </Link>
              {category.subCategories && category.subCategories.length > 0 && (
                <div className="ml-3 mt-1 border-l-2 border-gray-600 pl-2">
                  {renderSubcategories(category.subCategories, depth + 1)}
                </div>
              )}
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <div
      className="relative bg-gray-800 border-t border-gray-700"
      ref={menuRef}
    >
      <div
        className="container mx-auto px-48 py-2"
        onMouseEnter={handleMenuEnter}
        onMouseLeave={handleMenuLeave}
      >
        <div className="flex items-center">
          <div className="flex items-center cursor-pointer text-gray-300 hover:text-white">
            <FiMenu className="mr-2" size={20}/>
            <span>Danh mục sản phẩm</span>
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div
            className="absolute left-0 top-full w-full bg-gray-700 shadow-lg z-50"
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMenuLeave}
          >
            <div className="container mx-auto px-48 py-4">
              {isLoadingCategories ? (
                <div className="flex justify-center py-10">
                  <Loader/>
                </div>
              ) : (
                <div className="flex">
                  {/* Main categories (scrollable list) */}
                  <div className="w-1/4 pr-4 max-h-80 overflow-y-auto">
                    <ul>
                      {(categoriesResponse?.data || []).map((category: Category) => (
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
                    {isLoadingTree ? (
                      <div className="flex justify-center py-10">
                        <Loader/>
                      </div>
                    ) : activeCategory && categoryTree?.data?.subCategories ? (
                      <div>
                        {renderSubcategories(categoryTree.data.subCategories)}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Categories;
