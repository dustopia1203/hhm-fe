import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import validateConstraints from "@constants/validateConstraints.ts";
import { useLoginApi, useResetPasswordApi } from "@apis/useAccountApis.ts";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Mật khẩu hiện tại không được để trống"),
  newPassword: z.string()
    .min(validateConstraints.PASSWORD.MIN_LENGTH.value as number, validateConstraints.PASSWORD.MIN_LENGTH.message)
    .max(validateConstraints.PASSWORD.MAX_LENGTH.value as number, validateConstraints.PASSWORD.MAX_LENGTH.message)
    .regex(validateConstraints.PASSWORD.FORMAT.value as RegExp, validateConstraints.PASSWORD.FORMAT.message),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu mới không khớp",
  path: ["confirmPassword"]
});

type PasswordForm = z.infer<typeof passwordSchema>;

interface ChangePasswordFormProps {
  username: string;
  onClose: () => void;
}

export default function ChangePasswordForm({ username, onClose }: ChangePasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PasswordForm>({ 
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const resetPasswordMutation = useResetPasswordApi();
  const loginMutation = useLoginApi();

  const handlePasswordSubmit = async (data: PasswordForm) => {
    try {
      const loginResponse = await loginMutation.mutateAsync({
        credential: username,
        password: data.currentPassword,
        rememberMe: false
      })

      if (loginResponse) {
        await resetPasswordMutation.mutateAsync({
          credential: username,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        })

        toast.success('Đổi mật khẩu thành công')
        reset();
        onClose();
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error(
          `${error.response.data.message}`,
          {
            cancel: {
              label: "X",
              onClick: () => toast.dismiss
            }
          }
        );
      } else {
        toast.error(
          `${error.response?.data?.message || 'Có lỗi xảy ra'}`,
          {
            cancel: {
              label: "X",
              onClick: () => toast.dismiss
            }
          }
        );
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(handlePasswordSubmit)} className="space-y-4">
      <div>
        <label className="block text-gray-300 mb-2">Mật khẩu hiện tại</label>
        <input
          {...register("currentPassword")}
          type="password"
          className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        {errors.currentPassword && (
          <p className="text-sm text-red-500 mt-1">{errors.currentPassword.message}</p>
        )}
      </div>
      <div>
        <label className="block text-gray-300 mb-2">Mật khẩu mới</label>
        <input
          {...register("newPassword")}
          type="password"
          className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        {errors.newPassword && (
          <p className="text-sm text-red-500 mt-1">{errors.newPassword.message}</p>
        )}
      </div>
      <div>
        <label className="block text-gray-300 mb-2">Xác nhận mật khẩu mới</label>
        <input
          {...register("confirmPassword")}
          type="password"
          className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => {
            onClose();
            reset();
          }}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed"
        >
          {resetPasswordMutation.isPending ? 'Đang xử lý...' : 'Lưu mật khẩu'}
        </button>
      </div>
    </form>
  );
}