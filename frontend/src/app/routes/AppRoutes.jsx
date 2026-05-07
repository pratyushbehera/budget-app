import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import ProtectedLayout from "../layouts/ProtectedLayout";

// Lazy pages
const HomePage = lazy(() => import("@pages/HomePage"));
const LoginPage = lazy(() => import("@pages/LoginPage"));
const SignupPage = lazy(() => import("@pages/SignupPage"));
const DashboardPage = lazy(() => import("@pages/DashboardPage"));
const ProfilePage = lazy(() => import("@pages/ProfilePage"));
const TransactionPage = lazy(() => import("@pages/TransactionPage"));
const CategoryPage = lazy(() => import("@pages/CategoryPage"));
const PlanPage = lazy(() => import("@pages/PlanPage"));
const GroupPage = lazy(() => import("@pages/GroupPage"));
const GroupsPage = lazy(() => import("@pages/GroupsPage"));
const ForgotPasswordPage = lazy(() => import("@pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@pages/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("@pages/VerifyEmailPage"));
const ChatPage = lazy(() => import("@pages/ChatPage"));
const NotFoundPage = lazy(() => import("@pages/NotFoundPage"));

// Protected Route component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const token = localStorage.getItem("auth-token");
  return isAuthenticated || token ? children : <Navigate to="/login" />;
}

// Public Route component (redirect to dashboard if already authenticated)
function PublicRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const token = localStorage.getItem("auth-token");

  return !isAuthenticated && !token ? children : <Navigate to="/dashboard" />;
}

function VerificationRoute({ children }) {
  const { isAuthenticated, requiresVerification } = useSelector(
    (state) => state.auth,
  );

  // If fully authenticated & verified → dashboard
  if (isAuthenticated && !requiresVerification) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise allow access
  return children;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<div>Checking...</div>}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />

        <Route
          path="/verify-email"
          element={
            <VerificationRoute>
              <VerifyEmailPage />
            </VerificationRoute>
          }
        />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/transactions" element={<TransactionPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/groups/:groupId" element={<GroupPage />} />
          <Route path="/ai-chat" element={<ChatPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
