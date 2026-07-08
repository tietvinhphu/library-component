import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CodeCopyButton from "./CodeCopyButton";

// Mock clipboard
const mockClipboard = {
  writeText: vi.fn(),
};
Object.defineProperty(navigator, "clipboard", {
  value: mockClipboard,
  writable: true,
});

describe("CodeCopyButton", () => {
  it("renders copy button with icon and text", () => {
    render(<CodeCopyButton code="const x = 1;" />);

    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Copy code");
    expect(screen.getByText("Copy")).toBeInTheDocument();
  });

  it("copies code to clipboard on click", async () => {
    render(<CodeCopyButton code="const x = 1;" />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockClipboard.writeText).toHaveBeenCalledWith("const x = 1;");
  });

  it("shows Copied! state after click", async () => {
    render(<CodeCopyButton code="const x = 1;" />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Wait for state update
    await vi.waitFor(() => {
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });
  });
});
