import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";
import { useVerifyEmail, useResendEmailOtp } from "../services/authApi";
import { useToast } from "../contexts/ToastContext";
import { AuthLayout } from "../features/auth/layouts/AuthLayout";

export function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");

  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendEmailOtp();

  // ✅ Guard to prevent multiple auto-sends
  const hasAutoSentRef = useRef(false);

  /**
   * Auto-send OTP once when page loads
   * (for direct navigation / refresh / login redirect)
   */
  useEffect(() => {
    if (!email || hasAutoSentRef.current) return;

    hasAutoSentRef.current = true;

    resendMutation
      .mutateAsync(email)
      .then(() => {
        addToast({
          type: "info",
          title: "OTP Sent",
          message: "We’ve sent a verification code to your email.",
        });
      })
      .catch((err) => {
        if (err.status === 429) {
          addToast({
            type: "warning",
            title: "Please wait",
            message: "OTP was sent recently. Try again shortly.",
          });
        }
      });
  }, [email]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      addToast({
        type: "error",
        title: "Missing fields",
        message: "Email and OTP are required.",
      });
      return;
    }

    try {
      const data = await verifyMutation.mutateAsync({ email, otp });

      dispatch(loginSuccess(data));

      addToast({
        type: "success",
        title: "Email Verified",
        message: "Your email has been verified successfully.",
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err.status === 429) {
        addToast({
          type: "warning",
          title: "Too many attempts",
          message: "Please wait before trying again.",
          autoHide: false,
        });
        return;
      }

      addToast({
        type: "error",
        title: "Verification Failed",
        message: err.message || "Invalid or expired OTP.",
      });
    }
  };

  const handleResend = async () => {
    if (!email) return;

    try {
      await resendMutation.mutateAsync(email);

      addToast({
        type: "success",
        title: "OTP Sent",
        message: "A new OTP has been sent to your email.",
      });
    } catch (err) {
      if (err.status === 429) {
        addToast({
          type: "warning",
          title: "Slow down",
          message: "Too many requests. Please wait a few minutes.",
          autoHide: false,
        });
        return;
      }

      addToast({
        type: "error",
        title: "Failed",
        message: "Could not resend OTP. Try again later.",
      });
    }
  };

  return (
    <AuthLayout
      title="Verify Identity"
      subtitle="Enter the 6-digit code sent to your mail"
    >
      <form
        onSubmit={handleVerify}
        className="space-y-10 py-2"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
              Account Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field bg-gray-50/50 dark:bg-gray-800/20"
              placeholder="name@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
              One-Time Passcode
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input-field text-center tracking-[0.5em] text-3xl font-black py-6 bg-primary-50/30 dark:bg-primary-900/10 border-primary-100 dark:border-primary-900/50 placeholder:tracking-normal placeholder:font-medium placeholder:text-lg"
              placeholder="000000"
              maxLength={6}
              required
            />
            <p className="text-[10px] font-medium text-gray-400 text-center mt-2 px-6">
              Didn't receive it? Check your spam folder or request a new one below.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={verifyMutation.isPending}
            className="w-full btn-primary py-4 text-xl font-black rounded-2xl shadow-2xl shadow-primary-500/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {verifyMutation.isPending ? "Validating..." : "Confirm Access"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resendMutation.isPending}
            className="w-full py-4 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {resendMutation.isPending ? "Resending..." : "New Code Required"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
