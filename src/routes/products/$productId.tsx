import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductDetail from '../../components/features/ProductDetail';
import ShopProfileCard from '../../components/features/ShopProfileCard';
import ReviewCard from '../../components/features/ReviewCard';
import Header from "@components/features/Header.tsx";
import Footer from "@components/features/Footer.tsx";
import { useGetProductByIdApi } from "@apis/useProductApis.ts";
import { useSearchReviewsApi } from "@apis/useReviewApis.ts";
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

  // Product data
  const { data, isLoading, error } = useGetProductByIdApi(id);

  // Reviews data from API - use productIds to filter reviews for this product
  const {
    data: reviewsData,
    isLoading: reviewsLoading
  } = useSearchReviewsApi({
    productIds: [id],
    pageIndex: reviewPage,
    pageSize: 10
  });

  if (isLoading) {
    return <Loader/>;
  }

  if (error || !data) {
    return <NotFound/>;
  }

  // Calculate total pages based on API response
  const totalPages = reviewsData?.totalPages || 1;
  const reviews = reviewsData?.data || [];

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
            status={data.data.status}
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
            <h2 className="text-xl font-bold text-white mb-6">
              Reviews {reviewsData?.total ? `(${reviewsData.total})` : ''}
            </h2>

            {reviewsLoading ? (
              <div className="py-8 flex justify-center">
                <Loader size="small" />
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <ReviewCard
                    key={`review-${review.id || index}`}
                    userAvatar={review.userAvatar}
                    username={review.username || "Anonymous"}
                    rating={review.rating}
                    timestamp={review.createdAt}
                    description={review.description}
                    images={review.contentUrls?.split(';') || []}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-6">No reviews yet for this product.</p>
            )}

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

                {/* Render pagination numbers */}
                {[...Array(totalPages)].map((_, i) => {
                  // Show limited page numbers for better UX
                  if (
                    totalPages <= 7 || // Show all if 7 or fewer pages
                    i === 0 || // Always show first page
                    i === totalPages - 1 || // Always show last page
                    Math.abs(i + 1 - reviewPage) <= 2 // Show 2 pages around current page
                  ) {
                    return (
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
                    );
                  } else if (
                    (i === 1 && reviewPage > 4) ||
                    (i === totalPages - 2 && reviewPage < totalPages - 3)
                  ) {
                    // Add ellipsis for skipped pages
                    return <span key={i} className="text-gray-500">...</span>;
                  }
                  return null;
                })}

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
