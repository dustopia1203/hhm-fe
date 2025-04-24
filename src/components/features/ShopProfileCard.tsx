import { Link } from "@tanstack/react-router";
import { FiStar, FiUser } from "react-icons/fi";
import { useGetShopByIdApi } from "@apis/useShopApis.ts";
import Loader from "@components/common/Loader.tsx";

interface ShopProfileCardProps {
  id: string;
}

function ShopProfileCard({ id }: ShopProfileCardProps) {
  const { data, isLoading, error } = useGetShopByIdApi(id);

  if (isLoading || error || !data) {
    return (
      <div className="rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-md w-full">
        <Loader/>
      </div>
    );
  }

  const shop = data.data;

  const joinedYears = Math.floor((Date.now() - shop.createdAt) / (365 * 24 * 60 * 60 * 1000));

  return (
    <div className="rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-md w-full">
      {/* 4x2 Grid layout */}
      <div className="grid grid-cols-4 grid-rows-2 gap-y-6">
        {/* Top row */}
        {/* Column 1-2: Avatar + Shop name (spanning 2 columns) */}
        <div className="col-span-2 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
            {shop.avatarUrl ? (
              <img
                src={shop.avatarUrl}
                alt={`${shop.name} avatar`}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <FiUser className="h-6 w-6 text-gray-400"/>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex">
              <span className="text-white font-medium pr-2">{shop.name}</span>
              <div className="flex items-center">
                <FiStar
                  className={`h-4 w-4 ${shop.rating >= 1 ? "fill-yellow-400 text-yellow-400" : "text-gray-500"}`}/>
                <span className="text-yellow-400 ml-1 text-sm">{shop.rating.toFixed(1)}</span>
              </div>
            </div>
            <span className="text-xs text-gray-400">{shop.address}</span>
          </div>
        </div>

        {/* Column 3: Reviews + Count + Rating */}
        <div className="flex items-center justify-start space-x-4">
          <span className="text-gray-400">Reviews</span>
          <div className="flex items-center">
            <span className="text-white mr-2">{shop.reviewCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Column 4: Joined + Years */}
        <div className="flex items-center justify-start space-x-4">
          <span className="text-gray-400">Joined</span>
          <span className="text-white">{joinedYears} years</span>
        </div>

        {/* Bottom row */}
        {/* Column 1-2: Visit Shop button (spanning 2 columns) */}
        <div className="col-span-2 flex items-center">
          <Link
            to={`/shop/${id}`}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Visit shop
          </Link>
        </div>

        {/* Column 3: Products + Count */}
        <div className="flex items-center justify-start space-x-4">
          <span className="text-gray-400">Products</span>
          <span className="text-white">{shop.productCount.toLocaleString()}</span>
        </div>

        {/* Column 4: Empty */}
        <div></div>
      </div>
    </div>
  );
}

export default ShopProfileCard;
