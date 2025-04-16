import { Link } from "@tanstack/react-router";
import { FiStar } from "react-icons/fi";
import { cn } from "@/lib/utils.ts";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  salePercent?: number;
  salePrice?: number;
}

function ProductCard(
  {
    id,
    name,
    price,
    imageUrl,
    rating,
    reviewCount,
    salePercent,
    salePrice
  }: ProductCardProps
) {
  const hasDiscount = salePercent !== undefined && salePercent > 0;

  return (
    <Link
      to="/products/$productId"
      params={{
        productId: id
      }}
      className="block bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow p-4"
    >
      <div className="aspect-square bg-gray-700 rounded-xl mb-3 overflow-hidden relative">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />

        {/* Sale badge */}
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
            -{salePercent}%
          </div>
        )}
      </div>

      <h3 className="text-sm font-medium text-white truncate">{name}</h3>

      <div className="mt-1 flex items-center">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              className={cn(
                "h-3 w-3 mr-0.5",
                i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-500"
              )}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400 ml-1">({reviewCount})</span>
      </div>

      <div className="mt-1">
        {hasDiscount ? (
          <>
            <div className="text-white font-bold">₫{salePrice?.toLocaleString()}</div>
            <div className="text-xs text-gray-400 line-through">₫{price.toLocaleString()}</div>
          </>
        ) : (
          <div className="text-white font-bold">₫{price.toLocaleString()}</div>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;
