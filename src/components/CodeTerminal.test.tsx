import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CodeTerminal from "./CodeTerminal";

describe("CodeTerminal", () => {
  it("renders macOS dots and optional language label", () => {
    render(
      <CodeTerminal language="tsx">
        <pre>
          <code>const x = 1;</code>
        </pre>
      </CodeTerminal>
    );

    expect(document.querySelector(".code-terminal-dot--red")).toBeInTheDocument();
    expect(document.querySelector(".code-terminal-dot--yellow")).toBeInTheDocument();
    expect(document.querySelector(".code-terminal-dot--green")).toBeInTheDocument();
    expect(screen.getByText("tsx")).toHaveClass("code-terminal-language");
  });
});
