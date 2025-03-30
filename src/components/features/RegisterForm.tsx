import { Link, useNavigate } from "@tanstack/react-router";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useRegisterApi } from "@apis/useAccountApis.tsx";
import validateConstraints from "@constants/validateConstraints.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const schema = z.object({
  email: z.string()
    .max(validateConstraints.EMAIL.MAX_LENGTH.value, validateConstraints.EMAIL.MAX_LENGTH.message)
    .regex(validateConstraints.EMAIL.FORMAT.value, validateConstraints.EMAIL.FORMAT.message),
  username: z.string()
    .min(validateConstraints.USERNAME.MIN_LENGTH.value, validateConstraints.USERNAME.MIN_LENGTH.message)
    .max(validateConstraints.USERNAME.MAX_LENGTH.value, validateConstraints.USERNAME.MAX_LENGTH.message)
    .regex(validateConstraints.USERNAME.FORMAT.value, validateConstraints.USERNAME.FORMAT.message),
  password: z.string()
    .min(validateConstraints.PASSWORD.MIN_LENGTH.value, validateConstraints.PASSWORD.MIN_LENGTH.message)
    .max(validateConstraints.PASSWORD.MAX_LENGTH.value, validateConstraints.PASSWORD.MAX_LENGTH.message)
    .regex(validateConstraints.PASSWORD.FORMAT.value, validateConstraints.PASSWORD.FORMAT.message),
  confirmPassword: z.string()
    .min(validateConstraints.PASSWORD.MIN_LENGTH.value, validateConstraints.PASSWORD.MIN_LENGTH.message)
    .max(validateConstraints.PASSWORD.MAX_LENGTH.value, validateConstraints.PASSWORD.MAX_LENGTH.message)
    .regex(validateConstraints.PASSWORD.FORMAT.value, validateConstraints.PASSWORD.FORMAT.message),
  referralCode: z.string(),
  acceptPrivacy: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"]
});

type RegisterForm = z.infer<typeof schema>

function RegisterForm() {
  const { register, handleSubmit, control, formState: { errors } } = useForm<RegisterForm>({ resolver: zodResolver(schema) })

  const navigate = useNavigate();
  const mutation = useRegisterApi();
  const acceptPrivacyChecked = useWatch({ name: "acceptPrivacy", control });

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    try {
      const responseData = await mutation.mutateAsync(data);

      if (responseData) {
        toast.success(
          "Đăng ký thành công",
          {
            cancel: {
              label: "X",
              onClick: () => toast.dismiss
            }
          }
        );

        localStorage.setItem(
          "current_credential",
          JSON.stringify({ email: data.email, username: data.username })
        );

        setTimeout(() => navigate({ to: "/verify-account" }), 500);
      }
    } catch (error: any) {
      toast.error(
        `${error.response.data.message}`,
        {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss
          }
        }
      );
    }
  }

  return (
    <>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Đăng ký</h2>
        <p className="text-center mb-6 text-gray-400">Bắt đầu với HHMShop</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              {...register("email", {
                required: "Email không được để trống"
              })}
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="username">
              Tài khoản
            </label>
            <input
              {...register("username", {
                required: "Tên tài khoản không được để trống"
              })}
              type="text"
              id="username"
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="password">
              Mật khẩu
            </label>
            <input
              {...register("password", {
                required: "Mật khẩu không được để trống"
              })}
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="confirm-password">
              Nhập lại mật khẩu
            </label>
            <input
              {...register("confirmPassword", {
                required: "Mật khẩu xác nhận không được để trống"
              })}
              type="password"
              id="confirm-password"
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="referral-code">
              Mã giới thiệu
            </label>
            <input
              {...register("referralCode")}
              type="text"
              id="referral-code"
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div className="flex items-start mb-4">
            <input
              {...register("acceptPrivacy")}
              type="checkbox"
              className="form-checkbox bg-gray-700 border-gray-600 mt-1"/>
            <span className="ml-2 text-gray-400">
                Tôi hoàn toàn đồng ý với
                <Link to="#" className="text-gray-500 hover:underline"> điều khoản và chính sách </Link>
                của HHMShop
              </span>
          </div>
          <div className="mb-4">
            <button
              disabled={!acceptPrivacyChecked}
              className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
              Đăng ký
            </button>
          </div>
          <div className="border-t border-gray-600 my-4"></div>
          <div className="text-center mb-4 text-gray-400">Hoặc đăng ký bằng</div>
          <div className="flex justify-center space-x-4 mb-4">
            <button
              className="bg-gray-700 p-2 rounded-full w-10 h-10 flex items-center justify-center text-blue-500 hover:bg-gray-600 hover:text-blue-400 focus:ring-2 focus:ring-gray-500">
              <Link to="#">
                <FaFacebook/>
              </Link>
            </button>
            <button
              className="bg-gray-700 p-2 rounded-full w-10 h-10 flex items-center justify-center text-red-500 hover:bg-gray-600 hover:text-gray-300 focus:ring-2 focus:ring-gray-500">
              <Link to="#">
                <FaGoogle/>
              </Link>
            </button>
          </div>
          <div className="text-center">
            <span className="text-gray-400">Đã có tài khoản?</span>
            <Link to="/login" className="text-gray-500 hover:underline ml-2">
              Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}

export default RegisterForm;
