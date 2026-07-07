import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import ComponentDetailClient from "./ComponentDetailClient";

const mockData = {
  name: "file-system",
  title: "File System",
  description: "Explorer component",
  dependencies: ["lucide-react"],
  docs: "## Usage",
  source: "export const FileSystem = () => null;",
  previewImage: null,
};

describe("ComponentDetailClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows loading then component data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockData),
        })
      )
    );

    render(<ComponentDetailClient name="file-system" />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(await screen.findByText("File System")).toBeInTheDocument();
    expect(screen.getByText("Explorer component")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Usage" })).toBeInTheDocument();
    expect(screen.getByText(/export const FileSystem/)).toBeInTheDocument();
  });

  it("renders preview image when available", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              ...mockData,
              previewImage: "/previews/file-system.png",
            }),
        })
      )
    );

    render(<ComponentDetailClient name="file-system" />);

    const image = await screen.findByRole("img", { name: "file-system preview" });
    expect(image).toHaveAttribute("src", "/previews/file-system.png");
  });

  it("copies install command to clipboard", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", {
      clipboard: { writeText },
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockData),
        })
      )
    );

    render(<ComponentDetailClient name="file-system" />);
    await screen.findByText("File System");

    await user.click(screen.getByRole("button", { name: "Copy" }));

    expect(writeText).toHaveBeenCalledWith(
      "npx shadcn@latest add https://your-domain.com/r/file-system.json"
    );
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Copied!" })).toBeInTheDocument();
    });
  });
});
