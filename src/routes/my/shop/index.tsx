import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import Footer from "@components/features/Footer.tsx";
import CreateShopForm from "@components/features/CreateShopForm.tsx";
import ShopHeader from "@components/features/ShopHeader.tsx";
import ShopSidebar from "@components/features/ShopSidebar.tsx";
import { useGetMyShopApi } from "@apis/useShopApis.ts";
import useShopStore from "@stores/useShopStore";
import Loader from "@components/common/Loader.tsx";
import { RxAvatar } from "react-icons/rx";
import { toast } from "sonner";
import auth from "@utils/auth.ts";

export const Route = createFileRoute('/my/shop/')({
  beforeLoad: () => auth([]),
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, error, isFetched } = useGetMyShopApi();
  const { shop, setShop } = useShopStore();

  useEffect(() => {
    if (data?.data) {
      setShop(data.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched]);

  if (isLoading) {
    return <Loader/>;
  }

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

  const shopContent = () => {
    if (shop) {
      return (
        <div className="text-white">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
              {shop.avatarUrl ? (
                <img
                  src={shop.avatarUrl}
                  alt={`${shop.name} avatar`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <RxAvatar size={40} className="text-gray-400"/>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold">{shop.name}</h1>
              <p className="text-gray-400">Address: {shop.address}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center">
          <span className={`px-2 py-1 rounded text-xs ${
            shop.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {shop.status}
          </span>
            <span className="ml-4">Products: {shop.productCount}</span>
            <span className="ml-4">Reviews: {shop.reviewCount}</span>
            <span className="ml-4">Rating: {shop.rating.toFixed(1)}</span>
          </div>
        </div>
      );
    }

    return <CreateShopForm/>;
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-900">
      <ShopHeader/>

      <div className="flex flex-grow">
        {shop && (
          <div className="w-64">
            <ShopSidebar/>
          </div>
        )}

        {/* Main content */}
        <main className="flex-grow py-8 px-6">
          <div className="container mx-auto">
            {shopContent()}
          </div>
        </main>
      </div>

      <Footer/>
    </div>
  );
}
