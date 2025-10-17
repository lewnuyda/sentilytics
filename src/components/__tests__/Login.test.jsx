import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import Login from "../../pages/Auth/Login";

// 🧩 Mock SweetAlert2 (default export)
vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn().mockResolvedValue({ isConfirmed: true }),
  },
}));

// 🧩 Mock Supabase client
vi.mock("../../api/supabaseClient", () => ({
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
import { supabase } from "../../api/supabaseClient";

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders email, password, and button", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(
      screen.getByPlaceholderText(/enter your email/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  test("shows validation errors when fields are empty", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole("button", { name: /sign in/i });
    await userEvent.click(loginButton);

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

    await userEvent.type(
      screen.getByPlaceholderText(/enter your email/i),
      "test@example.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/enter your password/i),
      "password123"
    );

    const loginButton = screen.getByRole("button", { name: /sign in/i });
    await userEvent.click(loginButton);

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

    await userEvent.type(
      screen.getByPlaceholderText(/enter your email/i),
      "wrong@example.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/enter your password/i),
      "wrongpass"
    );

    const loginButton = screen.getByRole("button", { name: /sign in/i });
    await userEvent.click(loginButton);

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
