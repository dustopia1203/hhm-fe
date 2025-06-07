import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from "react";
import { useForgotPasswordApi, useVerifyOtpApi, useResetPasswordApi } from "@apis/useAccountApis.ts";
import { toast } from "sonner";
import * as React from "react";

function ForgotPasswordForm() {
  const [code, setCode] = useState(Array(6).fill(''));
  const [credential, setCredential] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const navigate = useNavigate();
  const mutationForgotPassword = useForgotPasswordApi();
  const mutationVerifyOtp = useVerifyOtpApi();
  const mutationResetPassword = useResetPasswordApi();

  const handleInputChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) { // Allow only digits
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credential) {
      toast.error(
        "Vui lòng nhập email hoặc tên đăng nhập",
        {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss(),
          },
        }
      );
      return;
    }

    try {
      const responseData = await mutationForgotPassword.mutateAsync({
        credential
      });

      if (responseData) {
        toast.success(
          "Mã xác nhận đã được gửi đến email của bạn",
          {
            cancel: {
              label: "X",
              onClick: () => toast.dismiss
            }
          }
        );
        setIsCodeSent(true);
        localStorage.setItem("current_credential", JSON.stringify({ credential }));
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
        {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss
          }
        }
      );
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    const activationCode = code.join('');

    if (activationCode.length !== 6) {
      toast.error(
        "Vui lòng nhập đầy đủ mã xác nhận", {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss(),
          },
        }
      );
      return;
    }

    try {
      const responseData = await mutationVerifyOtp.mutateAsync({
        credential,
        activationCode
      });

      if (responseData) {
        toast.success(
          "Xác thực thành công",
          {
            cancel: {
              label: "X",
              onClick: () => toast.dismiss
            }
          }
        );
        setIsOtpVerified(true);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
        {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss
          }
        }
      );
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error(
        "Vui lòng nhập đầy đủ mật khẩu mới",
        {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss(),
          },
        }
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        "Mật khẩu xác nhận không khớp",
        {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss(),
          },
        }
      );
      return;
    }

    try {
      const responseData = await mutationResetPassword.mutateAsync({
        credential,
        newPassword
      });

      if (responseData) {
        toast.success(
          "Đặt lại mật khẩu thành công",
          {
            cancel: {
              label: "X",
              onClick: () => toast.dismiss
            }
          }
        );

        setTimeout(() => navigate({ to: "/login" }), 500);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
        {
          cancel: {
            label: "X",
            onClick: () => toast.dismiss
          }
        }
      );
    }
  };

  return (
    <>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Quên mật khẩu</h2>
        <p className="text-center mb-6 text-gray-400">Chào mừng đến với HHMShop</p>
        
        {!isCodeSent ? (
          <form onSubmit={handleSendCode}>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2" htmlFor="credential">
                Email hoặc tên đăng nhập
              </label>
              <input
                type="text"
                id="credential"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div className="mb-4">
              <button
                type="submit"
                className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
                Gửi mã xác nhận
              </button>
            </div>
          </form>
        ) : !isOtpVerified ? (
          <form onSubmit={handleVerifyCode}>
            <p className="text-center mb-6 text-gray-400">Mã xác nhận đã được gửi đến email của bạn</p>
            <div className="flex justify-center space-x-2 mb-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="w-12 h-12 text-center border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              ))}
            </div>
            <div className="mb-4">
              <button
                type="submit"
                className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
                Xác nhận
              </button>
            </div>
            <div className="border-t border-gray-600 my-4"></div>
            <div className="text-center mb-4 text-gray-400">Không nhận được mã xác nhận?</div>
            <div className="mb-4">
              <button
                type="button"
                onClick={handleSendCode}
                className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
                Gửi lại
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2" htmlFor="newPassword">
                Mật khẩu mới
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2" htmlFor="confirmPassword">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div className="mb-4">
              <button
                type="submit"
                className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
                Đặt lại mật khẩu
              </button>
            </div>
          </form>
        )}
        
        <div className="text-center">
          <span className="text-gray-400">Đã có tài khoản?</span>
          <Link to="/login" className="text-gray-500 hover:underline ml-2">
            Đăng nhập
          </Link>
        </div>
      </div>
    </>
  )
}

export default ForgotPasswordForm;
