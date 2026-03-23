import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRegister } from "../services/authApi";
import { useToast } from "../contexts/ToastContext";
import { AuthLayout } from "../features/auth/layouts/AuthLayout";
import { FormInput } from "../shared/components/FormInput";

const signupSchema = yup.object().shape({
  name: yup.string().required("Full Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords do not match")
    .required("Please confirm your password"),
});

export function SignupPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const registerMutation = useRegister();

  const onSubmit = async (data) => {
    try {
      const registerData = {
        firstName: data.name.split(" ")[0],
        lastName: data.name.split(" ").slice(1).join(" ") || "",
        email: data.email,
        password: data.password,
      };

      await registerMutation.mutateAsync(registerData);

      addToast({
        type: "success",
        title: "Account Created Successfully!",
        message: "You can now login with your credentials.",
      });

      navigate("/login");
    } catch (err) {
      addToast({
        type: "error",
        title: "Signup Failed",
        message: err.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <AuthLayout
      title="Join FinPal"
      subtitle={
        <div className="mt-2">
          Already a member?{" "}
          <Link
            to="/login"
            className="text-primary-500 font-black hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </div>
      }
      footer={
        <div className="space-y-1">
          <p>By creating an account, you agree to our</p>
          <div className="flex items-center justify-center gap-2">
            <Link to="/terms" className="text-gray-900 dark:text-white hover:underline">Terms</Link>
            <span className="opacity-30">&bull;</span>
            <Link to="/privacy" className="text-gray-900 dark:text-white hover:underline">Privacy Policy</Link>
          </div>
        </div>
      }
    >
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5">
          <FormInput
            label="Full Name"
            id="name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            error={errors.name}
            {...register("name")}
          />

          <FormInput
            label="Email Address"
            id="email"
            type="email"
            autoComplete="email"
            placeholder="john@example.com"
            error={errors.email}
            {...register("email")}
          />

          <FormInput
            label="Secure Password"
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.password}
            {...register("password")}
          />

          <FormInput
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.confirmPassword}
            {...register("confirmPassword")}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full btn-primary py-4 text-xl font-black rounded-2xl shadow-2xl shadow-primary-500/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {registerMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Creating...
              </div>
            ) : (
              "Launch Account"
            )}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
