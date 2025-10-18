/**
 * 🧪 React Component Test Template (Vitest + RTL)
 *
 * Use this as a base for any future component tests.
 * Just copy → rename → replace "ComponentName" with your actual component.
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom"; // Only needed if using navigation
import ComponentName from "../path/to/ComponentName";

// ✅ Example mock (if your component uses an API or external function)
vi.mock("../path/to/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("<ComponentName />", () => {
  beforeEach(() => {
    vi.resetAllMocks(); // resets mock history before each test
  });

  it("renders component correctly", () => {
    render(
      <MemoryRouter>
        <ComponentName />
      </MemoryRouter>
    );

    // ✅ Check if static text or element renders
    expect(screen.getByText(/your text here/i)).toBeInTheDocument();
  });

  it("shows validation errors when fields are empty", async () => {
    render(
      <MemoryRouter>
        <ComponentName />
      </MemoryRouter>
    );

    // Example: click the submit button
    const submitBtn = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitBtn);

    // ✅ Wait for validation errors
    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });

  it("submits valid data successfully", async () => {
    const mockApi = (await import("../path/to/api")).default.post;
    mockApi.mockResolvedValue({ data: { success: true } });

    render(
      <MemoryRouter>
        <ComponentName />
      </MemoryRouter>
    );

    // ✅ Fill inputs (adjust selectors as needed)
    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "John Doe" },
    });

    // ✅ Click submit
    const submitBtn = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitBtn);

    // ✅ Assert API call
    await waitFor(() => {
      expect(mockApi).toHaveBeenCalled();
    });
  });
});
