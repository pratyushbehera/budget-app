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
      title="Secure Recovery"
      subtitle={
        <div className="mt-2">
          Remembered it?{" "}
          <Link
            to="/login"
            className="text-primary-500 font-black hover:underline underline-offset-4"
          >
            Back to sign in
          </Link>
        </div>
      }
    >
      {!emailSent ? (
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <p className="text-lg text-gray-500 font-medium tracking-tight text-center px-4 leading-relaxed">
              Enter your email address and we'll send you a link to reset your
              access.
            </p>

            <FormInput
              label="Recovery Email"
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@email.com"
              error={errors.email}
              {...register("email")}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="w-full btn-primary py-4 text-xl font-black rounded-2xl shadow-2xl shadow-primary-500/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {forgotPasswordMutation.isPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Sending...
                </div>
              ) : (
                "Issue Reset Link"
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-10 py-4 animate-fade-in text-center">
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-[2.5rem] p-8 relative overflow-hidden group">
             {/* Dynamic background pulse */}
            <div className="absolute inset-0 bg-emerald-500/5 scale-0 group-hover:scale-100 transition-transform duration-1000 rounded-full"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20 rotate-3 group-hover:rotate-6 transition-transform">
                <span className="text-4xl text-white font-black">✓</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter mb-3">
                Email Transmitted
              </h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-4">
                We've sent recovery instructions to <br/>
                <span className="text-emerald-600 dark:text-emerald-400 font-black">{sentEmail}</span>
              </p>
              <div className="inline-block px-4 py-1 bg-emerald-100 dark:bg-emerald-900/40 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Expires in 10 minutes
              </div>
            </div>
          </div>

          <div className="space-y-4 px-6">
            <button
              onClick={() => setEmailSent(false)}
              className="w-full px-6 py-4 rounded-xl text-sm font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Try another email
            </button>
            <Link
              to="/login"
              className="block w-full btn-primary py-4 text-center rounded-2xl"
            >
              Return Home
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
