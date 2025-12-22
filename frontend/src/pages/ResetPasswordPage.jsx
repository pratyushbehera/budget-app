import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useResetPassword } from "../services/authApi";
import { useNotification } from "../contexts/NotificationContext";

export function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const resetPasswordMutation = useResetPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      addNotification({
        type: "error",
        title: "Error",
        message: "Please fill in all fields.",
      });
      return;
    }

    if (password.length < 6) {
      addNotification({
        type: "error",
        title: "Weak Password",
        message: "Password must be at least 6 characters long.",
      });
      return;
    }

    if (password !== confirmPassword) {
      addNotification({
        type: "error",
        title: "Mismatch",
        message: "Passwords do not match.",
      });
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        password,
      });

      setSuccess(true);

      addNotification({
        type: "success",
        title: "Password Updated",
        message: "Your password has been reset successfully.",
      });

      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      if (err.status === 429) {
        addNotification({
          type: "warning",
          title: "Please wait",
          message: "You’ve requested too many password resets.",
        });
      }
      addNotification({
        type: "error",
        title: "Reset Failed",
        message:
          err.message ||
          "The reset link is invalid or has expired. Please request a new one.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link to="/" className="flex justify-center">
            <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              FinPal
            </h1>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Set New Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter a new password for your account
          </p>
        </div>

        {!success ? (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field mt-1"
                placeholder="Enter new password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field mt-1"
                placeholder="Confirm new password"
                required
              />
            </div>

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
      </div>
    </div>
  );
}
