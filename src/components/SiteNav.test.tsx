import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { describe, expect, it, vi } from "vitest";
import SiteNav from "./SiteNav";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

const mockUsePathname = vi.mocked(usePathname);

describe("SiteNav", () => {
  it("renders Components and Notes links", () => {
    mockUsePathname.mockReturnValue("/");
    render(<SiteNav />);

    expect(screen.getByRole("link", { name: "Components" })).toHaveAttribute(
      "href",
      "/components"
    );
    expect(screen.getByRole("link", { name: "Notes" })).toHaveAttribute(
      "href",
      "/notes"
    );
  });

  it("marks Notes link active on /notes path", () => {
    mockUsePathname.mockReturnValue("/notes");
    render(<SiteNav />);

    expect(screen.getByRole("link", { name: "Notes" })).toHaveClass(
      "nav-link-active"
    );
  });

  it("marks Components link active on /components path", () => {
    mockUsePathname.mockReturnValue("/components/file-system");
    render(<SiteNav />);

    expect(screen.getByRole("link", { name: "Components" })).toHaveClass(
      "nav-link-active"
    );
  });
});
