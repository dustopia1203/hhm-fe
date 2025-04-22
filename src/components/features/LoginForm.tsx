import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "@tanstack/react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLoginApi } from "@apis/useAccountApis.tsx";
import { useEffect, useState } from "react";

interface LoginForm {
  credential: string;
  password: string;
  rememberMe: boolean;
}

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const navigate = useNavigate();
  const mutationLogin = useLoginApi();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      navigate({ to: "/" });
    }
  }, [navigate]);

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    setIsLoading(true);
    try {
      const responseData = await mutationLogin.mutateAsync(data);

      if (responseData) {
        toast.success(
          "Đăng nhập thành công",
          {
            cancel: {
              label: "X",
              onClick: () => toast.dismiss
            }
          }
        );

        localStorage.setItem("access_token", responseData.data.accessToken);
        localStorage.setItem("refresh_token", responseData.data.refreshToken);

        setTimeout(() => navigate({ to: "/" }), 500);
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
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Đăng nhập</h2>
        <p className="text-center mb-6 text-gray-400">Chào mừng đến với HHMShop</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="username">
              Tài khoản
            </label>
            <input
              {...register("credential", {
                required: "Tài khoản/email không được để trống",
              })}
              type="text"
              id="username"
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isLoading}
            />
            {errors.credential && <p className="text-sm text-red-500">{errors.credential.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="password">
              Mật khẩu
            </label>
            <input
              {...register("password", {
                required: "Mật khẩu không được để trống",
              })}
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isLoading}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center text-gray-400">
              <input
                {...register("rememberMe")}
                type="checkbox"
                className="form-checkbox bg-gray-700 border-gray-600"
                disabled={isLoading}
              />
              <span className="ml-2">Lưu tài khoản</span>
            </label>
            <Link to="#" className="text-gray-500 hover:underline">
              Quên mật khẩu
            </Link>
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Đăng nhập
            </button>
          </div>
          <div className="border-t border-gray-600 my-4"></div>
          <div className="text-center mb-4 text-gray-400">Hoặc đăng nhập với</div>
          <div className="flex justify-center space-x-4 mb-4">
            <button
              className="bg-gray-700 p-2 rounded-full w-10 h-10 flex items-center justify-center text-blue-500 hover:bg-gray-600 hover:text-blue-400 focus:ring-2 focus:ring-gray-500"
              disabled={isLoading}
            >
              <Link to="#">
                <FaFacebook/>
              </Link>
            </button>
            <button
              className="bg-gray-700 p-2 rounded-full w-10 h-10 flex items-center justify-center text-red-500 hover:bg-gray-600 hover:text-gray-300 focus:ring-2 focus:ring-gray-500"
              disabled={isLoading}
            >
              <Link to="#">
                <FaGoogle/>
              </Link>
            </button>
          </div>
          <div className="text-center">
            <span className="text-gray-400">Chưa có tài khoản?</span>
            <Link to="/register" className="text-gray-500 hover:underline ml-2">
              Đăng ký
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginForm;
