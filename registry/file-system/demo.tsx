"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  FileSystem,
  type FileSystemItem,
  type FileSystemView,
} from "./file-system";

const mockItems: FileSystemItem[] = [
  { key: "folder-documents", kind: "folder", path: "documents", name: "documents" },
  {
    key: "file-report",
    kind: "file",
    path: "documents/report.pdf",
    name: "report.pdf",
    contentType: "application/pdf",
    size: 204_800,
  },
  {
    key: "folder-images",
    kind: "folder",
    path: "documents/images",
    name: "images",
  },
  {
    key: "file-photo",
    kind: "file",
    path: "documents/images/photo.png",
    name: "photo.png",
    contentType: "image/png",
    size: 102_400,
  },
  {
    key: "file-screenshot",
    kind: "file",
    path: "documents/images/screenshot.jpg",
    name: "screenshot.jpg",
    contentType: "image/jpeg",
    size: 51_200,
  },
  { key: "folder-projects", kind: "folder", path: "projects", name: "projects" },
  {
    key: "folder-app",
    kind: "folder",
    path: "projects/app",
    name: "app",
  },
  {
    key: "file-main",
    kind: "file",
    path: "projects/app/main.tsx",
    name: "main.tsx",
    contentType: "text/typescript",
    size: 4_096,
  },
  {
    key: "file-package",
    kind: "file",
    path: "projects/app/package.json",
    name: "package.json",
    contentType: "application/json",
    size: 1_024,
  },
  {
    key: "file-readme",
    kind: "file",
    path: "projects/readme.md",
    name: "readme.md",
    contentType: "text/markdown",
    size: 2_048,
  },
];

export default function FileSystemDemo() {
  const [view, setView] = useState<FileSystemView>("icons");

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setView("list")}
          className={cn(
            "px-3 py-1.5 text-sm rounded-md border border-hairline transition-colors",
            view === "list"
              ? "bg-surface-strong text-ink border-hairline-strong"
              : "bg-surface-card text-body hover:bg-canvas-soft"
          )}
        >
          List
        </button>
        <button
          type="button"
          onClick={() => setView("icons")}
          className={cn(
            "px-3 py-1.5 text-sm rounded-md border border-hairline transition-colors",
            view === "icons"
              ? "bg-surface-strong text-ink border-hairline-strong"
              : "bg-surface-card text-body hover:bg-canvas-soft"
          )}
        >
          Icons
        </button>
      </div>
      <FileSystem items={mockItems} view={view} height="h-[400px]" />
    </div>
  );
}
