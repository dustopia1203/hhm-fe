import { useEffect, useState } from "react";

function BannerSlider() {
  const images = [
    "https://cf.shopee.vn/file/vn-11134258-7ras8-m5184szf0klz56_xxhdpi",
    "https://cf.shopee.vn/file/vn-11134258-7ra0g-m8d1306qv1j6a2_xxhdpi",
    "https://cf.shopee.vn/file/vn-11134258-7ra0g-m8e72h4e4dj6e3_xxhdpi",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000); // 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);


  return (
    <div className="relative w-full h-64 overflow-hidden rounded-lg">
      {/* Slider Container */}
      <div
        className="flex transition-transform duration-500"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Banner ${index + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
            style={{ width: "100%" }}
          />
        ))}
      </div>
      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
      >
        &lt;
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
      >
        &gt;
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-500"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default BannerSlider;