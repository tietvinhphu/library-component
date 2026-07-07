import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SlugPage from "./page";

vi.mock("@/components/ComponentDetail", () => ({
  default: ({ name }: { name: string }) => (
    <div data-testid="component-detail">{name}</div>
  ),
}));

describe("SlugPage", () => {
  it("renders component detail for slug", async () => {
    const ui = await SlugPage({
      params: Promise.resolve({ category: "file-system", slug: "file-system" }),
    });
    render(ui);

    expect(screen.getByTestId("component-detail")).toHaveTextContent(
      "file-system"
    );
  });
});
