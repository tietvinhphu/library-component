import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ComponentDemo from "./ComponentDemo";

vi.mock("@/lib/component-demos", () => ({
  componentDemos: {
    "file-system": () => <div data-testid="live-demo">Live demo</div>,
  },
}));

describe("ComponentDemo", () => {
  it("renders fallback when no demo is registered", () => {
    render(<ComponentDemo name="unknown-component" />);
    expect(
      screen.getByText("Chưa có live demo cho component này")
    ).toBeInTheDocument();
  });

  it("renders registered demo component", () => {
    render(<ComponentDemo name="file-system" />);
    expect(screen.getByTestId("live-demo")).toBeInTheDocument();
  });
});
