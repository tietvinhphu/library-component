import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { compileMarkdownToJsx } from "@/lib/markdown-code";

describe("markdown code pipeline", () => {
  it("highlights fenced bash blocks with terminal chrome", async () => {
    const markdown = ["```bash", "npx shadcn@latest add file-system", "```"].join(
      "\n"
    );

    const body = await compileMarkdownToJsx(markdown);
    const { container } = render(body);

    expect(container.querySelector('[data-language="bash"]')).toBeTruthy();
    expect(
      container.querySelector("[data-rehype-pretty-code-figure]")
    ).toBeTruthy();
    expect(container.querySelector(".code-terminal-dot--red")).toBeTruthy();
    expect(container.querySelector(".code-terminal-language")).toHaveTextContent(
      "bash"
    );
    expect(container.textContent).toContain("npx");
    expect(container.textContent).toContain("file-system");
    expect(container.innerHTML).toMatch(/style="[^"]*color:[^"]+"/);
  });
});
