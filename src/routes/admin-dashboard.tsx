import Logout from "@/components/features/Logout";
import useProfileStore from "@/stores/useProfileStore";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa6";
import { RxAvatar } from "react-icons/rx";

export const Route = createFileRoute('/admin-dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profile = useProfileStore((state) => state.profile);
  const navigate = useNavigate();

  let timeoutId: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsMenuOpen(false);
    }, 200);
  };

  useEffect(() => {
    if (!profile || !profile.grantedPrivileges.includes("ALL:MANAGE")) {
      navigate({ to: "/" });
    }
  }, [profile, navigate]);
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-lg font-bold border-b border-gray-700">HHMShop</div>
        <nav className="flex-1 p-4">
          <ul>
            <li className="mb-2">
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-700">
                Bảng điều khiển
              </button>
            </li>
            <li className="mb-2">
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-700">
                Tài khoản
              </button>
            </li>
            <li>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-700">
                Người dùng
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="shadow-md flex justify-between items-center text-gray-400 text-sm py-2 px-6 bg-gray-800">
          <Link to="#" className="text-gray-500 hover:underline">
            Hỗ trợ
          </Link>
          {profile ? (
            <div className="relative flex items-center space-x-4">
              <FaBell className="text-gray-300 cursor-pointer" size={20} />
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <RxAvatar size={24} className="cursor-pointer" />
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                    <ul className="py-2">
                      <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Đơn mua</li>
                      <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Tài khoản</li>
                      <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                        <Logout />
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-x-2">
              <Link to="/login" className="text-gray-500 hover:underline">
                Đăng nhập
              </Link>
              <span>|</span>
              <Link to="/register" className="text-gray-500 hover:underline">
                Đăng ký
              </Link>
            </div>
          )}
        </div>

        {/* Dashboard Content */}
        <main className="p-6 bg-gray-100 flex-1">
          {/* Statistics */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">1000</p>
              <p className="text-gray-500">Tổng số người dùng</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">100</p>
              <p className="text-gray-500">Số người dùng mới</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">980</p>
              <p className="text-gray-500">Người dùng đang hoạt động</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">10</p>
              <p className="text-gray-500">Người dùng bị khóa</p>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  className="border border-gray-300 rounded px-4 py-2"
                />
                <select className="border border-gray-300 rounded px-4 py-2">
                  <option>Tình trạng tài khoản</option>
                </select>
                <select className="border border-gray-300 rounded px-4 py-2">
                  <option>Chức vụ</option>
                </select>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                + Thêm người dùng
              </button>
            </div>

            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">#</th>
                  <th className="border border-gray-300 px-4 py-2">Tên tài khoản</th>
                  <th className="border border-gray-300 px-4 py-2">Tên người dùng</th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">Chức vụ</th>
                  <th className="border border-gray-300 px-4 py-2">Hoạt động</th>
                  <th className="border border-gray-300 px-4 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td className="border border-gray-300 px-4 py-2">1</td>
                  <td className="border border-gray-300 px-4 py-2">anv</td>
                  <td className="border border-gray-300 px-4 py-2">Nguyễn Văn A</td>
                  <td className="border border-gray-300 px-4 py-2">anv@gmail.com</td>
                  <td className="border border-gray-300 px-4 py-2">ADMIN</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input type="checkbox" checked />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button className="text-blue-500">Sửa</button> |{" "}
                    <button className="text-red-500">Xóa</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}