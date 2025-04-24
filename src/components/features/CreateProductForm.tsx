import React, { useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FiPlus, FiX } from 'react-icons/fi';
import validateConstraints from "@constants/validateConstraints.ts";
import uploadFile from "@utils/cloudinary.ts";
import { useCreateMyShopProductApi } from "@apis/useProductApis.ts";
import useShopStore from "@stores/useShopStore.ts";
import CategorySelect from "@components/features/CategorySelect.tsx";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  name: z.string()
    .min(1, "Tên sản phẩm không được để trống")
    .max(validateConstraints.NAME.MAX_LENGTH.value as number, validateConstraints.NAME.MAX_LENGTH.message),
  description: z.string()
    .min(1, "Mô tả sản phẩm không được để trống")
    .max(2000, "Mô tả sản phẩm không được vượt quá 2000 ký tự"),
  price: z.string()
    .min(1, "Giá sản phẩm không được để trống")
    .refine((val) => !isNaN(Number(val)), "Giá sản phẩm phải là số")
    .refine((val) => Number(val) > 0, "Giá sản phẩm phải lớn hơn 0"),
  amount: z.string()
    .min(1, "Số lượng không được để trống")
    .refine((val) => !isNaN(Number(val)), "Số lượng phải là số")
    .refine((val) => Number(val) >= 0, "Số lượng phải lớn hơn hoặc bằng 0"),
  categoryId: z.string()
    .min(1, "Danh mục không được để trống"),
});

type CreateProductForm = z.infer<typeof schema>;

interface CreateProductFormProps {
  onClose: () => void;
}

function CreateProductForm({ onClose }: CreateProductFormProps) {
  const queryClient = useQueryClient();
  const { shop } = useShopStore();
  const { control, register, handleSubmit, formState: { errors } } = useForm<CreateProductForm>({
    resolver: zodResolver(schema)
  });
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync } = useCreateMyShopProductApi();

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImages(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<CreateProductForm> = async (data) => {
    if (!shop) {
      toast.error("Không tìm thấy thông tin cửa hàng", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        }
      });
      return;
    }

    if (images.length === 0) {
      toast.error("Vui lòng thêm ít nhất một hình ảnh cho sản phẩm", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        }
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload all images and get their URLs
      const imageUploadPromises = images.map(image => uploadFile(image));
      const uploadedImageUrls = await Promise.all(imageUploadPromises);

      // Create product with uploaded images
      await mutateAsync({
        shopId: shop.id,
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        contentUrls: uploadedImageUrls.join(';'), // Join URLs with semicolons
        price: Number(data.price),
        amount: Number(data.amount)
      });

      toast.success("Tạo sản phẩm thành công", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        }
      });

      // Invalidate the products query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["product/search"] });

      // Close the dialog
      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo sản phẩm",
        {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss(),
          }
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-[800px]">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">Thêm sản phẩm mới</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-gray-400 mb-2" htmlFor="name">
            Tên sản phẩm
          </label>
          <input
            {...register("name")}
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        {/* Category - Using the CategorySelect component */}
        <CategorySelect
          name="categoryId"
          control={control}
          error={errors.categoryId?.message}
          disabled={isSubmitting}
        />

        {/* Price & Amount (side by side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-400 mb-2" htmlFor="price">
              Giá (₫)
            </label>
            <input
              {...register("price")}
              type="number"
              id="price"
              min="0"
              step="1000"
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isSubmitting}
            />
            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block text-gray-400 mb-2" htmlFor="amount">
              Số lượng
            </label>
            <input
              {...register("amount")}
              type="number"
              id="amount"
              min="0"
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isSubmitting}
            />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-gray-400 mb-2" htmlFor="description">
            Mô tả sản phẩm
          </label>
          <textarea
            {...register("description")}
            id="description"
            rows={6}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={isSubmitting}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
        </div>

        {/* Product Images */}
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">
            Hình ảnh sản phẩm
          </label>
          <div className="flex flex-wrap gap-3">
            {images.map((img, index) => (
              <div key={index} className="h-24 w-24 bg-gray-800 rounded-lg overflow-hidden relative group">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Product image ${index + 1}`}
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
              className={`h-24 w-24 border border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-800 hover:bg-gray-750 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <FiPlus className="text-gray-400 mb-1" size={18}/>
              <span className="text-xs text-gray-400 text-center">Thêm ảnh</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImagesUpload}
                disabled={isSubmitting}
                multiple
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onClose} // Changed from navigate to onClose
            disabled={isSubmitting}
            className="px-6 py-2.5 border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Tạo sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProductForm;
