import { publicClient } from "@apis/axiosClient.ts";
import resourceUrls from "@constants/resourceUrls.ts";
import { useQuery } from "@tanstack/react-query";

// Search API
interface ProductSearchRequest {
  keyword?: string;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  ids?: string[];
  shopIds?: string[];
  categoryIds?: string[];
  status?: "ACTIVE" | "INACTIVE";
}

async function searchProducts(request: ProductSearchRequest) {
  const params: Record<string, any> = { ...request };

  if (request.shopIds && request.shopIds.length > 0) {
    if (request.shopIds.length === 1) {
      params.shopIds = request.shopIds[0];
    }
  }

  if (request.ids && request.ids.length === 1) {
    params.ids = request.ids[0];
  }

  if (request.categoryIds && request.categoryIds.length === 1) {
    params.categoryIds = request.categoryIds[0];
  }

  const response = await publicClient.get(resourceUrls.PRODUCT_RESOURCE.SEARCH_PRODUCTS, {
    params,
    paramsSerializer: {
      serialize: (params) => {
        const parts: string[] = [];

        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(item => {
              parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`);
            });
          } else if (value !== undefined && value !== null) {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
          }
        });

        return parts.join('&');
      }
    }
  });

  return response.data;
}

function useSearchProducts(request: ProductSearchRequest) {
  return useQuery({
    queryKey: ["product/search", request],
    queryFn: () => searchProducts(request)
  })
}

// Get by id API
async function getProductById(id: string) {
  const response = await publicClient.get(resourceUrls.PRODUCT_RESOURCE.GET_PRODUCT_BY_ID.replace("{id}", id));

  return response.data;
}

function useGetProductById(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id)
  })
}

export {
  useSearchProducts,
  useGetProductById
}
