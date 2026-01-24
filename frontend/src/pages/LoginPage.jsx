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
      title="Sign in to your account"
      subtitle={
        <>
          Or{" "}
          <Link
            to="/signup"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            create a new account
          </Link>
        </>
      }
      footer={
        <Link
          to="/forgot-password"
          className="text-primary-600 dark:text-primary-400 hover:underline"
        >
          Forgot your password?
        </Link>
      }
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormInput
            label="Email address"
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            error={errors.email}
            {...register("email")}
            onChange={() => {
              if (error) dispatch(clearError());
            }}
          />

          <FormInput
            label="Password"
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            error={errors.password}
            {...register("password")}
            onChange={() => {
              if (error) dispatch(clearError());
            }}
          />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
