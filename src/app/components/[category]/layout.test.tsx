import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ComponentsLayout from "./layout";

describe("ComponentsLayout", () => {
  it("renders children and modal parallel routes", () => {
    render(
      <ComponentsLayout modal={<div>Modal slot</div>}>
        <div>Page content</div>
      </ComponentsLayout>
    );

    expect(screen.getByText("Page content")).toBeInTheDocument();
    expect(screen.getByText("Modal slot")).toBeInTheDocument();
  });
});
