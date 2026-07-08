import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ComponentDemo from "./ComponentDemo";

describe("ComponentDemo integration", () => {
  it("renders file-system live demo with drill-down folders", async () => {
    const user = userEvent.setup();
    render(<ComponentDemo name="file-system" />);

    expect(await screen.findByRole("button", { name: "Icons" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "List" })).toBeInTheDocument();
    expect(screen.getByText("documents")).toBeInTheDocument();
    expect(screen.getByText("projects")).toBeInTheDocument();
    expect(screen.queryByText("Chưa có preview")).not.toBeInTheDocument();
    expect(screen.queryByText("Chưa có live demo cho component này")).not.toBeInTheDocument();

    await user.click(screen.getByText("documents"));

    await waitFor(() => {
      expect(screen.getByText("images")).toBeInTheDocument();
      expect(screen.getByText("report.pdf")).toBeInTheDocument();
    });
  });
});
