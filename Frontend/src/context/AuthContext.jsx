import { createContext, useState, useEffect } from "react";
import API from "../config/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    user: null,
    isLoggedIn: false,
    loading: true, // important for refresh handling
  });

  // Check authentication on app load / refresh
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/user/verify");

        setAuthData({
          user: res.data.user,
          isLoggedIn: true,
          loading: false,
        });

      } catch (error) {
        // Token invalid / expired / not logged in
        setAuthData({
          user: null,
          isLoggedIn: false,
          loading: false,
        });
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ authData, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};