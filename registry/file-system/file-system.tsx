"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Folder,
  FileText,
  Table,
  Code2,
  Archive,
  File,
  Image,
  ChevronLeft,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface FileSystemItem {
  /** Unique key for React list rendering */
  key: string;
  /** "file" or "folder" */
  kind: "file" | "folder";
  /** Full path, used for hierarchy derivation */
  path: string;
  /** Display name */
  name: string;
  /** MIME type for files */
  contentType?: string;
  /** File size in bytes */
  size?: number;
  /** For lazy-loaded folders */
  hasChildren?: boolean;
  /** Nested items (optional, for static data) */
  children?: FileSystemItem[];
  /** Custom icon URL */
  icon?: string;
  /** Preview image for files */
  previewImageUrl?: string;
  /** Last modified */
  updatedAt?: Date;
}

export type FileSystemView = "list" | "icons";

export interface FileSystemProps {
  /** Flat list of items - hierarchy is derived from path */
  items: Readonly<FileSystemItem[]>;
  /** Called when a file is clicked/double-clicked */
  onFileOpen?: (file: FileSystemItem, event: React.MouseEvent) => void;
  /** Called when folder is clicked to expand/collapse */
  onFolderToggle?: (folder: FileSystemItem, isOpen: boolean) => void;
  /** Called when selection changes */
  onSelectionChange?: (item: FileSystemItem | null) => void;
  /** View mode */
  view?: FileSystemView;
  /** CSS class for container */
  className?: string;
  /** Height of the container */
  height?: string;
}

// ============================================================================
// Helpers
// ============================================================================

/** Derive folder hierarchy from flat items using path */
function buildTree(
  items: ReadonlyArray<FileSystemItem>
): Map<string | null, FileSystemItem[]> {
  const byParentPath = new Map<string | null, FileSystemItem[]>();

  // Sort items by path for consistent ordering
  const sorted = [...items].sort((a, b) => a.path.localeCompare(b.path));

  for (const item of sorted) {
    const parentPath = item.path.includes("/")
      ? item.path.split("/").slice(0, -1).join("/")
      : null;

    if (!byParentPath.has(parentPath)) {
      byParentPath.set(parentPath, []);
    }
    byParentPath.get(parentPath)!.push(item);
  }

  return byParentPath;
}

/** Get file extension from name */
function getFileExtension(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

/** Get icon type based on file extension */
function getFileIconType(item: FileSystemItem): string {
  const ext = getFileExtension(item.name);

  const iconMap: Record<string, string> = {
    // Images
    png: "image",
    jpg: "image",
    jpeg: "image",
    gif: "image",
    svg: "image",
    webp: "image",
    // Documents
    pdf: "file-text",
    doc: "file-text",
    docx: "file-text",
    txt: "file-text",
    md: "file-text",
    // Spreadsheets
    xls: "table",
    xlsx: "table",
    csv: "table",
    // Code
    js: "code",
    ts: "code",
    jsx: "code",
    tsx: "code",
    css: "code",
    html: "code",
    json: "code",
    // Archives
    zip: "archive",
    rar: "archive",
    "7z": "archive",
    // Default
    default: "file",
  };

  return iconMap[ext] || iconMap.default;
}

/** Format file size for display */
function formatFileSize(bytes?: number): string {
  if (bytes === undefined) return "";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/** Get all parent folder paths from a file path */
function getParentFolders(filePath: string): string[] {
  const parts = filePath.split("/");
  const parents: string[] = [];
  for (let i = 1; i < parts.length; i++) {
    parents.push(parts.slice(0, i).join("/"));
  }
  return parents;
}

/** Flatten tree items for list view (extracted to avoid deep nesting) */
function flattenTreeItems(
  tree: Map<string | null, FileSystemItem[]>,
  expandedFolders: Set<string>
): Array<{ item: FileSystemItem; level: number }> {
  const result: Array<{ item: FileSystemItem; level: number }> = [];

  const traverse = (parentPath: string | null, level: number) => {
    const children = tree.get(parentPath) || [];
    for (const item of children) {
      result.push({ item, level });
      if (item.kind === "folder" && expandedFolders.has(item.path)) {
        traverse(item.path, level + 1);
      }
    }
  };

  traverse(null, 0);
  return result;
}

// ============================================================================
// Icon Component
// ============================================================================

interface FileIconProps {
  item: Readonly<FileSystemItem>;
  className?: string;
}

function FileIcon({ item, className }: FileIconProps) {
  const iconType = item.kind === "folder" ? "folder" : getFileIconType(item);

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    folder: Folder,
    image: Image,
    "file-text": FileText,
    table: Table,
    code: Code2,
    archive: Archive,
    file: File,
  };

  const Icon = iconMap[iconType] || iconMap.file;

  return <Icon className={className} />;
}

// ============================================================================
// List View Row Component
// ============================================================================

interface FileRowProps {
  item: Readonly<FileSystemItem>;
  isSelected: boolean;
  isExpanded: boolean;
  level: number;
  onSelect: () => void;
  onToggle: () => void;
  onOpen: (e: React.MouseEvent) => void;
}

function FileRow({
  item,
  isSelected,
  isExpanded,
  level,
  onSelect,
  onToggle,
  onOpen,
}: FileRowProps) {
  const paddingLeft = `${level * 16 + 12}px`;

  return (
    <div
      role="treeitem"
      aria-selected={isSelected}
      aria-expanded={item.kind === "folder" ? isExpanded : false}
      tabIndex={0}
      className={cn(
        "flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors",
        "hover:bg-accent/50",
        isSelected && "bg-accent"
      )}
      style={{ paddingLeft }}
      onClick={() => {
        onSelect();
        if (item.kind === "folder") {
          onToggle();
        }
      }}
      onDoubleClick={(e) => {
        if (item.kind === "file") {
          onOpen(e);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          if (item.kind === "folder") {
            onToggle();
          } else {
            onOpen(e as unknown as React.MouseEvent);
          }
        }
      }}
    >
      {/* Expand/Collapse Chevron */}
      <span className="w-4 h-4 flex items-center justify-center text-muted-foreground">
        {item.kind === "folder" && (
          <svg
            className={cn("w-3 h-3 transition-transform", isExpanded && "rotate-90")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
      </span>

      {/* Icon */}
      <FileIcon item={item} className="w-4 h-4 flex-shrink-0 text-foreground" />

      {/* Name */}
      <span className="flex-1 truncate text-sm">{item.name}</span>

      {/* File size (files only) */}
      {item.kind === "file" && (
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatFileSize(item.size)}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export interface FileSystemRef {
  /** Open a specific file programmatically */
  openFile: (path: string) => void;
  /** Expand/collapse a folder */
  toggleFolder: (path: string, isOpen: boolean) => void;
  /** Clear selection */
  clearSelection: () => void;
}

const FileSystem = React.forwardRef<FileSystemRef, FileSystemProps>(
  (
    {
      items,
      onFileOpen,
      onFolderToggle,
      onSelectionChange,
      view = "list",
      className,
      height = "h-96",
    },
    ref
  ) => {
    // Expanded folders state (by path) - for list view
    const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(
      new Set()
    );
    // Selected item
    const [selectedItem, setSelectedItem] = React.useState<FileSystemItem | null>(
      null
    );
    // Current folder path for icons view (null = root)
    const [currentFolderPath, setCurrentFolderPath] = React.useState<string | null>(
      null
    );

    // Build tree structure
    const tree = React.useMemo(() => buildTree(items), [items]);

    // Flatten tree for list view
    const flattenedItems = React.useMemo(
      () => flattenTreeItems(tree, expandedFolders),
      [tree, expandedFolders]
    );

    // Get items for current folder (icons view)
    const currentFolderItems = React.useMemo(() => {
      return tree.get(currentFolderPath) || [];
    }, [tree, currentFolderPath]);

    // Build breadcrumb path segments
    const breadcrumbParts = React.useMemo(() => {
      if (!currentFolderPath) return [];
      return currentFolderPath.split("/");
    }, [currentFolderPath]);

    // Imperative API
    React.useImperativeHandle(ref, () => ({
      openFile: (path: string) => {
        const file = items.find((i) => i.path === path && i.kind === "file");
        if (file) {
          // Auto-expand all parent folders so the item is visible in list view
          const parents = getParentFolders(path);
          setExpandedFolders((prev) => {
            const next = new Set(prev);
            parents.forEach((p) => next.add(p));
            return next;
          });
          setSelectedItem(file);
          onFileOpen?.(file, { preventDefault: () => {} } as React.MouseEvent);
        }
      },
      toggleFolder: (path: string, isOpen: boolean) => {
        setExpandedFolders((prev) => {
          const next = new Set(prev);
          if (isOpen) {
            next.add(path);
          } else {
            next.delete(path);
          }
          return next;
        });
      },
      clearSelection: () => setSelectedItem(null),
    }));

    // Handlers
    const handleSelect = React.useCallback(
      (item: FileSystemItem) => {
        setSelectedItem(item);
        onSelectionChange?.(item);
      },
      [onSelectionChange]
    );

    const handleToggle = React.useCallback(
      (folder: FileSystemItem) => {
        const isCurrentlyExpanded = expandedFolders.has(folder.path);
        const newIsExpanded = !isCurrentlyExpanded;

        setExpandedFolders((prev) => {
          const next = new Set(prev);
          if (newIsExpanded) {
            next.add(folder.path);
          } else {
            next.delete(folder.path);
          }
          return next;
        });

        onFolderToggle?.(folder, newIsExpanded);
      },
      [expandedFolders, onFolderToggle]
    );

    const handleOpen = React.useCallback(
      (item: FileSystemItem) => (e: React.MouseEvent) => {
        setSelectedItem(item);
        onFileOpen?.(item, e);
      },
      [onFileOpen]
    );

    // Navigate to parent folder in icons view
    const navigateToParent = React.useCallback(() => {
      if (!currentFolderPath) return;
      const parts = currentFolderPath.split("/");
      parts.pop();
      setCurrentFolderPath(parts.length > 0 ? parts.join("/") : null);
      setSelectedItem(null);
    }, [currentFolderPath]);

    // Navigate to specific breadcrumb segment
    const navigateToBreadcrumb = React.useCallback(
      (index: number) => {
        if (index === -1) {
          setCurrentFolderPath(null);
        } else {
          const parts = breadcrumbParts.slice(0, index + 1);
          setCurrentFolderPath(parts.join("/"));
        }
        setSelectedItem(null);
      },
      [breadcrumbParts]
    );

    // List View
    if (view === "list") {
      return (
        <div
          className={cn(
            "flex flex-col overflow-auto rounded-lg border bg-background",
            height,
            className
          )}
          role="tree"
          aria-label="File system"
        >
          {flattenedItems.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No items
            </div>
          ) : (
            flattenedItems.map(({ item, level }) => (
              <FileRow
                key={item.key}
                item={item}
                level={level}
                isSelected={selectedItem?.path === item.path}
                isExpanded={expandedFolders.has(item.path)}
                onSelect={() => handleSelect(item)}
                onToggle={() => handleToggle(item)}
                onOpen={handleOpen(item)}
              />
            ))
          )}
        </div>
      );
    }

    // Icons View (grid with drill-down)
    return (
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-lg border bg-background",
          height,
          className
        )}
        role="grid"
        aria-label="File system"
      >
        {/* Breadcrumb / Navigation bar */}
        <div className="flex items-center gap-1 px-3 py-2 border-b bg-muted/30">
          {currentFolderPath && (
            <button
              onClick={navigateToParent}
              className={cn(
                "p-1 rounded hover:bg-accent transition-colors",
                "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Go back"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Root */}
          <button
            onClick={() => navigateToBreadcrumb(-1)}
            className={cn(
              "text-xs px-2 py-1 rounded hover:bg-accent transition-colors",
              !currentFolderPath && "bg-accent text-accent-foreground"
            )}
          >
            Root
          </button>

          {/* Breadcrumb segments */}
          {breadcrumbParts.map((part, index) => (
            <React.Fragment key={part}>
              <span className="text-muted-foreground text-xs">/</span>
              <button
                onClick={() => navigateToBreadcrumb(index)}
                className={cn(
                  "text-xs px-2 py-1 rounded hover:bg-accent transition-colors truncate max-w-[100px]",
                  index === breadcrumbParts.length - 1 &&
                    "bg-accent text-accent-foreground"
                )}
              >
                {part}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Grid content */}
        <div className="flex-1 overflow-auto p-4">
          {currentFolderItems.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Empty folder
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {currentFolderItems.map((item) => (
                <div
                  key={item.key}
                  role="gridcell"
                  tabIndex={0}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors",
                    "hover:bg-accent/50",
                    selectedItem?.path === item.path && "bg-accent"
                  )}
                  onClick={() => {
                    handleSelect(item);
                    if (item.kind === "folder") {
                      setCurrentFolderPath(item.path);
                    }
                  }}
                  onDoubleClick={(e) => {
                    if (item.kind === "file") {
                      handleOpen(item)(e);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (item.kind === "folder") {
                        setCurrentFolderPath(item.path);
                      } else {
                        handleOpen(item)(e as unknown as React.MouseEvent);
                      }
                    }
                  }}
                >
                  <FileIcon
                    item={item}
                    className="w-12 h-12 text-foreground"
                  />
                  <span className="text-xs text-center truncate w-full">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

FileSystem.displayName = "FileSystem";

export { FileSystem };
