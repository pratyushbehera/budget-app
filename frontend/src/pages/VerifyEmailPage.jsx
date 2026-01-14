import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";
import { useVerifyEmail, useResendEmailOtp } from "../services/authApi";
import { useNotification } from "../contexts/NotificationContext";
import { AuthLayout } from "../features/auth/layouts/AuthLayout";

export function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addNotification } = useNotification();

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
        addNotification({
          type: "info",
          title: "OTP Sent",
          message: "We’ve sent a verification code to your email.",
        });
      })
      .catch((err) => {
        if (err.status === 429) {
          addNotification({
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
      addNotification({
        type: "error",
        title: "Missing fields",
        message: "Email and OTP are required.",
      });
      return;
    }

    try {
      const data = await verifyMutation.mutateAsync({ email, otp });

      dispatch(loginSuccess(data));

      addNotification({
        type: "success",
        title: "Email Verified",
        message: "Your email has been verified successfully.",
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err.status === 429) {
        addNotification({
          type: "warning",
          title: "Too many attempts",
          message: "Please wait before trying again.",
          autoHide: false,
        });
        return;
      }

      addNotification({
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

      addNotification({
        type: "success",
        title: "OTP Sent",
        message: "A new OTP has been sent to your email.",
      });
    } catch (err) {
      if (err.status === 429) {
        addNotification({
          type: "warning",
          title: "Slow down",
          message: "Too many requests. Please wait a few minutes.",
          autoHide: false,
        });
        return;
      }

      addNotification({
        type: "error",
        title: "Failed",
        message: "Could not resend OTP. Try again later.",
      });
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Enter the 6-digit OTP sent to your email"
    >
      <form
        onSubmit={handleVerify}
        className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 space-y-4"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          placeholder="Email address"
          required
        />

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="input-field text-center tracking-widest"
          placeholder="Enter OTP"
          maxLength={6}
          required
        />

        <button
          type="submit"
          disabled={verifyMutation.isPending}
          className="w-full btn-primary py-3 disabled:opacity-50"
        >
          {verifyMutation.isPending ? "Verifying..." : "Verify Email"}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resendMutation.isPending}
          className="w-full btn-secondary"
        >
          {resendMutation.isPending ? "Resending..." : "Resend OTP"}
        </button>
      </form>
    </AuthLayout>
  );
}
