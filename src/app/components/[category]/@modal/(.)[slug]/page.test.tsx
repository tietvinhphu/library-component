import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ModalSlugPage from "./page";

vi.mock("@/components/ComponentDetail", () => ({
  default: ({ name }: { name: string }) => (
    <div data-testid="modal-component-detail">{name}</div>
  ),
}));

describe("ModalSlugPage", () => {
  it("renders component detail inside modal route", async () => {
    const ui = await ModalSlugPage({
      params: Promise.resolve({ category: "file-system", slug: "file-system" }),
    });
    render(ui);

    expect(screen.getByTestId("modal-component-detail")).toHaveTextContent(
      "file-system"
    );
  });
});
