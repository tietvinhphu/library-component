import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { notFound } from "next/navigation";
import { describe, expect, it, vi } from "vitest";
import NotePage, { generateStaticParams } from "./page";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/components/MarkdownDocs", () => ({
  default: ({ content }: { content: string }) => (
    <div data-testid="markdown-docs">{content.slice(0, 40)}</div>
  ),
}));

vi.mock("@/components/TableOfContents", () => ({
  default: () => null,
}));

const mockNotFound = vi.mocked(notFound);

describe("NotePage", () => {
  it("generates static params from published notes", async () => {
    const params = await generateStaticParams();
    expect(params).toContainEqual({ slug: "zero-trust-basics" });
  });

  it("renders note detail for known slug", async () => {
    const ui = await NotePage({
      params: Promise.resolve({ slug: "zero-trust-basics" }),
    });
    render(ui);

    expect(
      screen.getByRole("heading", {
        name: /Zero Trust Architecture/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Notes" })).toHaveAttribute(
      "href",
      "/notes"
    );
    expect(screen.getByTestId("markdown-docs")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Source:/i })).toHaveAttribute(
      "href",
      "https://www.cloudflare.com/learning/security/glossary/what-is-zero-trust/"
    );
  });

  it("calls notFound for unknown slug", async () => {
    await expect(
      NotePage({ params: Promise.resolve({ slug: "missing-note" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalled();
  });
});
