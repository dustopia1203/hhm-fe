import React, { useState } from 'react';
import { Link, useNavigate } from "@tanstack/react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FiPlus, FiX } from 'react-icons/fi';
import validateConstraints from "@constants/validateConstraints.ts";
import uploadFile from "@utils/cloudinary.ts";
import { useCreateMyShopApi } from "@apis/useShopApis.ts";

const schema = z.object({
  name: z.string()
    .min(1, "Tên cửa hàng không được để trống")
    .max(validateConstraints.NAME.MAX_LENGTH.value as number, validateConstraints.NAME.MAX_LENGTH.message),
  address: z.string()
    .min(1, "Địa chỉ cửa hàng không được để trống")
    .max(validateConstraints.ADDRESS.MAX_LENGTH.value as number, validateConstraints.ADDRESS.MAX_LENGTH.message)
});

type CreateShopForm = z.infer<typeof schema>;

function CreateShopForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateShopForm>({
    resolver: zodResolver(schema)
  });
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync } = useCreateMyShopApi();

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatar(e.target.files[0]);
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
  };

  const onSubmit: SubmitHandler<CreateShopForm> = async (data) => {
    setIsSubmitting(true);

    try {
      let avatarUrl = null;

      if (avatar) {
        avatarUrl = await uploadFile(avatar);
      }

      await mutateAsync({
        name: data.name,
        address: data.address,
        avatarUrl
      });

      toast.success(
        "Tạo cửa hàng thành công",
        {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss
          }
        }
      );

      navigate({ to: "/my/shop" });
      setTimeout(() => window.location.reload(), 500);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo cửa hàng",
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
                  disabled={isSubmitting}
                >
                  <FiX size={12}/>
                </button>
              </div>
            ) : (
              <label
                className={`h-24 w-24 border border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-800 hover:bg-gray-750 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <FiPlus className="text-gray-400 mb-1" size={18}/>
                <span className="text-xs text-gray-400 text-center">Thêm ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isSubmitting}
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
            Tạo cửa hàng
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
