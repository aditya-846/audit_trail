import { useState } from "react";

const TOKEN_KEY = "audit_trail_token";
const USER_KEY = "audit_trail_user";

export default function useAuth() {
  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY);
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(USER_KEY);

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = (userData, authToken) => {
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
  };

  return {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
  };
}