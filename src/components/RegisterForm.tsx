import { Link } from "@tanstack/react-router";
import { FaFacebook, FaGoogle } from "react-icons/fa";

function RegisterForm() {
  return (
    <>
      <div className="">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4 text-center text-white">Đăng ký</h2>
          <p className="text-center mb-6 text-gray-400">Bắt đầu với HHMShop</p>
          <form>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2" htmlFor="fullname">
                Họ và tên
              </label>
              <input
                type="text"
                id="fullname"
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                required={true}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2" htmlFor="username">
                Tài khoản
              </label>
              <input
                type="text"
                id="username"
                required={true}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2" htmlFor="password">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                required={true}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2" htmlFor="confirm-password">
                Nhập lại mật khẩu
              </label>
              <input
                type="password"
                id="confirm-password"
                required={true}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2" htmlFor="referral-code">
                Mã giới thiệu
              </label>
              <input
                type="text"
                id="referral-code"
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div className="flex items-start mb-4">
              <input type="checkbox" className="form-checkbox bg-gray-700 border-gray-600 mt-1" />
              <span className="ml-2 text-gray-400">
                Tôi hoàn toàn đồng ý với
                <Link to="#" className="text-gray-500 hover:underline"> điều khoản và chính sách </Link>
                của HHMShop
              </span>
            </div>
            <div className="mb-4">
              <button
                className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
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
      </div>
    </>
  )
}

export default RegisterForm;
