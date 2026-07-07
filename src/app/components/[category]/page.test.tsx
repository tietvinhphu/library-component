import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type * as Registry from "../../../lib/registry";
import CategoryPage from "./page";

vi.mock("@/lib/registry", async (importOriginal) => {
  const actual = await importOriginal<typeof Registry>();
  return {
    ...actual,
    getPreviewImage: vi.fn((name: string) =>
      name === "file-system" ? "/previews/file-system.png" : null
    ),
  };
});

describe("CategoryPage", () => {
  it("renders components for a known category", async () => {
    const ui = await CategoryPage({
      params: Promise.resolve({ category: "file-system" }),
    });
    render(ui);

    expect(screen.getByRole("heading", { name: "file system" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "File System" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /File System/i })
    ).toHaveAttribute("href", "/components/file-system/file-system");
  });

  it("renders preview thumbnail when available", async () => {
    const ui = await CategoryPage({
      params: Promise.resolve({ category: "file-system" }),
    });
    render(ui);

    expect(screen.getByRole("img", { name: "File System" })).toHaveAttribute(
      "src",
      "/previews/file-system.png"
    );
  });

  it("shows empty state for unknown category", async () => {
    const ui = await CategoryPage({
      params: Promise.resolve({ category: "unknown-category" }),
    });
    render(ui);

    expect(screen.getByText("No components found.")).toBeInTheDocument();
  });
});
