import { createFileRoute, Link } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react';
import Header from "@components/features/Header.tsx";
import Footer from "@components/features/Footer.tsx";
import ProductCard from "@components/features/ProductCard.tsx";
import { FiChevronLeft, FiChevronRight, FiChevronRight as FiChevronRightIcon } from "react-icons/fi";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import Categories from "@components/features/Categories.tsx";
import { getProductById, useGetSimilarProductsFromSearchesApi } from "@apis/useProductApis";

interface Product {
  id: string;
  name: string;
  price: number;
  contentUrls: string;
  rating: number;
  reviewCount: number;
  salePercent?: number;
  salePrice?: number;
}

export const Route = createFileRoute('/')({
  component: RouteComponent
})

function RouteComponent() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [productCount, setProductCount] = useState(4);
  const [lastProductLength, setLastProductLength] = useState<number | null>(null);
  const [hideSeeMore, setHideSeeMore] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const { data: recommendedProducts, isLoading } = useGetSimilarProductsFromSearchesApi(productCount);
  // Banner images - replace with your actual images
  const banners = [
    "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80", // Electronics
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80", // Fashion
    "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"  // Sale
  ];
  const [recommendedProductsWithRating, setRecommendedProductsWithRating] = useState<any[]>([]);
  useEffect(() => {
    const fetchRatings = async () => {
      if (!recommendedProducts) return;

      const enrichedProducts = await Promise.all(
        recommendedProducts.map(async (product) => {
          try {
            const res = await getProductById(product.id); // không dùng hook
            return {
              ...product,
              rating: res.data?.rating,
              reviewCount: res.data?.reviewCount,
            };
          } catch (error) {
            console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
            return product; // fallback nếu lỗi
          }
        })
      );

      setRecommendedProductsWithRating(enrichedProducts);
    };

    fetchRatings();
  }, [recommendedProducts]);

  let categoryTimeoutId: NodeJS.Timeout;

  const handleCategoryMouseEnter = () => {
    clearTimeout(categoryTimeoutId);
    setIsCategoryOpen(true);
  };

  const handleCategoryMouseLeave = () => {
    categoryTimeoutId = setTimeout(() => {
      setIsCategoryOpen(false);
    }, 200);
  };

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Navigation functions
  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }, [banners.length]);

  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [banners.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    if (recommendedProductsWithRating) {
      if (lastProductLength !== null && recommendedProductsWithRating.length === lastProductLength) {
        setHideSeeMore(true);
      } else {
        setHideSeeMore(false);
      }
      setLastProductLength(recommendedProductsWithRating.length);
      setDisplayedProducts((prev) => {
        const prevIds = new Set(prev.map((p) => p.id));
        if (prev.length === 0) {
          return recommendedProductsWithRating.slice(0, 4);
        }
        const newProducts = recommendedProductsWithRating.filter((p: Product) => !prevIds.has(p.id));
        return [...prev, ...newProducts];
      });
    }
  }, [recommendedProductsWithRating]);

  // Reset displayedProducts khi reload trang
  useEffect(() => {
    setDisplayedProducts([]);
    setProductCount(4);
    setLastProductLength(null);
    setHideSeeMore(false);
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen w-full">
        <Header/>
        <Categories
          isOpen={isCategoryOpen}
          onMouseEnter={handleCategoryMouseEnter}
          onMouseLeave={handleCategoryMouseLeave}
        />
        <main className="flex-1">
          {/* Hero Banner */}
          <div className="container mx-auto px-6 lg:px-48 py-6">
            {/* Main Banner */}
            <div className="relative">
              <div className="aspect-[21/9] bg-gray-800 rounded-2xl overflow-hidden">
                <div className="relative h-full w-full">
                  {/* Banner images */}
                  {banners.map((banner, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <img
                        src={banner}
                        alt={`Promotion banner ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                  {/* Navigation arrows */}
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                    onClick={goToPrevSlide}
                  >
                    <FiChevronLeft size={20}/>
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                    onClick={goToNextSlide}
                  >
                    <FiChevronRightIcon size={20}/>
                  </button>
                </div>
              </div>
              <div className="absolute bottom-4 left-0 w-full flex justify-center space-x-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 w-2 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-gray-600'}`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Products */}
          <div className="container mx-auto px-6 lg:px-48 py-6">
            <div className="bg-gray-800 rounded-3xl p-6 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-lg font-bold flex items-center">
                  <span className="mr-2">⚡⚡⚡Gợi ý hàng đầu⚡⚡⚡</span>
                </h2>
                <Link to="/products" className="flex items-center text-sm text-gray-400 hover:text-white">
                  Xem tất cả <FiChevronRight className="ml-1"/>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {isLoading && Array(4).fill(0).map((_, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                    <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
                {displayedProducts.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    imageUrl={product.contentUrls}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    salePercent={product.salePercent}
                    salePrice={product.salePrice}
                  />
                ))}
              </div>
              <div className="flex justify-center">
                {!hideSeeMore && (
                  <button
                    className="px-8 py-2 border border-gray-700 rounded-full text-gray-300 hover:bg-gray-800 transition-colors"
                    onClick={() => setProductCount((prev) => prev + 8)}
                  >
                    Xem thêm
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Chat Button */}
          <div className="fixed bottom-6 right-6 z-50">
            <button className="bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 transition-colors">
              <BiSolidMessageRoundedDetail size={24}/>
            </button>
          </div>
        </main>
        <Footer/>
      </div>
    </>
  );
}