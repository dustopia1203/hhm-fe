import React, { useState } from 'react'
import { FiPlus, FiX } from 'react-icons/fi'

interface RefundFormProps {
  orderItemId: string
  productName: string
  price: number
  quantity: number
  productImage?: string  // Optional since it wasn't explicitly mentioned
}

const RefundForm: React.FC<RefundFormProps> = ({
                                                 orderItemId,
                                                 productName,
                                                 price,
                                                 quantity,
                                                 productImage = '/placeholder-image.jpg',  // Default image if not provided
                                               }) => {
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    setIsSubmitting(true)

    // Mock submission
    setTimeout(() => {
      console.log('Submitted refund request:', {
        orderItemId,
        reason,
        notes,
        imageCount: images.length
      })
      setIsSubmitting(false)
      // Here you could redirect or show a success message
    }, 1000)
  }

  const handleCancel = () => {
    // Handle cancel action internally
    console.log('Refund request canceled')
    // Here you could navigate back or reset the form
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800">
      <div className="border-b border-gray-800 p-4">
        <h2 className="text-xl font-medium text-white">Trả hàng/Hoàn tiền</h2>
      </div>

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
        {/* Reason */}
        <div>
          <label htmlFor="reason" className="block text-white font-medium mb-2">
            Lý do
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full h-28 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-gray-600"
            placeholder="Nhập lý do trả hàng của bạn..."
            required
          />
        </div>

        {/* Evidence/Proof */}
        <div>
          <label className="block text-white font-medium mb-2">
            Minh chứng
          </label>
          <div className="flex flex-wrap gap-3">
            {images.map((img, index) => (
              <div key={index} className="h-20 w-20 bg-gray-800 rounded-lg overflow-hidden relative group">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Proof ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 h-5 w-5 bg-gray-900/80 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100"
                >
                  <FiX size={12} />
                </button>
              </div>
            ))}

            <label className="h-20 w-20 border border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-800 hover:bg-gray-750">
              <FiPlus className="text-gray-400 mb-1" size={18} />
              <span className="text-xs text-gray-400 text-center">Thêm hình ảnh</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                multiple
              />
            </label>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-white font-medium mb-2">
            Ghi chú
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-28 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-gray-600"
            placeholder="Nhập thêm ghi chú (nếu có)..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 mr-3 border border-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Hoàn thành'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default RefundForm
