const AUTH_TOKEN_KEY =
  "audit_token";

const AUTH_USER_KEY =
  "audit_user";

const API_URL = "http://localhost:3001";

export const loginUser = async (email, password) => {
    const response = await fetch(
      `${API_URL}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    );
    const users = await response.json();
    if (!users.length) {
      throw new Error("Invalid email or password.");
    }

    const user = users[0];
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    localStorage.setItem(AUTH_TOKEN_KEY, "json-server-demo-token");
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser));
    return { token: "json-server-demo-token", user: safeUser };
};

export const registerUser = async (userData) => {
    const existingResponse = await fetch(
      `${API_URL}/users?email=${encodeURIComponent(userData.email)}`
    );
    const existingUsers = await existingResponse.json();
    if (existingUsers.length) {
      throw new Error("An account with this email already exists.");
    }

    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || "read-only",
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to create account.");
    }
  return response.json();
};

export const authService = {
  login: loginUser,
  register: registerUser,

  logout() {
    localStorage.removeItem(
      AUTH_TOKEN_KEY
    );

    localStorage.removeItem(
      AUTH_USER_KEY
    );

    window.dispatchEvent(
      new Event("auth:logout")
    );
  },

  getToken() {
    return localStorage.getItem(
      AUTH_TOKEN_KEY
    );
  },

  getUser() {
    const user =
      localStorage.getItem(
        AUTH_USER_KEY
      );

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return Boolean(
      localStorage.getItem(
        AUTH_TOKEN_KEY
      )
    );
  },

  hasRole(role) {
    const user =
      this.getUser();

    if (!user) {
      return false;
    }

    if (Array.isArray(role)) {
      return role.includes(
        user.role
      );
    }

    return user.role === role;
  },

  canEdit() {
    return this.hasRole([
      "admin",
      "can-edit",
    ]);
  },

  canRead() {
    return this.hasRole([
      "admin",
      "read-only",
      "can-edit",
      "can-log-sensor-data",
    ]);
  },

  canLogSensorData() {
    return this.hasRole([
      "admin",
      "can-log-sensor-data",
    ]);
  },
};

export default authService;