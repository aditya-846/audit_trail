import api from "./api";

const AUTH_TOKEN_KEY = "audit_token";
const AUTH_USER_KEY = "audit_user";

export const loginUser = async (email, password) => {
  const data = await api.post("/auth/login", { email, password });
  if (data.token && data.user) {
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
  }
  return data;
};

export const registerUser = async (userData) => {
  const data = await api.post("/auth/signup", {
    email: userData.email,
    password: userData.password,
    role: userData.role,
  });
  return data;
};

export const authService = {
  login: loginUser,
  register: registerUser,

  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    window.dispatchEvent(new Event("auth:logout"));
  },

  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  getUser() {
    const user = localStorage.getItem(AUTH_USER_KEY);
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
  },

  hasRole(role) {
    const user = this.getUser();
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  },

  canEdit() {
    return this.hasRole(["DISPATCHER", "admin", "can-edit"]);
  },

  canRead() {
    return this.hasRole([
      "AUDITOR",
      "DISPATCHER",
      "TELEMETRY_BOT",
      "admin",
      "read-only",
      "can-edit",
      "can-log-sensor-data",
    ]);
  },

  canLogSensorData() {
    return this.hasRole(["TELEMETRY_BOT", "DISPATCHER", "admin", "can-log-sensor-data"]);
  },
};

export default authService;