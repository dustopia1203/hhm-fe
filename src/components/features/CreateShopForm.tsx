import React, { useState } from 'react';
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FiPlus, FiX } from 'react-icons/fi';
import validateConstraints from "@constants/validateConstraints.ts";

// Validation schema
const schema = z.object({
  name: z.string()
    .min(3, "Tên shop phải có ít nhất 3 ký tự")
    .max(validateConstraints.NAME.MAX_LENGTH.value, validateConstraints.NAME.MAX_LENGTH.message),
  address: z.string()
    .min(10, "Địa chỉ phải có ít nhất 10 ký tự")
    .max(200, "Địa chỉ không được quá 200 ký tự"),
  description: z.string().optional(),
  phoneNumber: z.string()
    .max(validateConstraints.PHONE.MAX_LENGTH.value, validateConstraints.PHONE.MAX_LENGTH.message)
    .regex(validateConstraints.PHONE.FORMAT.value, validateConstraints.PHONE.FORMAT.message)
    .optional()
});

type AddShopForm = z.infer<typeof schema>;

function CreateShopForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<AddShopForm>({
    resolver: zodResolver(schema)
  });
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatar(e.target.files[0]);
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
  };

  const onSubmit: SubmitHandler<AddShopForm> = async (data) => {
    setIsSubmitting(true);

    try {
      // Create form data to handle file upload
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('address', data.address);
      if (data.description) formData.append('description', data.description);
      if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
      if (avatar) formData.append('avatar', avatar);

      // Here you would make the API call to create the shop
      // For now we'll just simulate a successful response
      console.log('Form data submitted:', {
        ...data,
        avatarFile: avatar ? avatar.name : 'No avatar'
      });

      // Simulate API delay
      setTimeout(() => {
        toast.success(
          "Tạo shop thành công",
          {
            cancel: {
              label: "X",
              onClick: () => toast.dismiss
            }
          }
        );

        // Navigate to shop page after success
        setTimeout(() => navigate({ to: "/my/shop" }), 500);
        setIsSubmitting(false);
      }, 1500);

    } catch (error: any) {
      setIsSubmitting(false);
      toast.error(
        error.message || "Có lỗi xảy ra khi tạo shop",
        {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss
          }
        }
      );
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-[600px] mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">Tạo cửa hàng mới</h2>
      <p className="text-center mb-6 text-gray-400">Bắt đầu hành trình kinh doanh của bạn với HHMShop</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Shop Name */}
        <div className="mb-4">
          <label className="block text-gray-400 mb-2" htmlFor="name">
            Tên cửa hàng
          </label>
          <input
            {...register("name")}
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        {/* Shop Address */}
        <div className="mb-4">
          <label className="block text-gray-400 mb-2" htmlFor="address">
            Địa chỉ
          </label>
          <input
            {...register("address")}
            type="text"
            id="address"
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
        </div>

        {/* Avatar Upload */}
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">
            Ảnh đại diện
          </label>
          <div className="flex items-center space-x-4">
            {avatar ? (
              <div className="h-24 w-24 bg-gray-800 rounded-lg overflow-hidden relative group">
                <img
                  src={URL.createObjectURL(avatar)}
                  alt="Shop avatar"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute top-1 right-1 h-5 w-5 bg-gray-900/80 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100"
                >
                  <FiX size={12} />
                </button>
              </div>
            ) : (
              <label className="h-24 w-24 border border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-800 hover:bg-gray-750">
                <FiPlus className="text-gray-400 mb-1" size={18} />
                <span className="text-xs text-gray-400 text-center">Thêm ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </label>
            )}

          </div>
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Tạo shop'}
          </button>
        </div>

        <div className="text-center">
          <Link to="/" className="text-gray-500 hover:underline">
            Quay lại
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CreateShopForm;
