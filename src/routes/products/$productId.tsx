import { createFileRoute } from '@tanstack/react-router';
import { useState, useCallback, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductDetail from '../../components/features/ProductDetail';
import ShopProfileCard from '../../components/features/ShopProfileCard';
import ReviewCard from '../../components/features/ReviewCard';
import Header from "@components/features/Header.tsx";
import Footer from "@components/features/Footer.tsx";
import { getProductById, useGetProductByIdApi, useGetSimilarProductsApi } from "@apis/useProductApis.ts";
import { useSearchReviewsApi } from "@apis/useReviewApis.ts";
import Loader from "@components/common/Loader.tsx";
import NotFound from "@components/common/NotFound.tsx";
import ProductCard from "@components/features/ProductCard.tsx";

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
  
  // All state hooks
  const [reviewPage, setReviewPage] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);

  // All data fetching hooks
  const { data, isLoading, error } = useGetProductByIdApi(id);
  const { data: similarProducts, isLoading: similarProductsLoading } = useGetSimilarProductsApi(id, 10);
  const {
    data: reviewsData,
    isLoading: reviewsLoading
  } = useSearchReviewsApi({
    productIds: [id],
    pageIndex: reviewPage,
    pageSize: 10
  });

  const [similarProductsWithRating, setSimilarProductsWithRating] = useState<any[]>([]);
  useEffect(() => {
    const fetchRatings = async () => {
      if (!similarProducts) return;

      const enrichedProducts = await Promise.all(
        similarProducts.map(async (product) => {
          try {
            const res = await getProductById(product.id); // không dùng hook
            console.log(res.data.rating)
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

      setSimilarProductsWithRating(enrichedProducts);
    };

    fetchRatings();
  }, [similarProducts]);

  // All callback hooks
  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      if (prev === 0) {
        return Math.floor((similarProducts?.length || 0) / 4) - 1;
      }
      return prev - 1;
    });
  }, [similarProducts?.length]);

  const goToNextSlide = useCallback(() => {
    setCurrentSlide((next) => {
      if (next === Math.floor((similarProducts?.length || 0) / 4) + 1) {
        return 0;
      }
      return next + 1;
    });
  }, [similarProducts?.length]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [id]);

  // Early returns
  if (isLoading) {
    return <Loader/>;
  }

  if (error || !data) {
    return <NotFound/>;
  }

  // Calculate derived values
  const totalPages = Math.ceil(reviewsData?.total / reviewsData?.pageSize) || 1;
  const reviews = reviewsData?.data || [];
  const lastSlide = Math.max(0, Math.ceil((similarProducts?.length || 0) / 4) - 1);

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

          {/* Similar Products */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-6">Sản phẩm tương tự</h2>
            {similarProductsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array(4).fill(0).map((_, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                    <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : similarProductsWithRating?.length > 0 ? (
              <div className="relative">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {similarProductsWithRating
                    .slice(currentSlide * 4, (currentSlide + 1) * 4)
                    .map((product: any) => (
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
                
                {/* Navigation arrows - only render if not at edge, z-50 for top layer */}
                {similarProducts.length > 4 && (
                  <>
                    {currentSlide > 0 && (
                      <button
                        onClick={goToPrevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 bg-gray-800 text-white p-4 rounded-full hover:bg-gray-700 transition-colors shadow-lg z-50 text-3xl flex items-center justify-center"
                        aria-label="Previous products"
                        style={{ width: 56, height: 56 }}
                      >
                        <FiChevronLeft size={36} />
                      </button>
                    )}
                    {currentSlide < lastSlide && (
                      <button
                        onClick={goToNextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 bg-gray-800 text-white p-4 rounded-full hover:bg-gray-700 transition-colors shadow-lg z-50 text-3xl flex items-center justify-center"
                        aria-label="Next products"
                        style={{ width: 56, height: 56 }}
                      >
                        <FiChevronRight size={36} />
                      </button>
                    )}
                  </>
                )}

                {/* Pagination dots */}
                {similarProducts.length > 4 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: Math.ceil(similarProducts.length / 4) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-4 h-4 rounded-full transition-colors focus:outline-none border-2 border-transparent ${
                          currentSlide === index ? 'bg-white border-white' : 'bg-gray-600'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-6">Không tìm thấy sản phẩm tương tự.</p>
            )}
          </section>

        </main>
        <Footer/>
      </div>
    </>
  );
}
