import { createFileRoute, Link } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react';
import Header from "@components/features/Header.tsx";
import Footer from "@components/features/Footer.tsx";
import ProductCard from "@components/features/ProductCard.tsx";
import { FiChevronLeft, FiChevronRight, FiChevronRight as FiChevronRightIcon } from "react-icons/fi";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import Categories from "@components/features/Categories.tsx";
import { useGetSimilarProductsFromSearchesApi } from "@apis/useProductApis";

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
  const { data: recommendedProducts, isLoading } = useGetSimilarProductsFromSearchesApi(10);
  console.log(recommendedProducts);
  // Banner images - replace with your actual images
  const banners = [
    "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80", // Electronics
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80", // Fashion
    "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"  // Sale
  ];

  // Mock products data for Flash Sale with ratings and discounts
  const flashSaleProducts = [
    {
      id: "fs001",
      name: "Sony WH-1000XM4 Wireless Noise-Canceling Headphones",
      price: 4990000,
      imageUrl: "/images/products/headphones-1.jpg",
      rating: 4.8,
      reviewCount: 1245,
      salePercent: 20,
      salePrice: 3992000
    },
    {
      id: "fs002",
      name: "Samsung Galaxy Watch 5 Pro",
      price: 7990000,
      imageUrl: "/images/products/watch-1.jpg",
      rating: 4.6,
      reviewCount: 872,
      salePercent: 15,
      salePrice: 6791500
    },
    {
      id: "fs003",
      name: "Apple iPad Air (2022)",
      price: 13990000,
      imageUrl: "/images/products/ipad-1.jpg",
      rating: 4.9,
      reviewCount: 2103,
      salePercent: 10,
      salePrice: 12591000
    },
    {
      id: "fs004",
      name: "Nintendo Switch OLED Model",
      price: 8490000,
      imageUrl: "/images/products/switch-1.jpg",
      rating: 4.7,
      reviewCount: 1563,
      salePercent: 25,
      salePrice: 6367500
    }
  ];

  // Mock products data for Featured Products with ratings (some with discounts, some without)
  // const featuredProducts = [
  //   {
  //     id: "p001",
  //     name: "Apple MacBook Air M2",
  //     price: 26990000,
  //     imageUrl: "/images/products/laptop-1.jpg",
  //     rating: 4.9,
  //     reviewCount: 528,
  //     salePercent: 5,
  //     salePrice: 25640500
  //   },
  //   {
  //     id: "p002",
  //     name: "Sony PlayStation 5 Digital Edition",
  //     price: 11990000,
  //     imageUrl: "/images/products/ps5-1.jpg",
  //     rating: 4.8,
  //     reviewCount: 1876
  //   },
  //   {
  //     id: "p003",
  //     name: "Canon EOS R6 Mirrorless Camera",
  //     price: 52990000,
  //     imageUrl: "/images/products/camera-1.jpg",
  //     rating: 4.7,
  //     reviewCount: 342,
  //     salePercent: 8,
  //     salePrice: 48750800
  //   },
  //   {
  //     id: "p004",
  //     name: "Samsung 55\" QLED 4K Smart TV",
  //     price: 16490000,
  //     imageUrl: "/images/products/tv-1.jpg",
  //     rating: 4.5,
  //     reviewCount: 697
  //   }
  // ];

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

          {/* Flash Sale Section */}
          <div className="container mx-auto px-6 lg:px-48 py-6">
            <div className="bg-gray-800 rounded-3xl p-6 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-red-500 text-lg font-bold flex items-center">
                  <span className="mr-2">⚡FLASH SALE</span>
                </h2>
                <Link to="/flash-sale" className="flex items-center text-sm text-gray-400 hover:text-white">
                  Xem tất cả <FiChevronRight className="ml-1"/>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {flashSaleProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    imageUrl={product.imageUrl}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    salePercent={product.salePercent}
                    salePrice={product.salePrice}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Featured Products */}
          <div className="container mx-auto px-6 lg:px-48 py-6">
            <h2 className="text-xl font-bold text-white mb-6">Gợi ý hàng đầu</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {isLoading ? (
                // Loading skeleton
                Array(4).fill(0).map((_, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                    <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))
              ) : recommendedProducts?.length > 0 ? (
                recommendedProducts.map((product: Product) => (
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
                ))
              ) : null
              // : (
              //   // Fallback to featured products if no recommendations
              //   featuredProducts.map((product: Product) => (
              //     <ProductCard
              //       key={product.id}
              //       id={product.id}
              //       name={product.name}
              //       price={product.price}
              //       imageUrl={product.imageUrl}
              //       rating={product.rating}
              //       reviewCount={product.reviewCount}
              //       salePercent={product.salePercent}
              //       salePrice={product.salePrice}
              //     />
              //   ))
              // )
              }
            </div>
            <div className="flex justify-center">
              <button
                className="px-8 py-2 border border-gray-700 rounded-full text-gray-300 hover:bg-gray-800 transition-colors">
                Xem thêm
              </button>
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