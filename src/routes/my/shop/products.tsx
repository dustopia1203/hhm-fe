import { createFileRoute, useNavigate } from '@tanstack/react-router';
import ShopHeader from "@components/features/ShopHeader.tsx";
import ShopSidebar from "@components/features/ShopSidebar.tsx";
import Footer from "@components/features/Footer.tsx";
import useShopStore from "@stores/useShopStore.ts";
import ProductList from "@components/features/ProductList.tsx";
import { useSearchProducts } from "@apis/useProductApis.ts";
import { toast } from "sonner";
import auth from "@utils/auth.ts";

export const Route = createFileRoute('/my/shop/products')({
  beforeLoad: () => auth([]),
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      keyword: search.keyword as string | undefined,
      pageIndex: search.pageIndex ? Number(search.pageIndex) : 1,
      pageSize: search.pageSize ? Number(search.pageSize) : 20,
      sortBy: search.sortBy as string || 'createdAt',
      sortOrder: search.sortOrder as "ASC" | "DESC" || 'DESC',
      status: search.status as "ACTIVE" | "INACTIVE" | undefined
    };
  }
})

function RouteComponent() {
  const navigate = useNavigate();
  const { shop } = useShopStore();
  const {
    keyword,
    pageIndex = 0,
    pageSize = 10,
    sortBy = 'createdAt',
    sortOrder = 'DESC',
    status
  } = Route.useSearch();

  const { data, isLoading, error } = useSearchProducts({
    keyword,
    pageIndex,
    pageSize,
    sortBy,
    sortOrder,
    shopIds: shop ? [shop.id] : undefined,
    status
  });

  if (error) {
    toast.error(
      error.message, {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      }
    );
  }

  if (!shop) {
    navigate({ to: "/my/shop" });
    return null;
  }

  const handleSearchChange = (newParams: {
    keyword?: string;
    pageIndex?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    status?: "ACTIVE" | "INACTIVE";
  }) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...newParams,
        ...(newParams.keyword !== undefined && { pageIndex: 1 }),
        ...(newParams.status !== undefined && { pageIndex: 1 }),
        ...(newParams.sortBy !== undefined && { pageIndex: 1 }),
        ...(newParams.sortOrder !== undefined && { pageIndex: 1 }),
      }),
      replace: true
    });
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-900">
      <ShopHeader/>

      <div className="flex flex-1">
        <div className="w-64 bg-gray-800">
          <ShopSidebar/>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <ProductList
            products={data?.data || []}
            isLoading={isLoading}
            keyword={keyword || ''}
            sortBy={sortBy}
            sortOrder={sortOrder}
            status={status}
            pageIndex={pageIndex}
            pageSize={pageSize}
            totalItems={data?.total || 0}
            onSearchChange={handleSearchChange}
          />
        </div>
      </div>

      <Footer/>
    </div>
  );
}
