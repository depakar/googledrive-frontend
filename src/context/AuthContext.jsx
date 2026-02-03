import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const { exp } = jwtDecode(token);

        // token expired
        if (Date.now() >= exp * 1000) {
          logout();
        } else {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        logout();
      }
    }

    setLoading(false);
  }, []);

  // 🔹 Login handler
  const login = ({ user, token }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setUser(user);
  };

  // 🔹 Logout handler
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);

    // safer redirect
    window.location.replace("/login");
  };

  // 🔥 Expose logout globally for axios interceptor
  useEffect(() => {
    window.__LOGOUT__ = logout;

    return () => {
      window.__LOGOUT__ = null;
    };
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
