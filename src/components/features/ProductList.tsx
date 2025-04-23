import { FiPlus, FiEdit, FiTrash2, FiPackage, FiSearch, FiEye, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useState, useEffect } from "react";
import Loader from "@components/common/Loader.tsx";
import { Link } from "@tanstack/react-router";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isActive: boolean;
  imageUrl: string;
  createdAt: string;
}

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  keyword: string;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  status?: "ACTIVE" | "INACTIVE";
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  onSearchChange: (params: {
    keyword?: string;
    pageIndex?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    status?: "ACTIVE" | "INACTIVE";
  }) => void;
}

function ProductList({
                       products,
                       isLoading,
                       keyword,
                       sortBy,
                       sortOrder,
                       status,
                       pageIndex,
                       pageSize,
                       totalItems,
                       onSearchChange
                     }: ProductListProps) {
  const [searchInput, setSearchInput] = useState(keyword);

  useEffect(() => {
    setSearchInput(keyword || '');
  }, [keyword]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    const timer = setTimeout(() => {
      onSearchChange({ keyword: value || undefined });
    }, 300);

    return () => clearTimeout(timer);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    switch (value) {
      case 'newest':
        onSearchChange({ sortBy: 'createdAt', sortOrder: 'DESC' });
        break;
      case 'priceAsc':
        onSearchChange({ sortBy: 'price', sortOrder: 'ASC' });
        break;
      case 'priceDesc':
        onSearchChange({ sortBy: 'price', sortOrder: 'DESC' });
        break;
      default:
        onSearchChange({ sortBy: 'createdAt', sortOrder: 'DESC' });
    }
  };

  const getCurrentSortOption = () => {
    if (sortBy === 'createdAt' && sortOrder === 'DESC') return 'newest';
    if (sortBy === 'price' && sortOrder === 'ASC') return 'priceAsc';
    if (sortBy === 'price' && sortOrder === 'DESC') return 'priceDesc';
    return 'newest';
  };
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "ACTIVE" | "INACTIVE" | "ALL";
    onSearchChange({ status: value === "ALL" ? undefined : value });
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-500"/>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchInput}
              onChange={handleSearchChange}
              className="pl-10 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>
          <select
            value={getCurrentSortOption()}
            onChange={handleSortChange}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            <option value="newest">Mới nhất</option>
            <option value="priceAsc">Giá sản phẩm tăng dần</option>
            <option value="priceDesc">Giá sản phẩm giảm dần</option>
          </select>
          <select
            value={status || "ALL"}
            onChange={handleStatusChange}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="INACTIVE">Ngừng hoạt động</option>
          </select>
        </div>
        <button className="h-[38px] flex items-center px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
          <FiPackage className="mr-1"/>
          <FiPlus/>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader/>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead>
              <tr className="bg-gray-700 text-white">
                <th className="px-6 py-3 text-left">
                  <input type="checkbox" className="h-4 w-4 accent-gray-600"/>
                </th>
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left"></th>
                <th className="px-6 py-3 text-left">Tên sản phẩm</th>
                <th className="px-6 py-3 text-left">Giá</th>
                <th className="px-6 py-3 text-left">Số lượng</th>
                <th className="px-6 py-3 text-center">Hoạt động</th>
                <th className="px-6 py-3 text-center">Hành động</th>
              </tr>
              </thead>
              <tbody>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={product.id} className="border-b border-gray-700 text-gray-300">
                    <td className="px-6 py-3">
                      <input type="checkbox" className="h-4 w-4 accent-gray-600"/>
                    </td>
                    <td className="px-6 py-3">{pageIndex * pageSize + index + 1}</td>
                    <td className="px-6 py-3">
                      <img
                        src={product.imageUrl || "https://via.placeholder.com/50"}
                        alt={product.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-6 py-3">{product.name}</td>
                    <td className="px-6 py-3">₫{product.price.toLocaleString()}</td>
                    <td className="px-6 py-3">{product.quantity}</td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex justify-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked={product.isActive}
                            className="sr-only peer"
                          />
                          <div
                            className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <Link
                          to="/products/$productId"
                          params={{ productId: product.id }}
                        >
                          <button className="px-2 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                            <FiEye/>
                          </button>
                        </Link>
                        <button className="px-2 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                          <FiEdit/>
                        </button>
                        <button className="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-500">
                          <FiTrash2/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-400">
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-gray-400">
                Hiển
                thị {Math.min(pageIndex * pageSize, totalItems)} trên {totalItems} sản
                phẩm
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSearchChange({ pageIndex: Math.max(0, pageIndex - 1) })}
                  disabled={pageIndex === 0}
                  className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiArrowLeft/>
                </button>

                {/* Page numbers */}
                {totalItems > pageSize && (
                  <div className="flex space-x-1">
                    {/* Always show first page */}
                    {pageIndex > 1 && (
                      <button
                        onClick={() => onSearchChange({ pageIndex: 0 })}
                        className={`px-3 py-1 rounded-lg ${pageIndex === 0
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                      >
                        1
                      </button>
                    )}

                    {/* Show ellipsis if needed */}
                    {pageIndex > 2 && (
                      <span className="px-3 py-1 text-gray-400">...</span>
                    )}

                    {/* Show current page and neighbors */}
                    {Array.from({ length: Math.min(3, Math.ceil(totalItems / pageSize)) }).map((_, i) => {
                      const pageNum = pageIndex > 1
                        ? pageIndex - 1 + i
                        : i;

                      // Skip if the page would be out of range
                      if (pageNum < 0 || pageNum >= Math.ceil(totalItems / pageSize)) {
                        return null;
                      }

                      // Skip if we're showing the first or last page separately
                      if ((pageIndex > 1 && pageNum === 0) ||
                        (pageNum === Math.ceil(totalItems / pageSize) - 1 &&
                          pageIndex < Math.ceil(totalItems / pageSize) - 2)) {
                        return null;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => onSearchChange({ pageIndex: pageNum })}
                          className={`px-3 py-1 rounded-lg ${pageIndex === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    })}

                    {/* Show ellipsis if needed */}
                    {pageIndex < Math.ceil(totalItems / pageSize) - 3 && (
                      <span className="px-3 py-1 text-gray-400">...</span>
                    )}

                    {/* Always show last page */}
                    {pageIndex < Math.ceil(totalItems / pageSize) - 2 && (
                      <button
                        onClick={() => onSearchChange({ pageIndex: Math.ceil(totalItems / pageSize) - 1 })}
                        className={`px-3 py-1 rounded-lg ${pageIndex === Math.ceil(totalItems / pageSize) - 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                      >
                        {Math.ceil(totalItems / pageSize)}
                      </button>
                    )}
                  </div>
                )}

                <button
                  onClick={() => onSearchChange({ pageIndex: pageIndex + 1 })}
                  disabled={(pageIndex + 1) * pageSize >= totalItems}
                  className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiArrowRight/>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductList;
