import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HomePage } from "../../pages/HomePage";
import { LoginPage } from "../../pages/LoginPage";
import { SignupPage } from "../../pages/SignupPage";
import { DashboardPage } from "../../pages/DashboardPage";
import { ProfilePage } from "../../pages/ProfilePage";
import ProtectedLayout from "../layouts/ProtectedLayout";
import { TransactionPage } from "../../pages/TransactionPage";
import { CategoyPage } from "../../pages/CategoryPage";
import { PlanPage } from "../../pages/PlanPage";

// Protected Route component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Public Route component (redirect to dashboard if already authenticated)
function PublicRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}

export function AppRoutes() {
  return (
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

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route exact path="plan" element={<PlanPage />} />
        <Route exact path="dashboard" element={<DashboardPage />} />
        <Route exact path="profile" element={<ProfilePage />} />
        <Route exact path="transactions" element={<TransactionPage />} />
        <Route exact path="categories" element={<CategoyPage />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
