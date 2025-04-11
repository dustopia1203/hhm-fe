import { publicClient } from "./axiosClient.ts";
import { useQuery } from "@tanstack/react-query";
import resourceUrls from "@constants/resourceUrls.ts";

// Get categories API
interface Category {
  id: string;
  name: string;
}

interface CategoryResponse {
  data: Category[];
}

async function getAllCategories(): Promise<CategoryResponse> {
  const url = `${resourceUrls.CATEGORY_RESOURCE.SEARCH}?keyword=`;
  const response = await publicClient.get(url);
  console.log("response", response.data);
  return response.data; // Trả về toàn bộ dữ liệu từ API
}

function useGetAllCategoriesApi(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
    enabled: options?.enabled ?? true,
  });
}


export { useGetAllCategoriesApi };