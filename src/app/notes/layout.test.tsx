import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotesLayout from "./layout";

describe("NotesLayout (sidebar)", () => {
  it("renders category sidebar and children", () => {
    render(
      <NotesLayout>
        <div>Notes content</div>
      </NotesLayout>
    );

    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "network security" })
    ).toHaveAttribute("href", "/notes#network-security");
    expect(screen.getByText("Notes content")).toBeInTheDocument();
  });
});
