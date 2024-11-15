import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MdClose, MdEmail, MdLock, MdKey, MdInfo } from "react-icons/md";
import { forgotPassword } from "../../service/forgotPass";
import { toast } from "react-toastify";

export default function ModalForgot({ onClose }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [codeConfirm, setCodeConfirm] = useState(0);
  const [countDown, setCountDown] = useState(30);

  useEffect(() => {
    let timer;
    if (countDown > 0) {
      timer = setTimeout(() => setCountDown(countDown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countDown]);

  const handleSubmitEmail = async (e) => {
    toast.dismiss();
    e.preventDefault();
    setIsLoading(true);
    const result = await forgotPassword(email);
    if (result.ok) {
      setStep(2);
      setCodeConfirm(result.reset_code);
      setCountDown(30);
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (countDown === 0) {
      toast.error("Mã xác nhận đã hết hạn");
      return;
    }
    setIsLoading(true);
    if (code === codeConfirm) {
      setIsLoading(false);
      setStep(3);
    } else {
      toast.error("Mã xác nhận không đúng");
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onClose(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full h-full md:h-auto md:max-w-[400px] flex items-center">
        <div className="relative bg-white w-full h-full md:h-auto md:rounded-xl shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-xl font-medium text-gray-900">Quên mật khẩu</h2>
            <button
              onClick={() => onClose(false)}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MdClose className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Step 1: Enter Email */}
            {step === 1 && (
              <form onSubmit={handleSubmitEmail} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      placeholder="Nhập email của bạn"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-500 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-base"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    "Gửi mã xác nhận"
                  )}
                </button>
                <div className="flex items-start gap-2 mt-3">
                  <MdInfo className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-500">
                    Mã xác nhận sẽ được gửi đến email của bạn
                  </p>
                </div>
              </form>
            )}

            {/* Step 2: Enter Code */}
            {step === 2 && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    Mã xác nhận
                  </label>
                  <div className="relative">
                    <MdKey className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      placeholder="Nhập mã từ email"
                      required
                    />
                  </div>
                  <div className="text-center mt-3">
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:underline disabled:opacity-50 disabled:no-underline"
                      onClick={handleSubmitEmail}
                      disabled={countDown > 0}
                    >
                      Gửi lại {countDown > 0 ? `(${countDown}s)` : ""}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-500 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-base"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang xác thực...
                    </>
                  ) : (
                    "Xác nhận"
                  )}
                </button>
                <div className="flex items-start gap-2">
                  <MdInfo className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-500">
                    Vui lòng kiểm tra email để lấy mã xác nhận
                  </p>
                </div>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      placeholder="Nhập mật khẩu mới"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      placeholder="Nhập lại mật khẩu mới"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-500 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-base"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    "Cập nhật mật khẩu"
                  )}
                </button>
                <div className="flex items-start gap-2">
                  <MdInfo className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-500">
                    Mật khẩu mới phải có ít nhất 8 ký tự
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

ModalForgot.propTypes = {
  onClose: PropTypes.func.isRequired,
  isForgotModalOpen: PropTypes.bool.isRequired,
};