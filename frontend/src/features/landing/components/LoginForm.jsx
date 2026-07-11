// features/landing/components/auth/LoginForm.jsx

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  loginStart,
  loginSuccess,
  loginFailure,
  clearError,
} from "../../auth/authSlice";

import { useLogin } from "../../../services/authApi";
import { useToast } from "../../../contexts/ToastContext";

import Button from "@/shared/system/Button";
import Input from "@/shared/system/FormField/Input";
import { AUTH_VIEWS } from "./authConstants";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginForm({ onNavigate }) {
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

  const loginMutation = useLogin();

  const from = location.state?.from?.pathname || "/dashboard";

  const emailRegister = register("email");
  const passwordRegister = register("password");

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
          }),
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
    <form
      id="login-form"
      className="space-y-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-6">
        <Input
          label="Your Email"
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@email.com"
          required
          error={errors?.email?.message}
          onChange={(e) => {
            emailRegister.onChange(e);

            if (error) {
              dispatch(clearError());
            }
          }}
          {...emailRegister}
        />

        <Input
          label="Password"
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          error={errors?.password?.message}
          onChange={(e) => {
            passwordRegister.onChange(e);

            if (error) {
              dispatch(clearError());
            }
          }}
          {...passwordRegister}
        />
        <button
          type="button"
          onClick={() => onNavigate(AUTH_VIEWS.FORGOT_PASSWORD)}
          className="
        block
        ml-auto
        text-sm
        font-bold
        text-gray-500
        hover:text-primary-500
        transition-colors
      "
        >
          Forgot Password?
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 rounded-[1.5rem] p-5 animate-shake">
          <p className="text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-widest">
            {error}
          </p>
        </div>
      )}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        isLoading={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Verifying..." : "Login"}
      </Button>
    </form>
  );
}
