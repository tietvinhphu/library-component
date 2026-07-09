import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CategorySidebarLayout from "./CategorySidebarLayout";

describe("CategorySidebarLayout", () => {
  it("renders sidebar with categories and children", () => {
    const categories = ["network-security", "authentication"];
    render(
      <CategorySidebarLayout
        categories={categories}
        getHref={(cat) => `/notes#${cat}`}
      >
        <div>Test content</div>
      </CategorySidebarLayout>
    );

    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "network security" })
    ).toHaveAttribute("href", "/notes#network-security");
    expect(
      screen.getByRole("link", { name: "authentication" })
    ).toHaveAttribute("href", "/notes#authentication");
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("renders sidebar with empty categories", () => {
    render(
      <CategorySidebarLayout categories={[]} getHref={(cat) => `/notes#${cat}`}>
        <div>Empty sidebar</div>
      </CategorySidebarLayout>
    );

    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Empty sidebar")).toBeInTheDocument();
  });

  it("uses getHref function for different href patterns", () => {
    const categories = ["file-system"];
    render(
      <CategorySidebarLayout
        categories={categories}
        getHref={(cat) => `/components/${cat}`}
      >
        <div>Components page</div>
      </CategorySidebarLayout>
    );

    expect(
      screen.getByRole("link", { name: "file system" })
    ).toHaveAttribute("href", "/components/file-system");
  });
});
