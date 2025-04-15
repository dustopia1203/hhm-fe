import { useState } from "react";
import { FiUser, FiStar } from "react-icons/fi";
import { cn } from "../../lib/utils";

interface ReviewCardProps {
  username: string;
  rating: number;
  date: string;
  time: string;
  description: string;
  images?: string[];
}

function ReviewCard(
  {
    username,
    rating,
    date,
    time,
    description,
    images = []
  }: ReviewCardProps
) {
  const [imageView, setImageView] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-md">
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700">
          <FiUser className="text-gray-300"/>
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-gray-100">{username}</span>
          <span className="text-xs text-gray-400">{date} {time}</span>
        </div>
      </div>

      <div className="mt-3 flex">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={cn(
              "h-5 w-5",
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-500"
            )}
          />
        ))}
      </div>

      <p className="mt-4 text-gray-300">
        {description}
      </p>

      {images.length > 0 && (
        <div className="mt-4 flex space-x-3">
          {images.slice(0, 3).map((image, index) => (
            <div
              key={index}
              className="h-20 w-20 cursor-pointer overflow-hidden rounded-md bg-gray-700 border border-gray-600"
              onClick={() => setImageView(image)}
            >
              <img
                src={image}
                alt={`Review image ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {imageView && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setImageView(null)}
        >
          <div className="max-h-[80vh] max-w-[80vw]">
            <img
              src={imageView}
              alt="Review image enlarged"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewCard;