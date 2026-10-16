import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/client.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [staff, setStaff] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const initAuth = async () => {
    const token = localStorage.getItem("staff_token");
    const storedStaff = localStorage.getItem("staff_user");

    if (token) {
      if (storedStaff) {
        try {
          setStaff(JSON.parse(storedStaff));
          setIsAuthenticated(true);
        } catch (e) {}
      }

      try {
        const res = await authApi.getMe();
        if (res.success && res.staff) {
          setStaff(res.staff);
          setIsAuthenticated(true);
          localStorage.setItem("staff_user", JSON.stringify(res.staff));
        }
      } catch (err) {
        console.warn("Session restore failed, logging out:", err.message);
        logout();
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    initAuth();

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener("staff:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("staff:unauthorized", handleUnauthorized);
  }, []);

  const login = async (staffId, password) => {
    const res = await authApi.login(staffId, password);
    if (res.success) {
      localStorage.setItem("staff_token", res.token);
      localStorage.setItem("staff_user", JSON.stringify(res.staff));
      setStaff(res.staff);
      setIsAuthenticated(true);
      return res;
    }
    throw new Error(res.message || "Login failed");
  };

  const logout = () => {
    localStorage.removeItem("staff_token");
    localStorage.removeItem("staff_user");
    setStaff(null);
    setIsAuthenticated(false);
  };

  const refreshProfile = async () => {
    try {
      const res = await authApi.getMe();
      if (res.success) {
        setStaff(res.staff);
        localStorage.setItem("staff_user", JSON.stringify(res.staff));
      }
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        staff,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
