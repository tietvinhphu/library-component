import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ComponentDetail from "./ComponentDetail";

vi.mock("./ComponentDetailClient", () => ({
  default: ({ name }: { name: string }) => (
    <div data-testid="detail-client">{name}</div>
  ),
}));

describe("ComponentDetail", () => {
  it("delegates rendering to ComponentDetailClient", () => {
    render(<ComponentDetail name="file-system" />);
    expect(screen.getByTestId("detail-client")).toHaveTextContent("file-system");
  });
});
