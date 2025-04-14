import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react';
import Header from "@components/features/Header.tsx";
import Footer from "@components/features/Footer.tsx";
import ProductCard from "@components/features/ProductCard.tsx";
import { FiChevronRight, FiMessageCircle, FiChevronLeft, FiChevronRight as FiChevronRightIcon } from "react-icons/fi";

export const Route = createFileRoute('/')({
  component: RouteComponent
})

function RouteComponent() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Banner images - replace with your actual images
  const banners = [
    "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80", // Electronics
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80", // Fashion
    "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"  // Sale
  ];

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
      <div className="flex flex-col min-h-screen w-full bg-gray-900">
        <Header/>
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
                    <FiChevronLeft size={20} />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                    onClick={goToNextSlide}
                  >
                    <FiChevronRightIcon size={20} />
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
                <h2 className="text-xl font-bold text-white">Flash Sale</h2>
                <Link to="/flash-sale" className="flex items-center text-sm text-gray-400 hover:text-white">
                  Xem tất cả <FiChevronRight className="ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
              </div>
            </div>
          </div>

          {/* Featured Products */}
          <div className="container mx-auto px-6 lg:px-48 py-6">
            <h2 className="text-xl font-bold text-white mb-6">Gợi ý hàng đầu</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <ProductCard />
              <ProductCard />
              <ProductCard />
              <ProductCard />
            </div>
            <div className="flex justify-center">
              <button className="px-8 py-2 border border-gray-700 rounded-full text-gray-300 hover:bg-gray-800 transition-colors">
                Xem thêm
              </button>
            </div>
          </div>

          {/* Chat Button */}
          <div className="fixed bottom-6 right-6 z-50">
            <button className="bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 transition-colors">
              <FiMessageCircle size={24} />
            </button>
          </div>
        </main>
        <Footer/>
      </div>
    </>
  );
}