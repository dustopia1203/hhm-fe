import { createFileRoute, Link } from '@tanstack/react-router'
import Header from "@components/features/Header.tsx";
import Footer from "@components/features/Footer.tsx";
import ProductCard from "@components/features/ProductCard.tsx";
import { FiChevronRight, FiMessageCircle } from "react-icons/fi";

export const Route = createFileRoute('/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <>
      <div className="flex flex-col min-h-screen w-full">
        <Header/>
        <main className="flex-1">
          {/* Hero Banner */}
          <div className="container mx-auto px-6 lg:px-48 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Main Banner */}
              <div className="lg:col-span-3 relative">
                <div className="aspect-[16/9] bg-gray-800 rounded-2xl overflow-hidden">
                  {/* Banner image would go here */}
                </div>
                <div className="absolute bottom-4 left-0 w-full flex justify-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-white"></span>
                  <span className="h-2 w-2 rounded-full bg-gray-600"></span>
                  <span className="h-2 w-2 rounded-full bg-gray-600"></span>
                </div>
              </div>

              {/* Side Banners */}
              <div className="lg:col-span-2 grid grid-rows-2 gap-6">
                <div className="aspect-[21/9] bg-gray-800 rounded-2xl"></div>
                <div className="aspect-[21/9] bg-gray-800 rounded-2xl"></div>
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
