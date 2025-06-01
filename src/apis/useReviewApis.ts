import { useMutation, useQuery } from "@tanstack/react-query";
import { authClient } from "@apis/axiosClient.ts";
import resourceUrls from "@constants/resourceUrls.ts";
import { prepareParams, serializeParams } from "@utils/searchUtils.ts";

// Search reviews API
interface ReviewSearchRequest {
  keyword?: string;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  userIds?: string[];
  shopIds?: string[];
  orderItemIds?: string[];
  productIds?: string[];
  rating?: number;
}

async function searchReviews(request: ReviewSearchRequest) {
  const params = prepareParams(request);

  const response = await authClient.get(resourceUrls.REVIEW_RESOURCE.SEARCH_REVIEWS, {
    params,
    paramsSerializer: {
      serialize: serializeParams
    }
  });

  return response.data;
}

function useSearchReviewsApi(request: ReviewSearchRequest) {
  return useQuery({
    queryKey: ["reviews/search", request],
    queryFn: () => searchReviews(request)
  });
}

// Create review API
interface CreateReviewRequest {
  orderItemId: string;
  rating: number;
  description: string;
  contentUrls: string;
}

async function createMyReview(request: CreateReviewRequest) {
  const response = await authClient.post(resourceUrls.REVIEW_RESOURCE.CREATE_MY_REVIEW, request);
  return response.data;
}

function useCreateMyReviewApi() {
  return useMutation({
    mutationFn: createMyReview
  });
}

export {
  useSearchReviewsApi,
  useCreateMyReviewApi
}
