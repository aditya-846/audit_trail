import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../pages/Login";
import { loginUser } from "../services/authService";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    login: vi.fn(),
    logout: vi.fn(),
    user: { name: "Test User", role: "DISPATCHER" },
    isAuthenticated: true,
  }),
}));

describe("Login Page", () => {
  it("renders login form", () => {
    render(<Login />);

    expect(
      screen.getByRole("heading", { name: /Welcome back/i })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/you@example\.com/i)
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/Enter your password/i)
    ).toBeInTheDocument();
  });

  it("allows user to enter email and password", () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);

    fireEvent.change(emailInput, {
      target: { value: "test@example.com" },
    });

    fireEvent.change(passwordInput, {
      target: { value: "password123" },
    });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("renders login button", () => {
    render(<Login />);

    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });
});