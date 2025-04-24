import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductDetail from '../../components/features/ProductDetail';
import ShopProfileCard from '../../components/features/ShopProfileCard';
import ReviewCard from '../../components/features/ReviewCard';
import Header from "@components/features/Header.tsx";
import Footer from "@components/features/Footer.tsx";
import { useGetProductById } from "@apis/useProductApis.ts";
import Loader from "@components/common/Loader.tsx";
import NotFound from "@components/common/NotFound.tsx";

export const Route = createFileRoute('/products/$productId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      id: params.productId
    }
  }
})

function RouteComponent() {
  const { id } = Route.useLoaderData();
  const [reviewPage, setReviewPage] = useState(1);
  const reviewsPerPage = 5;
  const { data, isLoading, error } = useGetProductById(id);

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

  const displayedReviews = reviews.slice(
    (reviewPage - 1) * reviewsPerPage,
    reviewPage * reviewsPerPage
  );

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  if (isLoading) {
    return (
      <Loader/>
    );
  }

  if (error || !data) {
    return (
      <NotFound/>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen w-full">
        <Header/>
        <main className="container mx-auto px-4 md:px-8 lg:px-24 xl:px-48 py-8">
          {/* Product Detail Component */}
          <ProductDetail
            id={data.data.id}
            name={data.data.name}
            images={data.data.images}
            price={data.data.price}
            salePrice={data.data.salePrice}
            salePercent={data.data.salePercent}
            soldCount={data.data.soldCount}
            reviewCount={data.data.reviewCount}
            rating={data.data.rating}
            category={data.data.category}
          />

          {/* Shop Profile Card */}
          <section className="mt-6 mb-6">
            <ShopProfileCard id={data.data.shopId}/>
          </section>

          {/* Description */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">Description</h2>
            <p className="text-gray-300 whitespace-pre-line">
              {data.data.description}
            </p>
          </section>

          {/* Reviews */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6">Reviews</h2>
            <div className="space-y-6">
              {displayedReviews.map((review, index) => (
                <ReviewCard
                  key={`review-${index}-${reviewPage}`}
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
              <nav aria-label="Reviews pagination" className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => setReviewPage(Math.max(1, reviewPage - 1))}
                  disabled={reviewPage === 1}
                  aria-label="Previous page"
                  className={`p-2 rounded-md transition-colors ${
                    reviewPage === 1
                      ? 'text-gray-500 cursor-not-allowed'
                      : 'text-white hover:bg-gray-700'
                  }`}
                >
                  <FiChevronLeft size={20}/>
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setReviewPage(i + 1)}
                    aria-label={`Page ${i + 1}`}
                    aria-current={reviewPage === i + 1 ? "page" : undefined}
                    className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                      reviewPage === i + 1
                        ? 'bg-white text-gray-800 font-medium'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setReviewPage(Math.min(totalPages, reviewPage + 1))}
                  disabled={reviewPage === totalPages}
                  aria-label="Next page"
                  className={`p-2 rounded-md transition-colors ${
                    reviewPage === totalPages
                      ? 'text-gray-500 cursor-not-allowed'
                      : 'text-white hover:bg-gray-700'
                  }`}
                >
                  <FiChevronRight size={20}/>
                </button>
              </nav>
            )}
          </section>
        </main>
        <Footer/>
      </div>
    </>
  );
}
