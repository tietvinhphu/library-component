import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TableOfContents from "./TableOfContents";

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(
    private callback: IntersectionObserverCallback,
    private options?: IntersectionObserverInit
  ) {}

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
}

vi.stubGlobal(
  "IntersectionObserver",
  MockIntersectionObserver
);

describe("TableOfContents", () => {
  it("renders title and links for headings", () => {
    const content = `
# Main Title

## Section One

### Subsection

## Section Two
`;

    render(<TableOfContents content={content} />);

    expect(screen.getByText("On This Page")).toBeInTheDocument();
    expect(screen.getByText("Main Title")).toBeInTheDocument();
    expect(screen.getByText("Section One")).toBeInTheDocument();
    expect(screen.getByText("Subsection")).toBeInTheDocument();
    expect(screen.getByText("Section Two")).toBeInTheDocument();
  });

  it("returns null for content without headings", () => {
    const content = `This is just some text without headings.`;

    const { container } = render(<TableOfContents content={content} />);

    expect(container.firstChild).toBeNull();
  });

  it("links to heading anchors", () => {
    const content = `## Getting Started`;

    render(<TableOfContents content={content} />);

    const link = screen.getByRole("link", { name: "Getting Started" });
    expect(link).toHaveAttribute("href", "#getting-started");
  });
});
