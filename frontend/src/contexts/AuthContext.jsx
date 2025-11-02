import React, { createContext, useContext, useEffect } from 'react';
import { useCurrentUser, useLogout } from '../services/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, logout as logoutAction } from '../features/auth/authSlice';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const { 
    data: currentUser, 
    isLoading, 
    error,
    refetch 
  } = useCurrentUser();
  
  const logoutMutation = useLogout();

  // Sync TanStack Query data with Redux
  useEffect(() => {
    if (currentUser) {
      dispatch(setUser(currentUser));
    }
  }, [currentUser, dispatch]);

  // Handle authentication errors
  useEffect(() => {
    if (error && isAuthenticated) {
      // Token might be expired, log user out
      logout();
    }
  }, [error, isAuthenticated]);

  const login = async (credentials) => {
    // This will now be handled by the useLogin hook in components
    // We keep this function for context API consistency
  };

  const logout = () => {
    logoutMutation();
    dispatch(logoutAction());
  };

  const refreshUser = () => {
    refetch();
  };

  const value = {
    user,
    isAuthenticated,
    loading: isLoading,
    error: error?.message,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};