import { createFileRoute } from '@tanstack/react-router'
import { FiSearch, FiArrowLeft, FiArrowRight, FiTrash2, FiEye, FiUsers } from "react-icons/fi";
import { useEffect, useState } from "react";
import Loader from "@components/common/Loader.tsx";
import {
  useActivateUsersApi,
  useDeleteUsersApi,
  useGetUserByIdApi,
  useGetUserRolesApi,
  useInactivateUsersApi,
  useSearchUsersApi,
  useSetUserRoleApi
} from "@apis/useUserApis.ts";
import { useGetAvailableRoles } from "@apis/useRoleApis.ts";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/ui/dialog";
import AdminHeader from "@components/features/AdminHeader.tsx";
import Footer from "@components/features/Footer.tsx";

// Define search params for the route
export const Route = createFileRoute('/admin/user-management')({
  component: UserManagement,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      keyword: search.keyword as string | undefined,
      pageIndex: Number(search.pageIndex || 1),
      pageSize: Number(search.pageSize || 10),
      sortBy: (search.sortBy as string) || 'createdAt',
      sortOrder: (search.sortOrder as 'ASC' | 'DESC') || 'DESC',
      status: search.status as 'ACTIVE' | 'INACTIVE' | undefined,
      accountType: search.accountType as 'SYSTEM' | 'GOOGLE' | 'FACEBOOK' | undefined
    };
  },
})

function UserManagement() {
  // Get search params from router
  const {
    keyword,
    pageIndex = 1,
    pageSize = 10,
    sortBy = 'createdAt',
    sortOrder = 'DESC',
    status,
    accountType
  } = Route.useSearch();

  // Get the navigation function for search params
  const navigate = Route.useNavigate();

  // UI state
  const [searchInput, setSearchInput] = useState(keyword);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isRolesTabActive, setIsRolesTabActive] = useState(false);

  // Query client for cache invalidation
  const queryClient = useQueryClient();

  // API calls
  const {
    data,
    isLoading,
    error
  } = useSearchUsersApi({
    keyword,
    pageIndex: pageIndex,
    pageSize,
    sortBy,
    sortOrder,
    status,
    accountType
  });

  // User detail data when a user is selected
  const {
    data: userDetailData,
    isLoading: isLoadingUserDetail
  } = useGetUserByIdApi(selectedUserId || '');

  // Role data when a user is selected
  const {
    data: userRolesData,
    isLoading: isLoadingUserRoles
  } = useGetUserRolesApi(selectedUserId || '');

  // Available roles data
  const availableRolesQuery = useGetAvailableRoles();

  // API mutations
  const activateMutation = useActivateUsersApi();
  const inactivateMutation = useInactivateUsersApi();
  const deleteMutation = useDeleteUsersApi();
  const setRoleMutation = useSetUserRoleApi();

  // Update search input when keyword changes
  useEffect(() => {
    setSearchInput(keyword || '');
  }, [keyword]);

  // Set selected roles when user roles data is loaded
  useEffect(() => {
    if (userRolesData?.data) {
      setSelectedRoles(userRolesData.data.map((role: any) => role.id));
    } else {
      setSelectedRoles([]);
    }
  }, [userRolesData]);

  // Fetch available roles when roles tab is active
  useEffect(() => {
    if (isRolesTabActive && selectedUserId) {
      availableRolesQuery.refetch();
    }
  }, [isRolesTabActive, selectedUserId]);

  // Show error toast if query fails
  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể tải danh sách người dùng", {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss(),
          },
        }
      );
    }
  }, [error]);

  // Update search params
  const updateSearchParams = (updates: Record<string, any>) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...updates,
      }),
      replace: true
    });
  };

  // Handle search input with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    const timer = setTimeout(() => {
      updateSearchParams({
        keyword: value || undefined,
        pageIndex: 1 // Reset to first page on new search
      });
    }, 300);

    return () => clearTimeout(timer);
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    switch (value) {
      case 'newest':
        updateSearchParams({ sortBy: 'createdAt', sortOrder: 'DESC' });
        break;
      case 'oldest':
        updateSearchParams({ sortBy: 'createdAt', sortOrder: 'ASC' });
        break;
      case 'nameAZ':
        updateSearchParams({ sortBy: 'username', sortOrder: 'ASC' });
        break;
      case 'nameZA':
        updateSearchParams({ sortBy: 'username', sortOrder: 'DESC' });
        break;
      default:
        updateSearchParams({ sortBy: 'createdAt', sortOrder: 'DESC' });
    }
  };

  // Get current sort option for the select element
  const getCurrentSortOption = () => {
    if (sortBy === 'createdAt' && sortOrder === 'DESC') return 'newest';
    if (sortBy === 'createdAt' && sortOrder === 'ASC') return 'oldest';
    if (sortBy === 'username' && sortOrder === 'ASC') return 'nameAZ';
    if (sortBy === 'username' && sortOrder === 'DESC') return 'nameZA';
    return 'newest';
  };

  // Handle status filter change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'ACTIVE' | 'INACTIVE' | 'ALL';
    updateSearchParams({
      status: value === 'ALL' ? undefined : value,
      pageIndex: 1 // Reset to first page on filter change
    });
  };

  // Handle account type filter change
  const handleAccountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'SYSTEM' | 'GOOGLE' | 'FACEBOOK' | 'ALL';
    updateSearchParams({
      accountType: value === 'ALL' ? undefined : value,
      pageIndex: 1 // Reset to first page on filter change
    });
  };

  // Handle user selection
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  // Handle select all users
  const handleSelectAll = () => {
    if (selectedUsers.length === (data?.data?.length || 0)) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(data?.data?.map(user => user.id) || []);
    }
  };

  // Handle user status toggle
  const handleStatusToggle = async (userId: string, currentStatus: "ACTIVE" | "INACTIVE") => {
    try {
      setIsProcessing(true);

      if (currentStatus === "ACTIVE") {
        await inactivateMutation.mutateAsync({ ids: [userId] });
        toast.success("Đã vô hiệu hóa người dùng thành công", {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss(),
          }
        });
      } else {
        await activateMutation.mutateAsync({ ids: [userId] });
        toast.success("Đã kích hoạt người dùng thành công", {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss(),
          }
        });
      }

      queryClient.invalidateQueries({ queryKey: ["users/search"] });
    } catch (error) {
      toast.error("Không thể thay đổi trạng thái người dùng", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        }
      });
      console.error("Error toggling user status:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) return;

    try {
      setIsProcessing(true);
      await deleteMutation.mutateAsync({ ids: [userId] });
      toast.success("Đã xóa người dùng thành công", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        }
      });

      // Close the dialog if open
      setIsDetailDialogOpen(false);

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ["users/search"] });

      // If we deleted the last item on a page, go to previous page
      if (data?.data?.length === 1 && pageIndex > 1) {
        updateSearchParams({ pageIndex: pageIndex - 1 });
      }
    } catch (error) {
      toast.error("Không thể xóa người dùng", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        }
      });
      console.error("Error deleting user:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Open user detail dialog
  const handleOpenDetailDialog = (userId: string) => {
    setSelectedUserId(userId);
    setIsRolesTabActive(false);
    setIsDetailDialogOpen(true);
  };

  // Handle role selection toggle
  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  // Save user roles
  const handleSaveRoles = async () => {
    if (!selectedUserId) return;

    try {
      setIsProcessing(true);

      // Check if roles have changed
      const currentRoleIds = userRolesData?.data?.map((role: any) => role.id) || [];
      const hasChanges = selectedRoles.length !== currentRoleIds.length ||
        selectedRoles.some(id => !currentRoleIds.includes(id)) ||
        currentRoleIds.some(id => !selectedRoles.includes(id));

      if (hasChanges) {
        // Format data for the API
        await setRoleMutation.mutateAsync({
          id: selectedUserId,
          data: { ids: selectedRoles }
        });

        toast.success("Cập nhật vai trò người dùng thành công", {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss(),
          }
        });

        // Refresh data
        queryClient.invalidateQueries({ queryKey: ["users/roles", selectedUserId] });
        queryClient.invalidateQueries({ queryKey: ["users/search"] });
      } else {
        toast.info("Không có thay đổi nào về vai trò", {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss(),
          }
        });
      }
    } catch (error) {
      toast.error("Không thể cập nhật vai trò", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        }
      });
      console.error("Error setting roles:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle bulk activate
  const handleBulkActivate = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Vui lòng chọn người dùng để kích hoạt", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        }
      });
      return;
    }

    try {
      setIsProcessing(true);
      await activateMutation.mutateAsync({ ids: selectedUsers });
      toast.success(`Đã kích hoạt ${selectedUsers.length} người dùng thành công`, {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        }
      });
      setSelectedUsers([]);
      queryClient.invalidateQueries({ queryKey: ["users/search"] });
    } catch (error) {
      toast.error("Không thể kích hoạt người dùng", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        }
      });
      console.error("Error activating users:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle bulk inactivate
  const handleBulkInactivate = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Vui lòng chọn người dùng để vô hiệu hóa", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        }
      });
      return;
    }

    try {
      setIsProcessing(true);
      await inactivateMutation.mutateAsync({ ids: selectedUsers });
      toast.success(`Đã vô hiệu hóa ${selectedUsers.length} người dùng thành công`, {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        }
      });
      setSelectedUsers([]);
      queryClient.invalidateQueries({ queryKey: ["users/search"] });
    } catch (error) {
      toast.error("Không thể vô hiệu hóa người dùng", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        }
      });
      console.error("Error deactivating users:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Vui lòng chọn người dùng để xóa", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        }
      });
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedUsers.length} người dùng không?`)) return;

    try {
      setIsProcessing(true);
      await deleteMutation.mutateAsync({ ids: selectedUsers });
      toast.success(`Đã xóa ${selectedUsers.length} người dùng thành công`, {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        }
      });
      setSelectedUsers([]);
      queryClient.invalidateQueries({ queryKey: ["users/search"] });

      // If we deleted all items on a page, go to previous page
      if (selectedUsers.length === data?.data?.length && pageIndex > 1) {
        updateSearchParams({ pageIndex: pageIndex - 1 });
      }
    } catch (error) {
      toast.error("Không thể xóa người dùng", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        }
      });
      console.error("Error deleting users:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <AdminHeader />

      <main className="flex-grow p-6 px-48">
        {/* Search and filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400"/>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchInput}
              onChange={handleSearchChange}
              className="pl-10 py-2 px-4 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={getCurrentSortOption()}
            onChange={handleSortChange}
            className="py-2 px-4 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="nameAZ">Tên (A-Z)</option>
            <option value="nameZA">Tên (Z-A)</option>
          </select>

          <select
            value={status || 'ALL'}
            onChange={handleStatusChange}
            className="py-2 px-4 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="INACTIVE">Không hoạt động</option>
          </select>

          <select
            value={accountType || 'ALL'}
            onChange={handleAccountTypeChange}
            className="py-2 px-4 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Tất cả loại tài khoản</option>
            <option value="SYSTEM">Hệ thống</option>
            <option value="GOOGLE">Google</option>
            <option value="FACEBOOK">Facebook</option>
          </select>
        </div>

        {/* Bulk actions */}
        {selectedUsers.length > 0 && (
          <div className="bg-gray-800 p-3 rounded-lg mb-4 flex justify-between items-center">
            <div className="text-white">
              Đã chọn {selectedUsers.length} người dùng
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleBulkActivate}
                disabled={isProcessing}
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50"
              >
                Kích hoạt
              </button>
              <button
                onClick={handleBulkInactivate}
                disabled={isProcessing}
                className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 disabled:opacity-50"
              >
                Vô hiệu hóa
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={isProcessing}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:opacity-50"
              >
                Xóa
              </button>
            </div>
          </div>
        )}

        {/* User table */}
        {isLoading || isProcessing ? (
          <div className="flex justify-center py-10">
            <Loader/>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
                <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={data?.data?.length > 0 && selectedUsers.length === data?.data?.length}
                      onChange={handleSelectAll}
                      className="h-4 w-4 accent-blue-600 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-3 text-left">STT</th>
                  <th className="px-6 py-3 text-left"></th> {/* Avatar column */}
                  <th className="px-6 py-3 text-left">Tên đăng nhập</th>
                  <th className="px-6 py-3 text-left">Tên</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Số điện thoại</th>
                  <th className="px-6 py-3 text-center">Trạng thái</th>
                  <th className="px-6 py-3 text-center">Hành động</th>
                </tr>
                </thead>
                <tbody>
                {data?.data?.length > 0 ? (
                  data.data.map((user: any, index: number) => (
                    <tr key={user.id} className="border-b border-gray-700 text-gray-300">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="h-4 w-4 accent-blue-600 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">{(pageIndex - 1) * pageSize + index + 1}</td>
                      <td className="px-6 py-4">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.username}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
                            {user.username?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">{user.username || '-'}</td>
                      <td className="px-6 py-4">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : '-'}
                      </td>
                      <td className="px-6 py-4">{user.email || '-'}</td>
                      <td className="px-6 py-4">{user.phone || '-'}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={user.status === "ACTIVE"}
                              onChange={() => handleStatusToggle(user.id, user.status)}
                              disabled={isProcessing}
                              className="sr-only peer"
                            />
                            <div
                              className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                            ></div>
                          </label>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleOpenDetailDialog(user.id)}
                            className="px-2 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                            title="Xem chi tiết người dùng"
                          >
                            <FiEye/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-10 text-center text-gray-400">
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-gray-400">
                  Hiển thị {(pageIndex - 1) * pageSize + 1} - {Math.min(pageIndex * pageSize, data?.total || 0)} trên {data?.total} người dùng
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateSearchParams({ pageIndex: Math.max(1, pageIndex - 1) })}
                    disabled={pageIndex <= 1}
                    className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                  >
                    <FiArrowLeft/>
                  </button>

                  {/* Page numbers */}
                  <div className="flex space-x-1">
                    {/* First page */}
                    {pageIndex > 2 && (
                      <button
                        onClick={() => updateSearchParams({ pageIndex: 1 })}
                        className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                      >
                        1
                      </button>
                    )}

                    {/* Ellipsis */}
                    {pageIndex > 3 && (
                      <span className="px-3 py-1 text-gray-500">...</span>
                    )}

                    {/* Previous page */}
                    {pageIndex > 1 && (
                      <button
                        onClick={() => updateSearchParams({ pageIndex: pageIndex - 1 })}
                        className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                      >
                        {pageIndex - 1}
                      </button>
                    )}

                    {/* Current page */}
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg"
                      disabled
                    >
                      {pageIndex}
                    </button>

                    {/* Next page */}
                    {pageIndex < totalPages && (
                      <button
                        onClick={() => updateSearchParams({ pageIndex: pageIndex + 1 })}
                        className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                      >
                        {pageIndex + 1}
                      </button>
                    )}

                    {/* Ellipsis */}
                    {pageIndex < totalPages - 2 && (
                      <span className="px-3 py-1 text-gray-500">...</span>
                    )}

                    {/* Last page */}
                    {pageIndex < totalPages - 1 && (
                      <button
                        onClick={() => updateSearchParams({ pageIndex: totalPages })}
                        className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                      >
                        {totalPages}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => updateSearchParams({ pageIndex: Math.min(totalPages, pageIndex + 1) })}
                    disabled={pageIndex >= totalPages}
                    className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                  >
                    <FiArrowRight/>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* User Detail Dialog with Tabs */}
        <Dialog
          open={isDetailDialogOpen}
          onOpenChange={(open) => {
            setIsDetailDialogOpen(open);
            if (!open) setSelectedUserId(null);
          }}
        >
          <DialogContent className="bg-gray-800 border-gray-700 max-w-3xl w-full overflow-y-auto scrollbar-hide max-h-[calc(90vh-80px)] slide-in-from-right-1/2 slide-in-to-right-0 duration-300">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">Thông Tin Người Dùng</DialogTitle>
            </DialogHeader>

            <div className="p-4">
              {isLoadingUserDetail ? (
                <div className="flex justify-center py-6">
                  <Loader/>
                </div>
              ) : (
                <>
                  {/* Tabs */}
                  <div className="flex border-b border-gray-700 mb-4">
                    <button
                      className={`px-4 py-2 ${!isRolesTabActive ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
                      onClick={() => setIsRolesTabActive(false)}
                    >
                      Hồ sơ
                    </button>
                    <button
                      className={`px-4 py-2 ${isRolesTabActive ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
                      onClick={() => setIsRolesTabActive(true)}
                    >
                      Vai trò
                    </button>
                  </div>

                  {/* Profile Tab */}
                  {!isRolesTabActive && userDetailData?.data && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                      {/* User avatar */}
                      <div className="md:col-span-2 flex justify-center mb-4">
                        {userDetailData.data.avatarUrl ? (
                          <img
                            src={userDetailData.data.avatarUrl}
                            alt={userDetailData.data.username || "User"}
                            className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-2xl">
                            {userDetailData.data.username?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                      </div>

                      {/* User info */}
                      <div className="space-y-2">
                        <p className="text-gray-400">Tên đăng nhập</p>
                        <p className="font-medium">{userDetailData.data.username || '-'}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-gray-400">Email</p>
                        <p className="font-medium">{userDetailData.data.email || '-'}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-gray-400">Họ</p>
                        <p className="font-medium">{userDetailData.data.firstName || '-'}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-gray-400">Tên</p>
                        <p className="font-medium">{userDetailData.data.lastName || '-'}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-gray-400">Tên đệm</p>
                        <p className="font-medium">{userDetailData.data.middleName || '-'}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-gray-400">Ngày sinh</p>
                        <p className="font-medium">{formatDate(userDetailData.data.dateOfBirth) || '-'}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-gray-400">Số điện thoại</p>
                        <p className="font-medium">{userDetailData.data.phone || '-'}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-gray-400">Giới tính</p>
                        <p className="font-medium">{userDetailData.data.gender || '-'}</p>
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <p className="text-gray-400">Địa chỉ</p>
                        <p className="font-medium">{userDetailData.data.address || '-'}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-gray-400">Trạng thái</p>
                        <p className="font-medium">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            userDetailData.data.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {userDetailData.data.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-gray-400">Loại tài khoản</p>
                        <p className="font-medium">{userDetailData.data.accountType}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-gray-400">Ngày tạo</p>
                        <p className="font-medium">{new Date(userDetailData.data.createdAt).toLocaleString()}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-gray-400">Cập nhật lần cuối</p>
                        <p className="font-medium">{userDetailData.data.lastModifiedAt ? new Date(userDetailData.data.lastModifiedAt).toLocaleString() : '-'}</p>
                      </div>
                    </div>
                  )}

                  {/* Roles Tab */}
                  {isRolesTabActive && (
                    <div className="text-white">
                      {isLoadingUserRoles || availableRolesQuery.isLoading ? (
                        <div className="flex justify-center py-6">
                          <Loader/>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-3">
                            {availableRolesQuery.data?.data?.map((role: any) => (
                              <div key={role.id} className="flex items-center p-2 rounded hover:bg-gray-700">
                                <input
                                  type="checkbox"
                                  id={`role-${role.id}`}
                                  checked={selectedRoles.includes(role.id)}
                                  onChange={() => handleRoleToggle(role.id)}
                                  className="mr-2 h-5 w-5 rounded border-gray-700 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor={`role-${role.id}`} className="flex-1">
                                  <div className="font-medium">{role.name}</div>
                                  <div className="text-sm text-gray-400">{role.description || "No description"}</div>
                                </label>
                                <div>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    role.status === 'ACTIVE'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {role.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </div>
                            ))}

                            {!availableRolesQuery.data?.data?.length && (
                              <div className="text-center py-4 text-gray-400">
                                Không có vai trò nào khả dụng
                              </div>
                            )}
                          </div>

                          <div>
                            <button
                              onClick={handleSaveRoles}
                              disabled={isProcessing}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 flex items-center space-x-2"
                            >
                              Lưu vai trò
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between mt-8">
                    <div>
                      <button
                        onClick={() => handleDeleteUser(selectedUserId!)}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:opacity-50 flex items-center gap-2"
                      >
                        <FiTrash2 /> Xóa người dùng
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      {!isRolesTabActive && (
                        <button
                          onClick={() => setIsRolesTabActive(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 flex items-center gap-2"
                        >
                          <FiUsers /> Quản lý vai trò
                        </button>
                      )}
                      <button
                        onClick={() => setIsDetailDialogOpen(false)}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}
