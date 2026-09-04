import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("audit_token");
    const savedUser = localStorage.getItem("audit_user");

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Invalid saved user:", error);
        localStorage.removeItem("audit_user");
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const handleAuthLogout = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener("auth:logout", handleAuthLogout);
    return () => window.removeEventListener("auth:logout", handleAuthLogout);
  }, []);

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const data = await authService.login(email, password);
    localStorage.setItem("audit_token", data.token);
    localStorage.setItem("audit_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("audit_token");
    localStorage.removeItem("audit_user");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token && user);
  const hasRole = (role) => {
    if (!user) return false;
    return Array.isArray(role) ? role.includes(user.role) : user.role === role;
  };
  const canRead = () =>
    ["AUDITOR", "DISPATCHER", "TELEMETRY_BOT", "admin", "read-only", "can-edit", "can-log-sensor-data"].includes(user?.role);
  const canEdit = () => ["DISPATCHER", "admin", "can-edit"].includes(user?.role);
  const canLogSensorData = () =>
    ["TELEMETRY_BOT", "DISPATCHER", "admin", "can-log-sensor-data"].includes(user?.role);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
        hasRole,
        canRead,
        canEdit,
        canLogSensorData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}