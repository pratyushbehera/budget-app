import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  clearError,
} from "../features/auth/authSlice";
import { useLogin } from "../services/authApi";
import { useToast } from "../contexts/ToastContext";
import { AuthLayout } from "../features/auth/layouts/AuthLayout";
import { FormInput } from "../shared/components/FormInput";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required"),
});

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const { error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const from = location.state?.from?.pathname || "/dashboard";

  const loginMutation = useLogin();

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data) => {
    dispatch(loginStart());

    try {
      const userData = await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });

      dispatch(loginSuccess(userData));

      addToast({
        type: "success",
        title: "Login Successful",
        message: `Welcome back, ${userData?.firstName}!`,
      });

      navigate(from, { replace: true });
    } catch (err) {
      if (err.status === 403 && err.data?.requiresVerification) {
        dispatch(
          loginFailure({
            message: err.data.message,
            requiresVerification: true,
          })
        );

        addToast({
          type: "warning",
          title: "Verify your email",
          message: "Please verify your email to continue.",
          autoHide: false,
        });

        navigate("/verify-email", {
          state: { email: data.email },
          replace: true,
        });

        return;
      }

      if (err.status === 429) {
        addToast({
          type: "warning",
          title: "Too many attempts",
          message: err.message,
          autoHide: false,
        });
        return;
      }

      const errorMsg = err.message || "Invalid email or password";
      dispatch(loginFailure(errorMsg));
      addToast({
        type: "error",
        title: "Login Failed",
        message: errorMsg,
      });
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle={
        <div className="mt-2">
          New to FinPal?{" "}
          <Link
            to="/signup"
            className="text-primary-500 font-black hover:underline underline-offset-4"
          >
            Create account
          </Link>
        </div>
      }
      footer={
        <Link
          to="/forgot-password"
          className="hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Recover Password
        </Link>
      }
    >
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <FormInput
            label="Your Email"
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@email.com"
            error={errors.email}
            {...register("email")}
            onChange={() => {
              if (error) dispatch(clearError());
            }}
          />

          <FormInput
            label="Secret Key"
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password}
            {...register("password")}
            onChange={() => {
              if (error) dispatch(clearError());
            }}
          />
        </div>

        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 rounded-[1.5rem] p-5 animate-shake">
            <p className="text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-widest">{error}</p>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full btn-primary py-4 text-xl font-black rounded-2xl shadow-2xl shadow-primary-500/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {loginMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Verifying...
              </div>
            ) : (
              "Authorize Access"
            )}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
