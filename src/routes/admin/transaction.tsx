import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import { FiSearch, FiArrowLeft, FiArrowRight, FiCalendar } from "react-icons/fi";
import AdminHeader from '@components/features/AdminHeader';
import Footer from '@components/features/Footer';
import Loader from '@components/common/Loader';
import { useSearchTransactionsApi, TransactionStatus, TransactionType, PaymentMethod } from '@apis/useTransactionApis';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/transaction')({
  component: TransactionManagement,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      keyword: search.keyword as string | undefined,
      pageIndex: Number(search.pageIndex || 1),
      pageSize: Number(search.pageSize || 10),
      sortBy: (search.sortBy as string) || 'createdAt',
      sortOrder: (search.sortOrder as 'ASC' | 'DESC') || 'DESC',
      transactionStatus: search.transactionStatus as TransactionStatus | undefined,
      transactionType: search.transactionType as TransactionType | undefined,
      paymentMethod: search.paymentMethod as PaymentMethod | undefined,
      startDate: search.startDate as string | undefined,
      endDate: search.endDate as string | undefined,
    };
  },
})

function TransactionManagement() {
  // Get search params from router
  const {
    keyword,
    pageIndex = 1,
    pageSize = 10,
    sortBy = 'createdAt',
    sortOrder = 'DESC',
    transactionStatus,
    transactionType,
    paymentMethod,
    startDate,
    endDate
  } = Route.useSearch();

  // Get the navigation function for search params
  const navigate = Route.useNavigate();

  // UI state
  const [searchInput, setSearchInput] = useState(keyword);
  const [startDateInput, setStartDateInput] = useState(startDate || '');
  const [endDateInput, setEndDateInput] = useState(endDate || '');

  // API calls
  const {
    data,
    isLoading,
    error
  } = useSearchTransactionsApi({
    keyword,
    pageIndex,
    pageSize,
    sortBy,
    sortOrder,
    transactionStatuses: transactionStatus ? [transactionStatus] : undefined,
    transactionTypes: transactionType ? [transactionType] : undefined,
    paymentMethods: paymentMethod ? [paymentMethod] : undefined,
    startDate: startDate ? new Date(startDate).getTime() : undefined,
    endDate: endDate ? new Date(endDate).getTime() : undefined
  });

  // Update search input when keyword changes
  useEffect(() => {
    setSearchInput(keyword || '');
  }, [keyword]);

  // Update date inputs when URL params change
  useEffect(() => {
    setStartDateInput(startDate || '');
    setEndDateInput(endDate || '');
  }, [startDate, endDate]);

  // Show error toast if query fails
  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể tải danh sách giao dịch", {
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

  // Handle start date change
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartDateInput(value);

    updateSearchParams({
      startDate: value || undefined,
      pageIndex: 1
    });
  };

  // Handle end date change
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndDateInput(value);

    updateSearchParams({
      endDate: value || undefined,
      pageIndex: 1
    });
  };

  // Clear date filters
  const handleClearDates = () => {
    setStartDateInput('');
    setEndDateInput('');

    updateSearchParams({
      startDate: undefined,
      endDate: undefined,
      pageIndex: 1
    });
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
      case 'amountHighToLow':
        updateSearchParams({ sortBy: 'amount', sortOrder: 'DESC' });
        break;
      case 'amountLowToHigh':
        updateSearchParams({ sortBy: 'amount', sortOrder: 'ASC' });
        break;
      default:
        updateSearchParams({ sortBy: 'createdAt', sortOrder: 'DESC' });
    }
  };

  // Get current sort option for the select element
  const getCurrentSortOption = () => {
    if (sortBy === 'createdAt' && sortOrder === 'DESC') return 'newest';
    if (sortBy === 'createdAt' && sortOrder === 'ASC') return 'oldest';
    if (sortBy === 'amount' && sortOrder === 'DESC') return 'amountHighToLow';
    if (sortBy === 'amount' && sortOrder === 'ASC') return 'amountLowToHigh';
    return 'newest';
  };

  // Handle status filter change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as TransactionStatus | 'ALL';
    updateSearchParams({
      transactionStatus: value === 'ALL' ? undefined : value,
      pageIndex: 1 // Reset to first page on filter change
    });
  };

  // Handle transaction type filter change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as TransactionType | 'ALL';
    updateSearchParams({
      transactionType: value === 'ALL' ? undefined : value,
      pageIndex: 1 // Reset to first page on filter change
    });
  };

  // Handle payment method filter change
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as PaymentMethod | 'ALL';
    updateSearchParams({
      paymentMethod: value === 'ALL' ? undefined : value,
      pageIndex: 1 // Reset to first page on filter change
    });
  };

  // Calculate total pages
  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  // Format amount helper with currency
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Get status color based on transaction status
  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case TransactionStatus.DONE:
        return 'bg-green-100 text-green-800';
      case TransactionStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case TransactionStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get transaction type color and symbol
  const getTransactionTypeInfo = (type: TransactionType) => {
    switch (type) {
      case TransactionType.IN:
        return {
          color: 'text-green-600',
          symbol: '+'
        };
      case TransactionType.OUT:
        return {
          color: 'text-red-600',
          symbol: '-'
        };
      default:
        return {
          color: 'text-gray-600',
          symbol: ''
        };
    }
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
              placeholder="Tìm kiếm giao dịch..."
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
            <option value="amountHighToLow">Số tiền (cao-thấp)</option>
            <option value="amountLowToHigh">Số tiền (thấp-cao)</option>
          </select>

          <select
            value={transactionStatus || 'ALL'}
            onChange={handleStatusChange}
            className="py-2 px-4 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value={TransactionStatus.PENDING}>Đang xử lý</option>
            <option value={TransactionStatus.DONE}>Hoàn thành</option>
            <option value={TransactionStatus.FAILED}>Thất bại</option>
            <option value={TransactionStatus.CANCELLED}>Đã hủy</option>
          </select>

          <select
            value={transactionType || 'ALL'}
            onChange={handleTypeChange}
            className="py-2 px-4 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Tất cả loại giao dịch</option>
            <option value={TransactionType.IN}>Tiền vào</option>
            <option value={TransactionType.OUT}>Tiền ra</option>
          </select>

          <select
            value={paymentMethod || 'ALL'}
            onChange={handlePaymentMethodChange}
            className="py-2 px-4 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Tất cả phương thức</option>
            <option value={PaymentMethod.CASH}>Tiền mặt</option>
            <option value={PaymentMethod.VN_PAY}>VN Pay</option>
            <option value={PaymentMethod.PAY_PAL}>PayPal</option>
            <option value={PaymentMethod.CRYPTO}>Crypto</option>
          </select>
        </div>

        {/* Date range filters */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="text-white flex items-center">
            <FiCalendar className="mr-2" />
            <span>Khoảng thời gian:</span>
          </div>

          <div className="relative">
            <input
              type="date"
              placeholder="Từ ngày"
              value={startDateInput}
              onChange={handleStartDateChange}
              className="py-2 px-4 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-gray-400">đến</div>

          <div className="relative">
            <input
              type="date"
              placeholder="Đến ngày"
              value={endDateInput}
              onChange={handleEndDateChange}
              className="py-2 px-4 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {(startDateInput || endDateInput) && (
            <button
              onClick={handleClearDates}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Xóa bộ lọc ngày
            </button>
          )}
        </div>

        {/* Transaction table */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader/>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
                <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="px-6 py-3 text-left">STT</th>
                  <th className="px-6 py-3 text-left">Người dùng</th>
                  <th className="px-6 py-3 text-right">Số tiền</th>
                  <th className="px-6 py-3 text-left">Phương thức</th>
                  <th className="px-6 py-3 text-center">Trạng thái</th>
                  <th className="px-6 py-3 text-left">Loại GD</th>
                  <th className="px-6 py-3 text-left">Tham chiếu</th>
                  <th className="px-6 py-3 text-left">Ngày tạo</th>
                </tr>
                </thead>
                <tbody>
                {data?.data?.length > 0 ? (
                  data.data.map((transaction: any, index: number) => {
                    const typeInfo = getTransactionTypeInfo(transaction.transactionType);

                    return (
                      <tr key={transaction.id} className="border-b border-gray-700 text-gray-300">
                        <td className="px-6 py-4">{(pageIndex - 1) * pageSize + index + 1}</td>
                        <td className="px-6 py-4">{transaction.username || '-'}</td>
                        <td className={`px-6 py-4 text-right ${typeInfo.color} font-medium`}>
                          {typeInfo.symbol}{formatAmount(transaction.amount)}
                        </td>
                        <td className="px-6 py-4">
                          {transaction.paymentMethod === PaymentMethod.CASH && "Tiền mặt"}
                          {transaction.paymentMethod === PaymentMethod.VN_PAY && "VN Pay"}
                          {transaction.paymentMethod === PaymentMethod.PAY_PAL && "PayPal"}
                          {transaction.paymentMethod === PaymentMethod.CRYPTO && "Crypto"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.transactionStatus)}`}>
                            {transaction.transactionStatus === TransactionStatus.PENDING && "Đang xử lý"}
                            {transaction.transactionStatus === TransactionStatus.DONE && "Hoàn thành"}
                            {transaction.transactionStatus === TransactionStatus.FAILED && "Thất bại"}
                            {transaction.transactionStatus === TransactionStatus.CANCELLED && "Đã hủy"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {transaction.transactionType === TransactionType.IN && "Tiền vào"}
                          {transaction.transactionType === TransactionType.OUT && "Tiền ra"}
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate" title={transaction.referenceContext}>
                          {transaction.referenceContext || '-'}
                        </td>
                        <td className="px-6 py-4">{formatDate(transaction.createdAt)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-gray-400">
                      Không tìm thấy giao dịch nào
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
                  Hiển thị {(pageIndex - 1) * pageSize + 1} - {Math.min(pageIndex * pageSize, data?.total || 0)} trên {data?.total} giao dịch
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
      </main>

      <Footer />
    </div>
  );
}
