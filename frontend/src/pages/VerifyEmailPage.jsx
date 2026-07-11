import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";
import { useVerifyEmail, useResendEmailOtp } from "../services/authApi";
import { useToast } from "../contexts/ToastContext";
import { AuthLayout } from "../features/auth/layouts/AuthLayout";
import Button from "@/shared/system/Button";
import Input from "@/shared/system/FormField/Input";

export default function VerifyEmailPage() {
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
      <form onSubmit={handleVerify} className="space-y-10 py-2">
        <Input
          label="Email"
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="One-Time Passcode"
          id="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="text-center tracking-[0.5em] text-3xl py-6 placeholder:tracking-[0.5em] placeholder:font-large placeholder:text-3xl"
          placeholder="000000"
          maxLength={6}
          required
          helperText="Didn't receive it? Check your spam folder or request a new
              one below."
        />

        <div className="space-y-4">
          <Button
            type="submit"
            isLoading={verifyMutation.isPending}
            className="w-full "
          >
            {verifyMutation.isPending ? "Validating..." : "Confirm Access"}
          </Button>

          <Button
            variant="ghost"
            onClick={handleResend}
            isLoading={resendMutation.isPending}
            className="w-full border"
          >
            {resendMutation.isPending ? "Resending..." : "New Code Required"}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
