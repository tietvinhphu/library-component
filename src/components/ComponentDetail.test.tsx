import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ComponentDetail from "./ComponentDetail";

vi.mock("./ComponentDemo", () => ({
  default: ({ name }: { name: string }) => (
    <div data-testid="component-demo">{name}</div>
  ),
}));

vi.mock("./InstallCommandCopy", () => ({
  default: ({ command }: { command: string }) => (
    <div data-testid="install-copy">{command}</div>
  ),
}));

describe("ComponentDetail", () => {
  it("renders component metadata and demo for known component", () => {
    render(<ComponentDetail name="file-system" />);

    expect(screen.getByTestId("component-demo")).toHaveTextContent("file-system");
    expect(
      screen.getByText(/Cây thư mục dạng list hoặc icons/)
    ).toBeInTheDocument();
    expect(screen.getByTestId("install-copy")).toHaveTextContent(
      "npx shadcn@latest add https://your-domain.com/r/file-system.json"
    );
    expect(screen.getByRole("heading", { name: "Mô tả" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Source Code" })).toBeInTheDocument();
    expect(screen.getAllByRole("table").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("columnheader", { name: "Tên" })).toBeInTheDocument();
  });

  it("shows not found message for unknown component", () => {
    render(<ComponentDetail name="missing-component" />);
    expect(screen.getByText("Component not found")).toBeInTheDocument();
  });
});
