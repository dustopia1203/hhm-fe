import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import Header from "@components/features/Header.tsx";
import Footer from "@components/features/Footer.tsx";
import { FiArrowLeft, FiChevronDown } from "react-icons/fi";
import { useSearchProductsApi } from "@apis/useProductApis.ts";
import { useSearchCategories } from "@apis/useCategoryApis.ts";
import Loader from "@components/common/Loader.tsx";
import ProductCard from "@components/features/ProductCard.tsx";

export const Route = createFileRoute('/products/')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      keyword: search.keyword as string | undefined,
      categoryId: search.categoryId as string | undefined,
      minPrice: search.minPrice ? Number(search.minPrice) : undefined,
      maxPrice: search.maxPrice ? Number(search.maxPrice) : undefined,
      pageIndex: search.pageIndex ? Number(search.pageIndex) : 1,
      sortBy: search.sortBy as string || 'createdAt',
      sortOrder: search.sortOrder as "ASC" | "DESC" || 'DESC',
    };
  }
})

function RouteComponent() {
  const navigate = useNavigate();
  const {
    keyword,
    categoryId,
    minPrice,
    maxPrice,
    pageIndex = 1,
    sortBy = 'createdAt',
    sortOrder = 'DESC'
  } = Route.useSearch();

  // Local state
  const [minPriceInput, setMinPriceInput] = useState(minPrice?.toString() || '');
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice?.toString() || '');
  const [currentCategory, setCurrentCategory] = useState();

  // Fetch categories (root or subcategories)
  const { data: categoriesData, isLoading: categoriesLoading } = useSearchCategories({
    parentIds: categoryId ? [categoryId] : undefined,
    status: "ACTIVE",
    sortBy: "name",
    sortOrder: "ASC"
  });

  // Fetch current category details if categoryId is provided
  const { data: currentCategoryData } = useSearchCategories({
    ids: categoryId ? [categoryId] : [],
    parentIds: sessionStorage.getItem('prevCategoryId') ? [sessionStorage.getItem('prevCategoryId')] : undefined,
    status: "ACTIVE"
  });

  // Update current category when data changes
  useEffect(() => {
    if (categoryId && currentCategoryData?.data && currentCategoryData.data.length > 0) {
      setCurrentCategory(currentCategoryData.data[0]);
    } else {
      setCurrentCategory(null);
    }
  }, [categoryId, currentCategoryData]);

  // Fetch products based on filters
  const { data: productsData, isLoading: productsLoading } = useSearchProductsApi({
    keyword: keyword || undefined,
    categoryIds: currentCategory ? [currentCategory.id] : undefined,
    minPrice: minPrice,
    maxPrice: maxPrice,
    pageIndex,
    pageSize: 12,
    sortBy,
    sortOrder,
    status: "ACTIVE"
  });

  // Update URL when filters change
  const updateFilters = (newParams: {
    keyword?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    pageIndex?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  }) => {
    console.log(newParams)

    navigate({
      search: (prev) => ({
        ...prev,
        ...newParams,
        // Reset page when filters change
        ...(newParams.keyword !== undefined ||
        newParams.categoryId !== undefined ||
        newParams.minPrice !== undefined ||
        newParams.maxPrice !== undefined ||
        newParams.sortBy !== undefined ||
        newParams.sortOrder !== undefined
          ? { pageIndex: 1 } : {}),
      }),
      replace: true
    });
  };

  // Handle price range submission
  const handlePriceRangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({
      minPrice: minPriceInput ? Number(minPriceInput) : undefined,
      maxPrice: maxPriceInput ? Number(maxPriceInput) : undefined
    });
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    switch(value) {
      case 'newest':
        updateFilters({ sortBy: 'createdAt', sortOrder: 'DESC' });
        break;
      case 'priceAsc':
        updateFilters({ sortBy: 'price', sortOrder: 'ASC' });
        break;
      case 'priceDesc':
        updateFilters({ sortBy: 'price', sortOrder: 'DESC' });
        break;
      default:
        updateFilters({ sortBy: 'createdAt', sortOrder: 'DESC' });
    }
  };

  // Helper to get current sort option for select
  const getCurrentSortOption = () => {
    if (sortBy === 'createdAt' && sortOrder === 'DESC') return 'newest';
    if (sortBy === 'price' && sortOrder === 'ASC') return 'priceAsc';
    if (sortBy === 'price' && sortOrder === 'DESC') return 'priceDesc';
    return 'newest';
  };

  // Handle category selection with checkbox
  const handleCategorySelect = (category, isChecked) => {
    if (isChecked) {
      const prevCategoryId = categoryId;

      updateFilters({ categoryId: category.id });

      sessionStorage.setItem('prevCategoryId', prevCategoryId || '');
    }
  };

  // Handle back button
  const handleBackButton = () => {
    const prevCategoryId = sessionStorage.getItem('prevCategoryId');
    updateFilters({
      categoryId: prevCategoryId && prevCategoryId !== 'undefined' ? prevCategoryId : undefined
    });
  };

  return (
    <>
      <div className="flex flex-col min-h-screen w-full bg-gray-900">
        <Header/>
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 lg:px-12">
            <div className="flex flex-col lg:flex-row">
              {/* Left sidebar - Filters */}
              <div className="lg:w-1/5 mb-6 lg:mb-0 lg:pr-6">
                <div className="bg-gray-800 rounded-xl shadow-md p-6">
                  {/* Categories */}
                  <div className="mb-6">
                    <h3 className="text-white font-medium border-b border-gray-700 pb-3 mb-4">Danh mục</h3>

                    {categoriesLoading ? (
                      <div className="flex justify-center py-4">
                        <Loader />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Current category if exists */}
                        {currentCategory && (
                          <div className="pb-3 mb-2 border-b border-gray-600">
                            <div className="flex items-center">
                              <label
                                htmlFor={`category-current-${currentCategory.id}`}
                                className="ml-2 text-white font-medium text-sm"
                              >
                                {currentCategory.name}
                              </label>
                            </div>
                          </div>
                        )}

                        {/* Child categories as checkboxes */}
                        {categoriesData?.data && categoriesData.data.length > 0 ? (
                          categoriesData.data.map((category) => (
                            <div key={category.id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`category-${category.id}`}
                                className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-700"
                                onChange={(e) => handleCategorySelect(category, e.target.checked)}
                              />
                              <label
                                htmlFor={`category-${category.id}`}
                                className="ml-2 text-gray-300 hover:text-white text-sm cursor-pointer"
                              >
                                {category.name}
                              </label>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 italic text-sm">
                            {categoryId ? 'Không có danh mục con' : 'Không có danh mục'}
                          </div>
                        )}

                        {/* Back button */}
                        {categoryId && (
                          <button
                            onClick={handleBackButton}
                            className="mt-4 w-full py-2 px-3 bg-gray-700 hover:bg-gray-600 text-sm text-white rounded flex items-center justify-center"
                          >
                            <FiArrowLeft size={14} className="mr-1" />
                            Quay lại
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="text-white font-medium border-b border-gray-700 pb-3 mb-4">Khoảng giá</h3>
                    <form onSubmit={handlePriceRangeSubmit} className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={minPriceInput}
                          onChange={(e) => setMinPriceInput(e.target.value)}
                          className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500"
                        />
                        <span className="text-gray-400">—</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={maxPriceInput}
                          onChange={(e) => setMaxPriceInput(e.target.value)}
                          className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 px-3 bg-gray-700 hover:bg-gray-600 transition-colors text-white rounded"
                      >
                        Áp dụng
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Right content - Products */}
              <div className="lg:w-4/5">
                {/* Sorting Bar */}
                <div className="flex justify-start pb-10">
                  {/* Sorting */}
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300">Sắp xếp theo</span>
                    <div className="relative">
                      <select
                        value={getCurrentSortOption()}
                        onChange={handleSortChange}
                        className="appearance-none bg-gray-700 border border-gray-600 text-white py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
                      >
                        <option value="newest">Mới nhất</option>
                        <option value="priceAsc">Giá thấp đến cao</option>
                        <option value="priceDesc">Giá cao đến thấp</option>
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                {productsLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader />
                  </div>
                ) : productsData?.data?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {productsData.data.map(product => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        imageUrl={product.contentUrls ? product.contentUrls.split(';')[0] : undefined}
                        rating={product.rating}
                        reviewCount={product.reviewCount}
                        salePercent={product.salePercent}
                        salePrice={product.salePrice}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <p className="mb-4">Không tìm thấy sản phẩm nào phù hợp.</p>
                    <button
                      onClick={() => {
                        setMinPriceInput('');
                        setMaxPriceInput('');
                        updateFilters({
                          keyword: undefined,
                          categoryId: undefined,
                          minPrice: undefined,
                          maxPrice: undefined
                        });
                      }}
                      className="py-2 px-4 bg-gray-700 hover:bg-gray-600 transition-colors text-white rounded"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {productsData?.data?.totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex space-x-2">
                      {Array.from({ length: productsData.data.totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => updateFilters({ pageIndex: i + 1 })}
                          className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
                            pageIndex === i + 1
                              ? 'bg-white text-gray-900 font-medium'
                              : 'text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer/>
      </div>
    </>
  )
}
