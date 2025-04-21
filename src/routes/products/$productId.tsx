import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductDetail from '../../components/features/ProductDetail';
import ShopProfileCard from '../../components/features/ShopProfileCard';
import ReviewCard from '../../components/features/ReviewCard';
import Header from "@components/features/Header.tsx";
import Footer from "@components/features/Footer.tsx";

export const Route = createFileRoute('/products/$productId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      id: params.productId
    }
  }
})

function RouteComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const { id } = Route.useLoaderData();

  // Mock product data with recursive category structure
  const productData = {
    name: "Sony PlayStation 5 Digital Edition Console",
    price: 499.99,
    rating: 4.8,
    reviewCount: 100,
    soldCount: 1000,
    images: [
      "/images/products/ps5-1.jpg",
      "/images/products/ps5-2.jpg",
      "/images/products/ps5-3.jpg",
      "/images/products/ps5-4.jpg",
    ],
    category: {
      id: "electronics",
      name: "Đồ điện tử",
      subcategory: {
        id: "gaming",
        name: "Thiết bị chơi game",
        subcategory: {
          id: "consoles",
          name: "Máy chơi game"
        }
      }
    }
  };

  // Mock shop data
  const shopData = {
    id: "sony-store",
    name: "Official Sony Store",
    address: "123 Electronics Avenue, District 1, HCMC",
    avatarUrl: "/images/shops/sony-logo.png",
    productCount: 100000,
    reviewCount: 1000,
    rating: 4.8,
    createdAt: Date.now() - (10 * 365 * 24 * 60 * 60 * 1000) // 10 years ago
  };

  // Mock review data
  const reviews = [
    {
      username: "gaming_enthusiast",
      rating: 5,
      date: "15/04/2025",
      time: "14:30",
      description: "This console is amazing! The loading times are incredibly fast, and the graphics are stunning. The DualSense controller adds a whole new dimension to gaming that you have to experience to believe.",
      images: [
        "/images/reviews/ps5-review-1.jpg",
        "/images/reviews/ps5-review-2.jpg",
        "/images/reviews/ps5-review-3.jpg",
      ]
    },
    {
      username: "tech_reviewer",
      rating: 4,
      date: "12/04/2025",
      time: "09:15",
      description: "The PS5 is a significant step up from the PS4. Games load practically instantly, and the new UI is sleek. The only downside is the size of the console, which is quite large.",
      images: [
        "/images/reviews/ps5-review-4.jpg",
        "/images/reviews/ps5-review-5.jpg",
      ]
    },
    {
      username: "casual_gamer",
      rating: 5,
      date: "10/04/2025",
      time: "18:45",
      description: "Worth every penny! The backwards compatibility with PS4 games is seamless, and the PS5 exclusives really showcase what this hardware can do.",
      images: []
    },
    {
      username: "value_hunter",
      rating: 5,
      date: "05/04/2025",
      time: "11:20",
      description: "The digital edition is perfect if you're already used to buying games digitally. No need for discs and it's cheaper than the standard edition.",
      images: [
        "/images/reviews/ps5-review-6.jpg",
      ]
    }
  ];

  // Calculate displayed reviews based on pagination
  const displayedReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  return (
    <>
      <div className="flex flex-col min-h-screen w-full">
        <Header />
        <div className="container mx-auto px-48 py-8">
          {/* Product Detail Component */}
          <ProductDetail {...productData} />

          {/* Shop Profile Card */}
          <div className="mt-6">
            <ShopProfileCard {...shopData} />
          </div>

          {/* Product Details */}
          <div className="mt-8 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Detail</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="text-gray-400">Category</div>
                <div className="text-white md:col-span-3">
                  {productData.category.name} &gt; {productData.category.subcategory?.name} &gt; {productData.category.subcategory?.subcategory?.name}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="text-gray-400">Name</div>
                <div className="text-white md:col-span-3">{productData.name}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">Description</h2>
            <p className="text-gray-300 whitespace-pre-line">
              Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers and 3D Audio, and an all-new generation of incredible PlayStation games.

              Lightning Speed: Harness the power of a custom CPU, GPU, and SSD with Integrated I/O that rewrite the rules of what a PlayStation console can do.

              Stunning Games: Marvel at incredible graphics and experience new PS5 features.
            </p>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Reviews</h2>
            <div className="space-y-6">
              {displayedReviews.map((review, index) => (
                <ReviewCard
                  key={index}
                  username={review.username}
                  rating={review.rating}
                  date={review.date}
                  time={review.time}
                  description={review.description}
                  images={review.images}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1
                      ? 'text-gray-500 cursor-not-allowed'
                      : 'text-white hover:bg-gray-700'
                  }`}
                >
                  <FiChevronLeft size={20} />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-md flex items-center justify-center ${
                      currentPage === i + 1
                        ? 'bg-white text-gray-800'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages
                      ? 'text-gray-500 cursor-not-allowed'
                      : 'text-white hover:bg-gray-700'
                  }`}
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}