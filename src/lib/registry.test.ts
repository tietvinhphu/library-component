import { describe, expect, it } from "vitest";
import {
  getAllCategories,
  getAllComponents,
  getComponentByName,
  getComponentDocs,
  getComponentSource,
  getComponentsByCategory,
  getPreviewImage,
} from "./registry";

describe("registry", () => {
  it("returns all components from registry.json", () => {
    const components = getAllComponents();
    expect(components.length).toBeGreaterThan(0);
    expect(components[0]).toMatchObject({
      name: "file-system",
      categories: ["file-system"],
    });
  });

  it("finds component by name", () => {
    const component = getComponentByName("file-system");
    expect(component?.title).toBe("File System");
    expect(getComponentByName("missing-component")).toBeUndefined();
  });

  it("filters components by category", () => {
    const components = getComponentsByCategory("file-system");
    expect(components).toHaveLength(1);
    expect(components[0]?.name).toBe("file-system");
    expect(getComponentsByCategory("unknown")).toHaveLength(0);
  });

  it("returns sorted unique categories", () => {
    expect(getAllCategories()).toEqual(["file-system"]);
  });

  it("reads component docs when present", () => {
    const docs = getComponentDocs("file-system");
    expect(docs).toContain("File System");
    expect(getComponentDocs("missing-component")).toBeNull();
  });

  it("reads component source when present", () => {
    const source = getComponentSource("file-system");
    expect(source).toContain("FileSystem");
    expect(getComponentSource("missing-component")).toBeNull();
  });

  it("returns preview image path when asset exists or null otherwise", () => {
    expect(getPreviewImage("file-system")).toBeNull();
    expect(getPreviewImage("missing-component")).toBeNull();
  });
});
