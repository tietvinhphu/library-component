import { describe, expect, it } from "vitest";
import { hasComponentDemo } from "./component-demos";

describe("component-demos", () => {
  it("knows which components have live demos", () => {
    expect(hasComponentDemo("file-system")).toBe(true);
    expect(hasComponentDemo("missing-component")).toBe(false);
  });
});
