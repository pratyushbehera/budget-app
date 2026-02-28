import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./apiClient";

/* -----------------------------------------------------
   AUTH API CALLS
----------------------------------------------------- */

// POST /auth/login
const loginUser = (credentials) => api.post("/api/auth/login", credentials); // no token needed

// POST /auth/signup
const registerUser = (userData) => api.post("/api/auth/signup", userData);

// GET /auth/me
const getCurrentUser = () => api.get("/api/auth/me");

// PUT /auth/profile
const updateUserProfile = (userData) => api.put("/api/auth/profile", userData);

// POST /auth/forgot-password
const forgotPassword = (email) =>
  api.post("/api/auth/forgot-password", { email });

const resetPassword = async ({ token, password }) =>
  api.post("/api/auth/reset-password", { token, password });

// POST /auth/verify-email
const verifyEmail = (payload) => api.post("/api/auth/verify-email", payload);

// POST /auth/resend-email-otp
const resendEmailOtp = (email) =>
  api.post("/api/auth/resend-email-otp", { email });
/* -----------------------------------------------------
   AUTH HOOKS
----------------------------------------------------- */

// LOGIN
export const useLogin = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("auth-token", data.token);
      }

      // refresh user data
      qc.invalidateQueries(["currentUser"]);
    },
  });
};

// REGISTER
export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

// CURRENT USER
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!localStorage.getItem("auth-token"),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// UPDATE PROFILE
export const useUpdateProfile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("auth-token", data.token);
      }
      qc.invalidateQueries(["currentUser"]);
    },
  });
};

// FORGOT PASSWORD
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

// LOGOUT
export const useLogout = () => {
  const qc = useQueryClient();

  return () => {
    localStorage.removeItem("auth-token");
    qc.removeQueries(["currentUser"]);
  };
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};

export const useVerifyEmail = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("auth-token", data.token);
      }
      qc.invalidateQueries(["currentUser"]);
    },
  });
};

export const useResendEmailOtp = () => {
  return useMutation({
    mutationFn: resendEmailOtp,
  });
};

const generateDeveloperKey = () => api.post("/api/auth/dev-key");

export const useGenerateDeveloperKey = () => {
  return useMutation({
    mutationFn: generateDeveloperKey,
  });
};
