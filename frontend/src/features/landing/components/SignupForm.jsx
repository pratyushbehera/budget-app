import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRegister } from "../../../services/authApi";
import Button from "@/shared/system/Button";
import Input from "@/shared/system/FormField/Input";
import { useToast } from "../../../contexts/ToastContext";

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

export default function SignupForm() {
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
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-5">
        <Input
          label="Full Name"
          id="name"
          type="text"
          required
          autoComplete="name"
          placeholder="John Doe"
          error={errors?.name?.message}
          {...register("name")}
        />

        <Input
          label="Email Address"
          id="email"
          type="email"
          autoComplete="email"
          required
          placeholder="john@example.com"
          error={errors?.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          id="password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors?.password?.message}
          {...register("password")}
        />

        <Input
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors?.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        isLoading={registerMutation.isPending}
      >
        {registerMutation.isPending ? "Creating..." : "Sign up"}
      </Button>
    </form>
  );
}
