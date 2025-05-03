import { FiArrowLeft, FiArrowRight, FiEdit, FiEye, FiPackage, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import Loader from "@components/common/Loader.tsx";
import { Link } from "@tanstack/react-router";
import {
  useActiveMyShopProductApi,
  useDeleteMyShopProductApi,
  useInactiveMyShopProductApi,
  useSearchProductsApi
} from "@apis/useProductApis.ts";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@components/ui/dialog";
import CreateProductForm from "@components/features/CreateProductForm.tsx";
import UpdateProductForm from "@components/features/UpdateProductForm.tsx";

interface ProductListProps {
  shopId: string;
  keyword: string;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  status?: "ACTIVE" | "INACTIVE";
  pageIndex: number;
  pageSize: number;
  onSearchChange: (params: {
    keyword?: string;
    pageIndex?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    status?: "ACTIVE" | "INACTIVE";
  }) => void;
}

function ProductList(
  {
    shopId,
    keyword,
    sortBy,
    sortOrder,
    status,
    pageIndex,
    pageSize,
    onSearchChange
  }: ProductListProps
) {
  const [searchInput, setSearchInput] = useState(keyword);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);

  // Query client for cache invalidation
  const queryClient = useQueryClient();

  // Fetch products data
  const {
    data,
    isLoading,
    error
  } = useSearchProductsApi({
    keyword,
    pageIndex,
    pageSize,
    sortBy,
    sortOrder,
    shopIds: [shopId],
    status
  });

  // API mutations
  const activeMutation = useActiveMyShopProductApi();
  const inactiveMutation = useInactiveMyShopProductApi();
  const deleteMutation = useDeleteMyShopProductApi();

  // Show error toast if query fails
  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể tải danh sách sản phẩm", {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss(),
          },
        }
      );
    }
  }, [error]);

  useEffect(() => {
    setSearchInput(keyword || '');
  }, [keyword]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    const timer = setTimeout(() => {
      onSearchChange({ keyword: value || undefined });
    }, 300);

    return () => clearTimeout(timer);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    switch (value) {
      case 'newest':
        onSearchChange({ sortBy: 'createdAt', sortOrder: 'DESC' });
        break;
      case 'priceAsc':
        onSearchChange({ sortBy: 'price', sortOrder: 'ASC' });
        break;
      case 'priceDesc':
        onSearchChange({ sortBy: 'price', sortOrder: 'DESC' });
        break;
      default:
        onSearchChange({ sortBy: 'createdAt', sortOrder: 'DESC' });
    }
  };

  const getCurrentSortOption = () => {
    if (sortBy === 'createdAt' && sortOrder === 'DESC') return 'newest';
    if (sortBy === 'price' && sortOrder === 'ASC') return 'priceAsc';
    if (sortBy === 'price' && sortOrder === 'DESC') return 'priceDesc';
    return 'newest';
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "ACTIVE" | "INACTIVE" | "ALL";
    onSearchChange({ status: value === "ALL" ? undefined : value });
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === (data?.data?.length || 0)) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(data?.data?.map(product => product.id) || []);
    }
  };

  const handleStatusToggle = async (productId: string, currentStatus: "ACTIVE" | "INACTIVE") => {
    try {
      setIsProcessing(true);

      if (currentStatus === "ACTIVE") {
        await inactiveMutation.mutateAsync({ ids: [productId] });
        toast.success("Đã ngừng hoạt động sản phẩm", {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss(),
          },
        });
      } else {
        await activeMutation.mutateAsync({ ids: [productId] });
        toast.success("Đã kích hoạt sản phẩm", {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss(),
          },
        });
      }

      // Invalidate product search query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["product/search"] });
    } catch (error) {
      toast.error("Không thể thay đổi trạng thái sản phẩm. Vui lòng thử lại sau.", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });
      console.error("Error toggling product status:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        setIsProcessing(true);
        await deleteMutation.mutateAsync({ ids: [productId] });
        toast.success("Đã xóa sản phẩm thành công", {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss(),
          },
        });

        // Invalidate product search query to refresh the list
        queryClient.invalidateQueries({ queryKey: ["product/search"] });

        // If we're on the last page and there's only one product, go to previous page
        if ((data?.data?.length || 0) === 1 && pageIndex > 0) {
          onSearchChange({ pageIndex: pageIndex - 1 });
        }
      } catch (error) {
        toast.error("Không thể xóa sản phẩm. Vui lòng thử lại sau.", {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss(),
          },
        });
        console.error("Error deleting product:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleEditProduct = (productId: string) => {
    setEditProductId(productId);
    setIsUpdateDialogOpen(true);
  };

  const handleBulkActivate = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Vui lòng chọn sản phẩm", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });
      return;
    }

    try {
      setIsProcessing(true);
      await activeMutation.mutateAsync({ ids: selectedProducts });
      toast.success(`Đã kích hoạt ${selectedProducts.length} sản phẩm`, {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });

      // Clear selection and refresh data
      setSelectedProducts([]);
      queryClient.invalidateQueries({ queryKey: ["product/search"] });
    } catch (error) {
      toast.error("Không thể kích hoạt sản phẩm. Vui lòng thử lại sau.", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });
      console.error("Error activating products:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Vui lòng chọn sản phẩm", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });
      return;
    }

    try {
      setIsProcessing(true);
      await inactiveMutation.mutateAsync({ ids: selectedProducts });
      toast.success(`Đã ngừng hoạt động ${selectedProducts.length} sản phẩm`, {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });

      // Clear selection and refresh data
      setSelectedProducts([]);
      queryClient.invalidateQueries({ queryKey: ["product/search"] });
    } catch (error) {
      toast.error("Không thể ngừng hoạt động sản phẩm. Vui lòng thử lại sau.", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });
      console.error("Error deactivating products:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Vui lòng chọn sản phẩm", {
        cancel: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedProducts.length} sản phẩm đã chọn không?`)) {
      try {
        setIsProcessing(true);
        await deleteMutation.mutateAsync({ ids: selectedProducts });
        toast.success(`Đã xóa ${selectedProducts.length} sản phẩm`, {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss(),
          },
        });

        // Clear selection and refresh data
        setSelectedProducts([]);
        queryClient.invalidateQueries({ queryKey: ["product/search"] });

        // If we deleted all products on the current page, go to previous page
        if (selectedProducts.length === (data?.data?.length || 0) && pageIndex > 0) {
          onSearchChange({ pageIndex: pageIndex - 1 });
        }
      } catch (error) {
        toast.error("Không thể xóa sản phẩm. Vui lòng thử lại sau.", {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss(),
          },
        });
        console.error("Error deleting products:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-500"/>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchInput}
              onChange={handleSearchChange}
              className="pl-10 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>
          <select
            value={getCurrentSortOption()}
            onChange={handleSortChange}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            <option value="newest">Mới nhất</option>
            <option value="priceAsc">Giá sản phẩm tăng dần</option>
            <option value="priceDesc">Giá sản phẩm giảm dần</option>
          </select>
          <select
            value={status || "ALL"}
            onChange={handleStatusChange}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="INACTIVE">Ngừng hoạt động</option>
          </select>
        </div>
        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="h-[38px] flex items-center px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          <FiPackage className="mr-1"/>
          <FiPlus/>
        </button>
      </div>

      {/* Bulk actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-gray-800 p-3 rounded-lg mb-4 flex justify-between items-center">
          <div className="text-white">
            Đã chọn {selectedProducts.length} sản phẩm
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
              onClick={handleBulkDeactivate}
              disabled={isProcessing}
              className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 disabled:opacity-50"
            >
              Ngừng hoạt động
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
                    checked={data?.data?.length > 0 && selectedProducts.length === data?.data?.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 accent-blue-600 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left"></th>
                <th className="px-6 py-3 text-left">Tên sản phẩm</th>
                <th className="px-6 py-3 text-left">Giá</th>
                <th className="px-6 py-3 text-left">Số lượng</th>
                <th className="px-6 py-3 text-center">Hoạt động</th>
                <th className="px-6 py-3 text-center">Hành động</th>
              </tr>
              </thead>
              <tbody>
              {data?.data?.length > 0 ? (
                data.data.map((product, index) => (
                  <tr key={product.id} className="border-b border-gray-700 text-gray-300">
                    <td className="px-6 py-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="h-4 w-4 accent-blue-600 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-3">{pageIndex * pageSize + index + 1}</td>
                    <td className="px-6 py-3">
                      <img
                        src={product.imageUrl || "https://via.placeholder.com/50"}
                        alt={product.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-6 py-3">{product.name}</td>
                    <td className="px-6 py-3">₫{product.price.toLocaleString()}</td>
                    <td className="px-6 py-3">{product.amount}</td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex justify-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={product.status === "ACTIVE"}
                            onChange={() => handleStatusToggle(product.id, product.status)}
                            disabled={isProcessing}
                            className="sr-only peer"
                          />
                          <div
                            className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <Link
                          to="/products/$productId"
                          params={{ productId: product.id }}
                        >
                          <button className="px-2 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                            <FiEye/>
                          </button>
                        </Link>
                        <button
                          onClick={() => handleEditProduct(product.id)}
                          className="px-2 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                        >
                          <FiEdit/>
                        </button>
                        <button
                          className="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-500"
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={isProcessing}
                        >
                          <FiTrash2/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-400">
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {(data?.total || 0) > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-gray-400">
                Hiển thị {pageIndex * pageSize + 1} - {Math.min((pageIndex + 1) * pageSize, data?.total || 0)} trên {data?.total || 0} sản phẩm
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSearchChange({ pageIndex: Math.max(0, pageIndex - 1) })}
                  disabled={pageIndex === 0}
                  className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiArrowLeft/>
                </button>
                {/* Page numbers */}
                {(data?.total || 0) > pageSize && (
                  <div className="flex space-x-1">
                    {/* Always show first page */}
                    {pageIndex > 1 && (
                      <button
                        onClick={() => onSearchChange({ pageIndex: 0 })}
                        className={`px-3 py-1 rounded-lg ${pageIndex === 0
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                      >
                        1
                      </button>
                    )}

                    {/* Show ellipsis if needed */}
                    {pageIndex > 2 && (
                      <span className="px-3 py-1 text-gray-400">...</span>
                    )}

                    {/* Show current page and neighbors */}
                    {Array.from({ length: Math.min(3, Math.ceil((data?.total || 0) / pageSize)) }).map((_, i) => {
                      const pageNum = pageIndex > 1
                        ? pageIndex - 1 + i
                        : i;

                      // Skip if the page would be out of range
                      if (pageNum < 0 || pageNum >= Math.ceil((data?.total || 0) / pageSize)) {
                        return null;
                      }

                      // Skip if we're showing the first or last page separately
                      if ((pageIndex > 1 && pageNum === 0) ||
                        (pageNum === Math.ceil((data?.total || 0) / pageSize) - 1 &&
                          pageIndex < Math.ceil((data?.total || 0) / pageSize) - 2)) {
                        return null;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => onSearchChange({ pageIndex: pageNum })}
                          className={`px-3 py-1 rounded-lg ${pageIndex === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    })}

                    {/* Show ellipsis if needed */}
                    {pageIndex < Math.ceil((data?.total || 0) / pageSize) - 3 && (
                      <span className="px-3 py-1 text-gray-400">...</span>
                    )}

                    {/* Always show last page */}
                    {pageIndex < Math.ceil((data?.total || 0) / pageSize) - 2 && (
                      <button
                        onClick={() => onSearchChange({ pageIndex: Math.ceil((data?.total || 0) / pageSize) - 1 })}
                        className={`px-3 py-1 rounded-lg ${pageIndex === Math.ceil((data?.total || 0) / pageSize) - 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                      >
                        {Math.ceil((data?.total || 0) / pageSize)}
                      </button>
                    )}
                  </div>
                )}
                <button
                  onClick={() => onSearchChange({ pageIndex: pageIndex + 1 })}
                  disabled={(pageIndex + 1) * pageSize >= (data?.total || 0)}
                  className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiArrowRight/>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add product dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <div className="overflow-y-auto scrollbar-hide max-h-[calc(90vh-80px)]">
            <CreateProductForm
              onClose={() => setIsCreateDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Update product dialog */}
      <Dialog
        open={isUpdateDialogOpen}
        onOpenChange={(open) => {
          setIsUpdateDialogOpen(open);
          if (!open) setEditProductId(null);
        }}
      >
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <div className="overflow-y-auto scrollbar-hide max-h-[calc(90vh-80px)]">
            {editProductId && (
              <UpdateProductForm
                productId={editProductId}
                onClose={() => setIsUpdateDialogOpen(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProductList;
