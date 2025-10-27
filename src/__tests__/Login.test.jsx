import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import Login from "../pages/Auth/Login";

// 🧩 Mock SweetAlert2
vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn().mockResolvedValue({ isConfirmed: true }),
  },
}));

// 🧩 Mock Supabase client
vi.mock("../api/supabaseClient.js", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
    },
  },
}));

// 🧩 Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import Swal from "sweetalert2";
import { supabase } from "../api/supabaseClient";

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders email, password, and button", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("login-button")).toBeInTheDocument();
  });

  test("shows validation errors when fields are empty", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.click(screen.getByTestId("login-button"));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/password is required/i)
    ).toBeInTheDocument();
  });

  test("shows success alert and navigates on valid login", async () => {
    // Mock Supabase success
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { email: "test@example.com" } },
      error: null,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.type(screen.getByTestId("email-input"), "test@example.com");
    await user.type(screen.getByTestId("password-input"), "password123");
    await user.click(screen.getByTestId("login-button"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "success",
          title: "Welcome Back!",
        })
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  test("shows error alert on invalid credentials", async () => {
    // Mock Supabase error
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: "Invalid login credentials" },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.type(screen.getByTestId("email-input"), "wrong@example.com");
    await user.type(screen.getByTestId("password-input"), "wrongpass");
    await user.click(screen.getByTestId("login-button"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Login Failed",
          text: "Invalid login credentials",
        })
      );
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
