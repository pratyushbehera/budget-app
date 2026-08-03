import * as SecureStore from "expo-secure-store";
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        const userData = await SecureStore.getItemAsync("userData");
        if (token) {
          setUserToken(token);
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.error("Failed to load secure token", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadStoredToken();
  }, []);

  const login = async (token, userData) => {
    setUserToken(token);
    setUser(userData);
    await SecureStore.setItemAsync("userToken", token);
    await SecureStore.setItemAsync("userData", JSON.stringify(userData));
  };

  const logout = async () => {
    setUserToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("userData");
  };

  return (
    <AuthContext.Provider value={{ userToken, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
