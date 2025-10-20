/**
 * 🧪 Sentilytics Component Test
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Sentilytics from "../pages/Main/Sentilytics";

// ✅ Mock axiosInstance
vi.mock("../api/axiosInstance", () => ({
  default: {
    post: vi.fn(),
  },
}));

// ✅ Mock supabase
vi.mock("../api/supabaseClient", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        data: [
          { id: "1", name: "Topic A" },
          { id: "2", name: "Topic B" },
        ],
        error: null,
      })),
    })),
  },
}));

// ✅ Mock toast
vi.mock("../components/Utils/sweetToast.js", () => ({
  showToast: vi.fn(),
}));

describe("<Sentilytics />", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders component correctly", async () => {
    render(
      <MemoryRouter>
        <Sentilytics />
      </MemoryRouter>
    );

    // Check for static elements
    expect(screen.getByText(/Sentilytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Analyze the tone/i)).toBeInTheDocument();

    // Wait for select to load
    await waitFor(() => screen.getByTestId("topic-select"));
  });

  it("shows validation errors when fields are empty", async () => {
    render(
      <MemoryRouter>
        <Sentilytics />
      </MemoryRouter>
    );

    const submitBtn = screen.getByTestId("submit-button");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Topic is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Message should be at least 10 characters/i)
      ).toBeInTheDocument();
    });
  });

  it("submits valid data successfully", async () => {
    const mockApi = (await import("../api/axiosInstance")).default.post;
    mockApi.mockResolvedValue({
      data: { success: true, Sentiment: "Positive" },
    });

    render(
      <MemoryRouter>
        <Sentilytics />
      </MemoryRouter>
    );

    // Wait for select to load
    const topicSelect = await screen.findByTestId("topic-select");

    // Fill form
    fireEvent.change(screen.getByTestId("name-input"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(topicSelect, { target: { value: "1" } }); // select Topic A
    fireEvent.change(screen.getByTestId("message-input"), {
      target: { value: "This is a test feedback message." },
    });

    // Submit form
    fireEvent.click(screen.getByTestId("submit-button"));

    // Assert API call
    await waitFor(() => {
      expect(mockApi).toHaveBeenCalledWith("/webhook-test/feedback", {
        name: "John Doe",
        email: "john@example.com",
        topic: "1",
        message: "This is a test feedback message.",
      });
    });
  });
});
