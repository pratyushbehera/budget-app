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
import NotFoundPage from "../../pages/NotFoundPage";
import GroupPage from "../../pages/GroupPage";
import GroupsPage from "../../pages/GroupsPage";

// Protected Route component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const token = localStorage.getItem("auth-token");
  return isAuthenticated || token ? children : <Navigate to="/login" />;
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
        <Route path="/categories" element={<CategoyPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/groups/:groupId" element={<GroupPage />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
