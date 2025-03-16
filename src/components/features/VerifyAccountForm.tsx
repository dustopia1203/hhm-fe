import { Link } from '@tanstack/react-router';

function VerifyAccountForm() {
  return (
    <>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Xác nhận tài khoản</h2>
        <p className="text-center mb-6 text-gray-400">Chào mừng đến với HHMShop</p>
        <p className="text-center mb-6 text-gray-400">Mã xác nhận đã được gửi đến email đăng ký của bạn: ******@***.com</p>
        <form>
          <div className="flex justify-center space-x-2 mb-4">
            <input type="text" maxLength="1" className="w-12 h-12 text-center border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500" />
            <input type="text" maxLength="1" className="w-12 h-12 text-center border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500" />
            <input type="text" maxLength="1" className="w-12 h-12 text-center border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500" />
            <input type="text" maxLength="1" className="w-12 h-12 text-center border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500" />
            <input type="text" maxLength="1" className="w-12 h-12 text-center border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500" />
            <input type="text" maxLength="1" className="w-12 h-12 text-center border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500" />
          </div>
          <div className="mb-4">
            <button className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
              Xác nhận
            </button>
          </div>
          <div className="border-t border-gray-600 my-4"></div>
          <div className="text-center mb-4 text-gray-400">Không nhận được mã xác nhận?</div>
          <div className="mb-4">
            <button className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
              Gửi lại
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

export default VerifyAccountForm;