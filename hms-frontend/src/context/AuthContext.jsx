import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to process token and set user state
  const processToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      const userData = {
        token,
        role: decoded.role,
        username: decoded.sub
      };
      setUser(userData);
      return userData;
    } catch (err) {
      console.error("Token decoding failed", err);
      localStorage.clear();
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      processToken(token);
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    return processToken(token); // This returns the user object to the Login page
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}