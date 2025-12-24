import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  clearError,
} from "../features/auth/authSlice";
import { useLogin } from "../services/authApi";
import { useNotification } from "../contexts/NotificationContext";
import { AuthLayout } from "../features/auth/layouts/AuthLayout";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useNotification();
  const { error } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || "/dashboard";

  const loginMutation = useLogin();

  // Clear errors when component unmounts or when user starts typing
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      dispatch(loginFailure("Please fill in all fields"));
      return;
    }

    dispatch(loginStart());

    try {
      const userData = await loginMutation.mutateAsync({ email, password });

      dispatch(loginSuccess(userData));

      addNotification({
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

        addNotification({
          type: "warning",
          title: "Verify your email",
          message: "Please verify your email to continue.",
          autoHide: false,
        });

        navigate("/verify-email", {
          state: { email },
          replace: true,
        });

        return;
      }

      if (err.status === 429) {
        addNotification({
          type: "warning",
          title: "Too many attempts",
          message: err.message,
          autoHide: false,
        });
        return;
      }

      const errorMsg = err.message || "Invalid email or password";
      dispatch(loginFailure(errorMsg));
      addNotification({
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
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) dispatch(clearError());
              }}
              className="input-field mt-1"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) dispatch(clearError());
              }}
              className="input-field mt-1"
              placeholder="Enter your password"
            />
          </div>
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
