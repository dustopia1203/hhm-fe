import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/payment/vnpay-callback')({
  component: RouteComponent,
})

function RouteComponent() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Process the payment response
    const processPaymentResponse = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const responseCode = urlParams.get('vnp_ResponseCode');

        // Check if payment was successful
        if (responseCode === '00') {
          // Extract payment information
          const txnRef = urlParams.get('vnp_TxnRef');
          const transactionNo = urlParams.get('vnp_TransactionNo');
          const amount = urlParams.get('vnp_Amount');
          const bankCode = urlParams.get('vnp_BankCode');
          const orderInfo = urlParams.get('vnp_OrderInfo');
          const payDate = urlParams.get('vnp_PayDate');

          // Post message to parent window
          if (window.opener) {
            window.opener.postMessage({
              success: true,
              vnp_TxnRef: txnRef,
              vnp_TransactionNo: transactionNo,
              vnp_Amount: amount,
              vnp_BankCode: bankCode,
              vnp_OrderInfo: orderInfo,
              vnp_PayDate: payDate
            }, "*");

            setStatus('success');

            // Close window after a short delay
            setTimeout(() => {
              window.close();
            }, 2000);
          } else {
            setStatus('error');
            setErrorMessage('Không thể gửi thông tin thanh toán. Vui lòng đóng cửa sổ này và thử lại.');
          }
        } else {
          // Payment failed
          const errorCode = responseCode || 'unknown';
          const errorMsg = getErrorMessageFromCode(errorCode);

          if (window.opener) {
            window.opener.postMessage({
              success: false,
              errorCode,
              errorMessage: errorMsg
            }, "*");
          }

          setStatus('error');
          setErrorMessage(`Thanh toán thất bại: ${errorMsg}`);
        }
      } catch (error) {
        console.error('Error processing payment response:', error);
        setStatus('error');
        setErrorMessage('Đã xảy ra lỗi khi xử lý kết quả thanh toán');
      }
    };

    processPaymentResponse();
  }, []);

  // Helper function to get error message from VNPAY response code
  const getErrorMessageFromCode = (code: string): string => {
    const errorMessages: Record<string, string> = {
      '01': 'Giao dịch đã tồn tại',
      '02': 'Merchant không hợp lệ',
      '03': 'Dữ liệu gửi sang không đúng định dạng',
      '04': 'Khởi tạo GD không thành công do Website đang bị tạm khóa',
      '05': 'Giao dịch không thành công do: Quý khách nhập sai mật khẩu quá số lần quy định',
      '06': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày',
      '75': 'Ngân hàng thanh toán đang bảo trì',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định',
      '99': 'Các lỗi khác',
    };

    return errorMessages[code] || 'Lỗi không xác định';
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 shadow-lg">
        {status === 'processing' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
            <h2 className="text-xl font-bold text-white mt-4">Đang xử lý thanh toán</h2>
            <p className="text-gray-400 mt-2">Vui lòng không đóng cửa sổ này...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="bg-green-500/20 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mt-4">Thanh toán thành công</h2>
            <p className="text-gray-400 mt-2">Cửa sổ này sẽ tự động đóng.</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="bg-red-500/20 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mt-4">Thanh toán thất bại</h2>
            <p className="text-gray-400 mt-2">{errorMessage}</p>
            <button
              onClick={() => window.close()}
              className="mt-6 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Đóng cửa sổ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
