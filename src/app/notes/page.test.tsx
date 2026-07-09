import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotesPage from "./page";

describe("NotesPage", () => {
  it("renders notes grouped by category", () => {
    render(<NotesPage />);

    expect(screen.getByRole("heading", { name: "Notes" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "network security" })
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", {
        name: /Zero Trust Architecture/i,
      })
    ).toHaveLength(2);
  });
});
