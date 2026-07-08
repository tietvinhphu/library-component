import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ClientCollapsibleCode from "./ClientCollapsibleCode";

// Mock clipboard
const mockClipboard = {
  writeText: vi.fn(),
};
Object.defineProperty(navigator, "clipboard", {
  value: mockClipboard,
  writable: true,
});

const sampleHtml = `<pre class="shiki"><code><span class="line">const x = 1;</span></code></pre>`;

describe("ClientCollapsibleCode", () => {
  it("renders collapsed by default with View button", () => {
    render(
      <ClientCollapsibleCode
        html={sampleHtml}
        rawCode="const x = 1;"
        language="tsx"
        collapsible={true}
      />
    );

    expect(screen.getByText("View Code")).toBeInTheDocument();
  });

  it("expands when View button is clicked", async () => {
    render(
      <ClientCollapsibleCode
        html={sampleHtml}
        rawCode="const x = 1;"
        language="tsx"
        collapsible={true}
      />
    );

    const viewBtn = screen.getByText("View Code");
    fireEvent.click(viewBtn);

    await vi.waitFor(() => {
      expect(screen.getByText("Collapse")).toBeInTheDocument();
    });
  });

  it("shows copy button when expanded", async () => {
    render(
      <ClientCollapsibleCode
        html={sampleHtml}
        rawCode="const x = 1;"
        language="tsx"
        collapsible={true}
      />
    );

    const viewBtn = screen.getByText("View Code");
    fireEvent.click(viewBtn);

    await vi.waitFor(() => {
      expect(screen.getByRole("button", { name: /Copy code/i })).toBeInTheDocument();
    });
  });

  it("renders without collapse when collapsible is false", () => {
    render(
      <ClientCollapsibleCode
        html={sampleHtml}
        rawCode="const x = 1;"
        language="tsx"
        collapsible={false}
      />
    );

    expect(screen.queryByText("View Code")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Copy code/i })).toBeInTheDocument();
  });
});
