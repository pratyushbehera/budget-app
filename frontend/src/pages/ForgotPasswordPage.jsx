import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForgotPassword } from "../services/authApi";
import { useToast } from "../contexts/ToastContext";
import { AuthLayout } from "../features/auth/layouts/AuthLayout";
import { FormInput } from "../shared/components/FormInput";

const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

export function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const forgotPasswordMutation = useForgotPassword();

  const onSubmit = async (data) => {
    try {
      const result = await forgotPasswordMutation.mutateAsync(data.email);

      setEmailSent(true);
      setSentEmail(data.email);

      // Show development info in development mode
      if (import.meta.env.DEV && result.resetToken) {
        addToast({
          type: "info",
          title: "Development Info",
          message: `Reset token: ${result.resetToken}`,
          autoHide: false,
        });
      }

      addToast({
        type: "success",
        title: "Email Sent",
        message:
          result.message ||
          "If an account with that email exists, a password reset link has been sent.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Request Failed",
        message: err.message || "Failed to send password reset email.",
      });
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={
        <Link
          to="/login"
          className="text-primary-600 dark:text-primary-400 hover:underline"
        >
          Return to login
        </Link>
      }
    >
      {!emailSent ? (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <FormInput
              label="Email address"
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email address"
              error={errors.email}
              {...register("email")}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {forgotPasswordMutation.isPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Sending...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <div className="text-green-600 dark:text-green-400 text-4xl mb-4">
              ✓
            </div>
            <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">
              Check Your Email
            </h3>
            <p className="text-green-700 dark:text-green-300 text-sm mb-4">
              We've sent password reset instructions to <strong>{sentEmail}</strong>
            </p>
            <p className="text-green-600 dark:text-green-400 text-xs">
              The link will expire in 10 minutes.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <Link
              to="/login"
              className="block w-full btn-secondary text-center"
            >
              Back to Login
            </Link>
            <button
              onClick={() => setEmailSent(false)}
              className="block w-full btn-primary text-center"
            >
              Send Another Email
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
