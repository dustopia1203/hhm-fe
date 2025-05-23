import React, { useState } from 'react'
import { FiPlus, FiX } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'

interface ReviewFormProps {
  orderItemId: string
  productName: string
  price: number
  quantity: number
  productImage?: string
  isSubmitting?: boolean
  onSubmit?: (data: {
    orderItemId: string
    rating: number
    comment: string
    images: File[]
  }) => void
  onClose?: () => void
}

function ReviewForm
({
   orderItemId,
   productName,
   price,
   quantity,
   productImage = '/placeholder-image.jpg',
   isSubmitting = false,
   onSubmit,
   onClose
 }: ReviewFormProps
) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [images, setImages] = useState<File[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImages(prev => [...prev, ...Array.from(e.target.files || [])])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formData = {
      orderItemId,
      rating,
      comment,
      images
    }

    // If onSubmit prop exists, call it with form data
    if (onSubmit) {
      onSubmit(formData)
    } else {
      // Fallback to default behavior (for backward compatibility)
      console.log('Submitted review:', formData)
    }
  }

  const handleCancel = () => {
    if (onClose) {
      onClose()
    } else {
      // Fallback behavior
      console.log('Review canceled')
    }
  }

  return (
    <div className="bg-gray-900 rounded-lg">
      {/* Product Information */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center">
          <div className="h-20 w-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={productImage}
              alt={productName}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="ml-4 flex-grow">
            <h3 className="text-white font-medium">{productName}</h3>
            <div className="mt-1">
              <span className="text-white">${price.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-gray-400">
            × {quantity}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-5">
        {/* Rating Stars */}
        <div>
          <label className="block text-white font-medium mb-3">
            Đánh giá
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-2xl focus:outline-none"
                disabled={isSubmitting}
              >
                <FaStar
                  className={`${
                    (hoveredRating || rating) >= star
                      ? 'text-yellow-400'
                      : 'text-gray-600'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-white font-medium mb-2">
            Nhận xét
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-28 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-gray-600"
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            disabled={isSubmitting}
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-white font-medium mb-2">
            Thêm hình ảnh
          </label>
          <div className="flex flex-wrap gap-3">
            {images.map((img, index) => (
              <div key={index} className="h-20 w-20 bg-gray-800 rounded-lg overflow-hidden relative group">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 h-5 w-5 bg-gray-900/80 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100"
                  disabled={isSubmitting}
                >
                  <FiX size={12}/>
                </button>
              </div>
            ))}

            <label
              className={`h-20 w-20 border border-gray-700 rounded-lg flex flex-col items-center justify-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer bg-gray-800 hover:bg-gray-750'}`}>
              <FiPlus className="text-gray-400 mb-1" size={18}/>
              <span className="text-xs text-gray-400 text-center">Thêm hình ảnh</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                multiple
                disabled={isSubmitting}
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 mr-3 border border-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="px-6 py-2.5 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Hoàn thành'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReviewForm
