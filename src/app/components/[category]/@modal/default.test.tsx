import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DefaultModal from "./default";

describe("DefaultModal", () => {
  it("returns null when modal slot is inactive", () => {
    const { container } = render(<DefaultModal />);
    expect(container).toBeEmptyDOMElement();
  });
});
