import { publicClient } from "./axiosClient.ts";
import { useQuery } from "@tanstack/react-query";
import resourceUrls from "@constants/resourceUrls.ts";

// Get products API
interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    shopId: string;
    categoryId: string;
    contentUrls: string;
    amount: number;
}

interface ProductResponse {
    data: Product[];
}

async function getProductById(id: string): Promise<Product> {
    const url = resourceUrls.PRODUCT_RESOURCE.GET_BY_ID.replace("{id}", id);
    const response = await publicClient.get(url);
    console.log("response", response.data);
    return response.data;
}

async function getAllProducts(): Promise<ProductResponse> {
    const url = `${resourceUrls.PRODUCT_RESOURCE.SEARCH}?keyword=`;
    const response = await publicClient.get(url);
    return response.data;
}
function useGetAllProductsApi(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ["products"],
        queryFn: () => getAllProducts(),
        enabled: options?.enabled ?? true,
    });
}

function useGetProductByIdApi(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductById(id),
        enabled: options?.enabled ?? true,
    });
}

export { useGetAllProductsApi, useGetProductByIdApi };