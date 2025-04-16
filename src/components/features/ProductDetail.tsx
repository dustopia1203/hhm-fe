import { useState } from "react";
import { FiShoppingCart, FiStar } from "react-icons/fi";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

interface ProductDetailProps {
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  images: string[];
}

function ProductDetail(
  {
    name,
    price,
    rating,
    reviewCount,
    soldCount,
    images
  }: ProductDetailProps
) {
  const [mainImage, setMainImage] = useState(0);
  const [startIndex, setStartIndex] = useState(0);

  // Function to navigate through main images directly
  const navigateMainImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && mainImage > 0) {
      setMainImage(mainImage - 1);
      if (mainImage - 1 < startIndex) {
        setStartIndex(Math.max(0, mainImage - 1));
      }
    } else if (direction === 'next' && mainImage < images.length - 1) {
      setMainImage(mainImage + 1);
      if (mainImage + 1 >= startIndex + 4) {
        setStartIndex(Math.min(images.length - 4, mainImage - 2));
      }
    }
  };

  return (
    <div className="rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-md">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Image gallery */}
        <div className="w-full lg:w-1/2">
          {/* Main image with navigation arrows */}
          <div className="aspect-square bg-gray-700 rounded-xl mb-4 overflow-hidden relative">
            <img
              src={images[mainImage]}
              alt={name}
              className="w-full h-full object-cover"
            />

            {/* Navigation arrows overlaid on main image */}
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <button
                onClick={() => navigateMainImage('prev')}
                className="h-10 w-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                disabled={mainImage === 0}
              >
                <IoChevronBackOutline size={24} />
              </button>
              <button
                onClick={() => navigateMainImage('next')}
                className="h-10 w-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                disabled={mainImage === images.length - 1}
              >
                <IoChevronForwardOutline size={24} />
              </button>
            </div>
          </div>

          {/* Thumbnails - centered */}
          <div className="flex items-center justify-center space-x-2">
            <div className="flex space-x-2 justify-center">
              {images.slice(startIndex, startIndex + 4).map((image, index) => (
                <button
                  key={startIndex + index}
                  className={`h-16 w-16 rounded-md overflow-hidden border-2 ${
                    mainImage === startIndex + index ? 'border-gray-400' : 'border-transparent'
                  } hover:border-gray-500 transition-colors`}
                  onClick={() => setMainImage(startIndex + index)}
                >
                  <img
                    src={image}
                    alt={`${name} thumbnail ${startIndex + index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Product details */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-xl font-bold text-white mb-2">{name}</h1>

          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center">
              <span className="text-white font-medium mr-1">{rating.toFixed(1)}</span>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={i < Math.floor(rating) ? "fill-yellow-400" : ""}
                  />
                ))}
              </div>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-gray-400">{reviewCount} reviews</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-400">{soldCount} sold</span>
          </div>

          <div className="text-3xl font-bold text-white mb-6">
            ${price.toFixed(2)}
          </div>

          <div className="flex space-x-4">
            <button
              className="flex-1 flex items-center justify-center py-3 px-6 rounded-lg border border-gray-600 bg-gray-700 text-white hover:bg-gray-600 transition-colors">
              <FiShoppingCart className="mr-2"/>
              Add to cart
            </button>
            <button className="flex-1 py-3 px-6 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors">
              Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
