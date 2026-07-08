import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HighlightedSource from "./HighlightedSource";

describe("HighlightedSource", () => {
  it("renders highlighted tsx with terminal chrome", async () => {
    const ui = await HighlightedSource({
      code: 'const title = "File System";',
      language: "tsx",
    });
    render(ui);

    expect(screen.getByText("tsx")).toHaveClass("code-terminal-language");
    expect(document.querySelector(".code-terminal-dot--red")).toBeInTheDocument();
    expect(document.querySelector(".shiki")).toBeInTheDocument();
    expect(screen.getByText(/File System/)).toBeInTheDocument();
  });
});
