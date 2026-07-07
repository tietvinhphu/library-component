import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ComponentsLayout from "./layout";

describe("ComponentsLayout (sidebar)", () => {
  it("renders categories sidebar and children", () => {
    render(
      <ComponentsLayout>
        <div>Main content</div>
      </ComponentsLayout>
    );

    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "file system" })).toHaveAttribute(
      "href",
      "/components/file-system"
    );
    expect(screen.getByText("Main content")).toBeInTheDocument();
  });
});
