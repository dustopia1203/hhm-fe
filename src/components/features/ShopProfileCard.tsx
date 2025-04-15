import { Link } from "@tanstack/react-router";
import { FiUser } from "react-icons/fi";

interface ShopProfileCardProps {
  shopName: string;
  reviewCount: number;
  productCount: number;
  joinedYears: number;
  shopId: string;
  avatarUrl?: string;
}

function ShopProfileCard(
  {
    shopName,
    reviewCount,
    productCount,
    joinedYears,
    shopId,
    avatarUrl
  }: ShopProfileCardProps
) {
  return (
    <div className="rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-md w-full">
      {/* 4x2 Grid layout */}
      <div className="grid grid-cols-4 grid-rows-2 gap-y-6">
        {/* Top row */}
        {/* Column 1-2: Avatar + Shop name (spanning 2 columns) */}
        <div className="col-span-2 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${shopName} avatar`}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <FiUser className="h-6 w-6 text-gray-400"/>
            )}
          </div>
          <span className="text-white font-medium">{shopName}</span>
        </div>

        {/* Column 3: Reviews + Count */}
        <div className="flex items-center justify-start space-x-4">
          <span className="text-gray-400">Reviews</span>
          <span className="text-white">{reviewCount.toLocaleString()}</span>
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
            to={`/shop/${shopId}`}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Visit shop
          </Link>
        </div>

        {/* Column 3: Products + Count */}
        <div className="flex items-center justify-start space-x-4">
          <span className="text-gray-400">Products</span>
          <span className="text-white">{productCount.toLocaleString()}</span>
        </div>

        {/* Column 4: Empty */}
        <div></div>
      </div>
    </div>
  );
}

export default ShopProfileCard;
