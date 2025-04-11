import { createFileRoute } from '@tanstack/react-router';
import Header from "@components/features/Header.tsx";
import Footer from '@/components/features/Footer';
import BannerSlider from '@/components/features/BannerSlides';
import { useGetAllProductsApi } from '@/apis/useProductApis';
import { useState } from 'react';

export const Route = createFileRoute('/')({
  component: RouteComponent
});

function RouteComponent() {
  const { data: productsData } = useGetAllProductsApi();
  const [currentIndex, setCurrentIndex] = useState(0); // Quản lý vị trí hiển thị sản phẩm
  const itemsPerPage = 5; // Số lượng sản phẩm hiển thị mỗi lần
  const [showAll, setShowAll] = useState(false); // Quản lý trạng thái hiển thị toàn bộ sản phẩm


  const handleNext = () => {
    if (productsData?.data) {
      const maxIndex = Math.max(0, productsData.data.length - itemsPerPage);
      setCurrentIndex((prevIndex) =>
        prevIndex + itemsPerPage > maxIndex ? 0 : prevIndex + itemsPerPage
      );
    }
  };

  const handlePrev = () => {
    if (productsData?.data) {
      const maxIndex = Math.max(0, productsData.data.length - itemsPerPage);
      setCurrentIndex((prevIndex) =>
        prevIndex - itemsPerPage < 0 ? maxIndex : prevIndex - itemsPerPage
      );
    }
  };

  const handleToggleShow = () => {
    setShowAll((prev) => !prev); // Chuyển đổi trạng thái giữa Show More và Show Less
  };


  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header />

        {/* Danh mục sản phẩm */}

        {/* Main Content */}
        <div className="max-w-screen-xl mx-auto py-6 pt-45" >
          {/* Banner Section */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="col-span-2">
              <BannerSlider />
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-gray-700 h-32 rounded-lg">
                <img
                  src="https://cf.shopee.vn/file/vn-11134258-7ra0g-m8ebslork6roa7_xhdpi"
                  alt="Sale cuối tuần"
                  className='rounded-lg'
                />
              </div>
              <div className="bg-gray-700 h-32 rounded-lg">
                <img
                  src="https://cf.shopee.vn/file/vn-11134258-7ra0g-m8ebw7jhjaro9e_xhdpi"
                  alt="Sale cuối tuần"
                  className='rounded-lg'
                />
              </div>
            </div>
          </div>

          {/* Flash Sale Section */}
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-red-500 text-lg font-bold flex items-center">
                <span className="mr-2">⚡ FLASH SALE</span>
              </h2>
              <a href="#" className="text-white text-sm font-semibold">
                Xem tất cả &gt;
              </a>
            </div>

            <div className="relative flex items-center justify-center">
              {/* Nút mũi tên trái */}
              <button
                onClick={handlePrev}
                className="absolute left-0 bg-gray-800 text-white p-3 rounded-full z-10 transform transition-transform duration-300 hover:scale-125"
              >
                &lt;
              </button>

              {/* Danh sách sản phẩm */}
              <div className="flex gap-6 overflow-hidden w-full justify-center">
                {productsData?.data
                  .slice(currentIndex, currentIndex + itemsPerPage)
                  .map((product) => {
                    const randomDiscount =
                      Math.floor(Math.random() * (60 - 20 + 1)) + 20;

                    return (
                      <div
                        key={product.id}
                        className="bg-gray-700 h-60 w-48 rounded-lg flex-shrink-0 p-4 transform transition-transform duration-300 hover:scale-105 relative"
                      >
                        {/* Badge giảm giá */}
                        <div className="absolute top-2 left-2 bg-red-700 text-white text-xs font-bold px-2 py-1 rounded">
                          -{randomDiscount}%
                        </div>
                        <div className="overflow-hidden rounded-lg">
                          <img
                            src={product.contentUrls}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                        <p className="text-white text-base mt-2 truncate">
                          {product.name}
                        </p>
                        <p className="text-yellow-400 text-base">
                          {product.price.toLocaleString()}$
                        </p>
                      </div>
                    );
                  })}
              </div>

              {/* Nút mũi tên phải */}
              <button
                onClick={handleNext}
                className="absolute right-0 bg-gray-800 text-white p-3 rounded-full z-10 transform transition-transform duration-300 hover:scale-125"
              >
                &gt;
              </button>
            </div>
          </div>

          {/* Top Suggestions Section */}
          <div>
            <h2 className="text-red-500 text-lg font-bold mb-4 text-center pb-10 pt-10 border-b border-gray-700">
              Gợi ý hôm nay
            </h2>

            <div className="grid grid-cols-4 gap-6">
              {productsData?.data
                .sort(() => 0.5 - Math.random()) // Trộn ngẫu nhiên danh sách sản phẩm
                .slice(0, showAll ? productsData.data.length : 8) // Hiển thị 8 sản phẩm hoặc toàn bộ
                .map((product) => (
                  <div
                    key={product.id}
                    className="bg-[#2B2F3A] shadow-lg rounded-lg overflow-hidden border border-[#4B5563]"
                  >
                    {/* Hình ảnh sản phẩm */}
                    <div className="relative">
                      <img
                        src={product.contentUrls || "https://via.placeholder.com/300"}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="p-4">
                      <p className="text-white text-base font-semibold truncate">
                        {product.name}
                      </p>
                      <p className="text-yellow-400 text-lg font-bold">
                        ₫{product.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Nhãn nổi bật */}
                    <div className="px-4 py-2">
                      <span className="text-sm bg-yellow-400 text-black px-3 py-1 rounded">
                        Yêu thích
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            <button
              onClick={handleToggleShow}
              className="mt-4 bg-red-500 text-white px-6 py-3 rounded-lg block mx-auto font-semibold shadow-lg transform transition-all duration-300 hover:bg-red-600 hover:scale-105 hover:shadow-xl"
            >
              {showAll ? "Thu gọn" : "Xem thêm"}
            </button>          </div>

        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}