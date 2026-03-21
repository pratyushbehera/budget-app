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
      title="Create New Key"
      subtitle={
        <div className="mt-2 text-lg font-medium tracking-tight text-gray-500">
          Ensure your new password is secure
        </div>
      }
    >
      {!success ? (
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <FormInput
              label="New Password"
              id="password"
              type="password"
              placeholder="••••••••"
              error={errors.password}
              {...register("password")}
            />

            <FormInput
              label="Confirm New Key"
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword}
              {...register("confirmPassword")}
            />
          </div>

          <button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="w-full btn-primary py-4 text-xl font-black rounded-2xl shadow-2xl shadow-primary-500/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {resetPasswordMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mr-3" />
                Updating...
              </div>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-8 py-4 animate-fade-in text-center">
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-[2.5rem] p-8">
            <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20 rotate-3">
              <span className="text-4xl text-white font-black">✓</span>
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter mb-2">
              Password Restored
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Your security credentials have been updated.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Redirecting to login...</span>
            </div>
          </div>

          <Link
            to="/login"
            className="block w-full py-4 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Go to Sign In
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
