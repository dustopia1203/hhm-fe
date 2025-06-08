import { Link } from "@tanstack/react-router";

function AdminHeader() {
  return (
    <header className="shadow-md bg-gray-900 top-0 left-0 w-full z-50">
      <div className="relative container mx-auto flex items-center justify-between py-4 px-6 text-gray-400 text-sm">
        <div className="flex items-center space-x-2">
          <img src="/vite.svg" alt="Admin Logo" className="h-8 w-8"/>
          <Link to="/admin/user-management" className="text-lg font-bold text-white">Admin Dashboard</Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/admin/user-management"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Quản lý người dùng
          </Link>
          <Link
            to="/admin/transaction"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Quản lý giao dịch
          </Link>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
