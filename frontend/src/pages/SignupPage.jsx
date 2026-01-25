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
      title="Create your account"
      subtitle={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
      footer={
        <>
          By creating an account, you agree to our{" "}
          <Link to="/terms" className="text-primary-600 hover:underline">
            Terms
          </Link>{" "}
          &{" "}
          <Link to="/privacy" className="text-primary-600 hover:underline">
            Privacy Policy
          </Link>
        </>
      }
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormInput
            label="Full Name"
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            error={errors.name}
            {...register("name")}
          />

          <FormInput
            label="Email address"
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            error={errors.email}
            {...register("email")}
          />

          <FormInput
            label="Password"
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            error={errors.password}
            {...register("password")}
          />

          <FormInput
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            {...register("confirmPassword")}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {registerMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Creating account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
