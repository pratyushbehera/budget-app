import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useResetPassword } from "../services/authApi";
import { useToast } from "../contexts/ToastContext";
import { AuthLayout } from "../features/auth/layouts/AuthLayout";
import { FormInput } from "../shared/components/FormInput";

const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords do not match")
    .required("Please confirm your password"),
});

export function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const resetPasswordMutation = useResetPassword();

  const onSubmit = async (data) => {
    try {
      await resetPasswordMutation.mutateAsync({
        token,
        password: data.password,
      });

      setSuccess(true);

      addToast({
        type: "success",
        title: "Password Updated",
        message: "Your password has been reset successfully.",
      });

      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      if (err.status === 429) {
        addToast({
          type: "warning",
          title: "Please wait",
          message: "You’ve requested too many password resets.",
        });
      }
      addToast({
        type: "error",
        title: "Reset Failed",
        message:
          err.message ||
          "The reset link is invalid or has expired. Please request a new one.",
      });
    }
  };

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Choose a strong password for your account"
    >
      {!success ? (
        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            label="New Password"
            id="password"
            type="password"
            placeholder="Enter new password"
            error={errors.password}
            {...register("password")}
          />

          <FormInput
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            error={errors.confirmPassword}
            {...register("confirmPassword")}
          />

          <button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50"
          >
            {resetPasswordMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                Updating...
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <div className="text-green-600 dark:text-green-400 text-4xl mb-4">
              ✓
            </div>
            <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
              Password Updated
            </h3>
            <p className="text-green-700 dark:text-green-300 text-sm mt-2">
              Redirecting you to login…
            </p>
          </div>

          <Link
            to="/login"
            className="block mt-6 w-full btn-secondary text-center"
          >
            Go to Login
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
