import "@testing-library/jest-dom/vitest";
import { createRef } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  FileSystem,
  type FileSystemItem,
  type FileSystemRef,
} from "./file-system";

const sampleItems: FileSystemItem[] = [
  { key: "folder-docs", kind: "folder", path: "documents", name: "Documents" },
  {
    key: "file-readme",
    kind: "file",
    path: "documents/readme.md",
    name: "readme.md",
    size: 1536,
  },
  {
    key: "file-report",
    kind: "file",
    path: "documents/report.pdf",
    name: "report.pdf",
    size: 2048,
  },
  { key: "folder-media", kind: "folder", path: "media", name: "Media" },
  {
    key: "file-photo",
    kind: "file",
    path: "media/photo.png",
    name: "photo.png",
    size: 4096,
  },
  {
    key: "file-archive",
    kind: "file",
    path: "backup.zip",
    name: "backup.zip",
    size: 1024,
  },
  {
    key: "file-script",
    kind: "file",
    path: "scripts/app.ts",
    name: "app.ts",
    size: 512,
  },
  {
    key: "file-sheet",
    kind: "file",
    path: "data/sheet.csv",
    name: "sheet.csv",
    size: 256,
  },
];

describe("FileSystem", () => {
  it("shows empty state in list view", () => {
    render(<FileSystem items={[]} />);
    expect(screen.getByText("No items")).toBeInTheDocument();
  });

  it("renders root folders and files in list view", () => {
    render(<FileSystem items={sampleItems} />);

    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("Media")).toBeInTheDocument();
    expect(screen.getByText("backup.zip")).toBeInTheDocument();
    expect(screen.queryByText("readme.md")).not.toBeInTheDocument();
  });

  it("expands folders and shows nested files in list view", async () => {
    const user = userEvent.setup();
    const onFolderToggle = vi.fn();

    render(
      <FileSystem items={sampleItems} onFolderToggle={onFolderToggle} />
    );

    await user.click(screen.getByText("Documents"));

    expect(screen.getByText("readme.md")).toBeInTheDocument();
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
    expect(onFolderToggle).toHaveBeenCalledWith(
      expect.objectContaining({ path: "documents" }),
      true
    );
  });

  it("formats file size for visible files", async () => {
    const user = userEvent.setup();

    render(<FileSystem items={sampleItems} />);

    await user.click(screen.getByText("Documents"));

    expect(screen.getByText("1.5 KB")).toBeInTheDocument();
    expect(screen.getByText("2 KB")).toBeInTheDocument();
  });

  it("calls onFileOpen when double-clicking a file in list view", async () => {
    const user = userEvent.setup();
    const onFileOpen = vi.fn();

    render(<FileSystem items={sampleItems} onFileOpen={onFileOpen} />);

    await user.click(screen.getByText("Documents"));
    await user.dblClick(screen.getByText("readme.md"));

    expect(onFileOpen).toHaveBeenCalledWith(
      expect.objectContaining({ path: "documents/readme.md" }),
      expect.any(Object)
    );
  });

  it("opens files with Enter in list view", async () => {
    const user = userEvent.setup();
    const onFileOpen = vi.fn();

    render(<FileSystem items={sampleItems} onFileOpen={onFileOpen} />);

    await user.click(screen.getByText("Documents"));
    const fileRow = screen.getByText("readme.md").closest('[role="treeitem"]');
    expect(fileRow).not.toBeNull();
    (fileRow as HTMLElement | null)?.focus();
    await user.keyboard("{Enter}");

    expect(onFileOpen).toHaveBeenCalled();
  });

  it("notifies selection changes in list view", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    render(
      <FileSystem items={sampleItems} onSelectionChange={onSelectionChange} />
    );

    await user.click(screen.getByText("Media"));

    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({ path: "media" })
    );
  });

  it("supports imperative openFile API in list view", async () => {
    const ref = createRef<FileSystemRef>();
    const onFileOpen = vi.fn();

    render(
      <FileSystem ref={ref} items={sampleItems} onFileOpen={onFileOpen} />
    );

    ref.current?.openFile("documents/readme.md");

    expect(await screen.findByText("readme.md")).toBeInTheDocument();
    expect(onFileOpen).toHaveBeenCalledWith(
      expect.objectContaining({ path: "documents/readme.md" }),
      expect.any(Object)
    );
  });

  it("supports imperative toggleFolder and clearSelection", async () => {
    const ref = createRef<FileSystemRef>();
    const user = userEvent.setup();

    render(<FileSystem ref={ref} items={sampleItems} />);

    ref.current?.toggleFolder("documents", true);
    expect(await screen.findByText("readme.md")).toBeInTheDocument();

    await user.click(screen.getByText("readme.md"));
    ref.current?.clearSelection();

    const selectedRow = screen
      .getByText("readme.md")
      .closest('[role="treeitem"]');
    await waitFor(() => {
      expect(selectedRow).toHaveAttribute("aria-selected", "false");
    });
  });

  it("drills down into folders in icons view", async () => {
    const user = userEvent.setup();

    render(<FileSystem items={sampleItems} view="icons" />);

    const grid = screen.getByRole("grid");
    await user.click(within(grid).getByText("Documents"));

    expect(screen.getByText("readme.md")).toBeInTheDocument();
    expect(screen.getByText("Root")).toBeInTheDocument();
    expect(screen.getByText("documents")).toBeInTheDocument();
  });

  it("navigates back to root with breadcrumb in icons view", async () => {
    const user = userEvent.setup();

    render(<FileSystem items={sampleItems} view="icons" />);

    const grid = screen.getByRole("grid");
    await user.click(within(grid).getByText("Documents"));
    await user.click(screen.getByText("Root"));

    expect(within(grid).getByText("Documents")).toBeInTheDocument();
    expect(screen.queryByText("readme.md")).not.toBeInTheDocument();
  });

  it("uses parent navigation button in icons view", async () => {
    const user = userEvent.setup();

    render(<FileSystem items={sampleItems} view="icons" />);

    const grid = screen.getByRole("grid");
    await user.click(within(grid).getByText("Documents"));
    await user.click(screen.getByRole("button", { name: "Go back" }));

    expect(within(grid).getByText("Documents")).toBeInTheDocument();
  });

  it("opens files from icons view with double-click and Enter", async () => {
    const user = userEvent.setup();
    const onFileOpen = vi.fn();

    render(
      <FileSystem items={sampleItems} view="icons" onFileOpen={onFileOpen} />
    );

    await user.dblClick(screen.getByText("backup.zip"));
    expect(onFileOpen).toHaveBeenCalledWith(
      expect.objectContaining({ path: "backup.zip" }),
      expect.any(Object)
    );

    const grid = screen.getByRole("grid");
    await user.click(within(grid).getByText("Media"));
    const photoCell = within(grid).getByText("photo.png").closest('[role="gridcell"]') as HTMLElement | null;
    expect(photoCell).not.toBeNull();
    photoCell?.focus();
    await user.keyboard("{Enter}");

    expect(onFileOpen).toHaveBeenCalledWith(
      expect.objectContaining({ path: "media/photo.png" }),
      expect.any(Object)
    );
  });

  it("shows empty folder message in icons view", async () => {
    const user = userEvent.setup();
    const emptyFolderItems: FileSystemItem[] = [
      { key: "empty", kind: "folder", path: "empty", name: "Empty" },
    ];

    render(<FileSystem items={emptyFolderItems} view="icons" />);

    await user.click(screen.getByText("Empty"));
    expect(screen.getByText("Empty folder")).toBeInTheDocument();
  });

  it("ignores imperative openFile for unknown paths", () => {
    const ref = createRef<FileSystemRef>();
    const onFileOpen = vi.fn();

    render(
      <FileSystem ref={ref} items={sampleItems} onFileOpen={onFileOpen} />
    );

    ref.current?.openFile("missing/file.txt");

    expect(onFileOpen).not.toHaveBeenCalled();
  });
});
