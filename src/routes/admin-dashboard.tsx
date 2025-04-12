import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import Header from "@/components/features/Header";
import withAuth from "@/components/hocs/withAuth";

export const Route = createFileRoute('/admin-dashboard')({
  component: withAuth(RouteComponent, ["ALL:MANAGE"]),
});

function RouteComponent() {
  return (
    <div className="flex h-screen w-full py-6 pt-10">
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
        <Header />
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