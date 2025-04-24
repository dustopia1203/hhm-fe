import { publicClient } from "@apis/axiosClient.ts";
import resourceUrls from "@constants/resourceUrls.ts";
import { useQuery } from "@tanstack/react-query";
import { prepareParams, serializeParams } from "@utils/searchUtils.ts";

// Search categories API
interface CategorySearchRequest {
  keyword?: string;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  ids?: string[];
  parentIds?: string[];
  status?: "ACTIVE" | "INACTIVE";
}

async function searchCategories(request: CategorySearchRequest) {
  const params = prepareParams(request)

  const response = await publicClient.get(resourceUrls.CATEGORY_RESOURCE.SEARCH_CATEGORIES, {
    params,
    paramsSerializer: {
      serialize: serializeParams
    }
  });

  return response.data;
}

function useSearchCategories(request: CategorySearchRequest) {
  return useQuery({
    queryKey: ["category/search", request],
    queryFn: () => searchCategories(request)
  });
}

// Get category tree by id API
async function getCategoryTreeById(id: string) {
  const response = await publicClient.get(resourceUrls.CATEGORY_RESOURCE.GET_TREE_BY_ID.replace("{id}", id));

  return response.data;
}

function useGetCategoryTreeById(id: string, options?: { enabled: boolean }) {
  return useQuery({
    queryKey: ["category/tree", id],
    queryFn: () => getCategoryTreeById(id),
    enabled: !!id && (options?.enabled === true),
  });
}

export {
  useSearchCategories,
  useGetCategoryTreeById
}
