## Mô tả

Component hiển thị cây thư mục dạng danh sách hoặc icons với drill-down navigation, lấy dữ liệu từ flat array và tự động suy ra hierarchy từ path. Callback `onFileOpen` giúp bạn xử lý mở file theo cách riêng — không bị trói buộc vào PDF/DOCX viewer nặng.

**Icons view:** click folder → drill-down vào folder đó (giống Finder macOS). Dùng breadcrumb hoặc nút Back để quay lại.

**List view:** click folder → expand tại chỗ, hiện nested items.

## Props

| Tên | Kiểu | Mặc định | Mô tả |
|-----|------|----------|-------|
| `items` | `FileSystemItem[]` | — | **Bắt buộc.** Danh sách phẳng tất cả files và folders |
| `onFileOpen` | `(file, event) => void` | — | Callback khi double-click file |
| `onFolderToggle` | `(folder, isOpen) => void` | — | Callback khi expand/collapse folder (list view) |
| `onSelectionChange` | `(item) => void` | — | Callback khi chọn item |
| `view` | `"list" \| "icons"` | `"list"` | Chế độ hiển thị |
| `height` | `string` | `"h-96"` | Chiều cao container (Tailwind class) |
| `className` | `string` | — | CSS class bổ sung |

### FileSystemItem

| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| `key` | `string` | Unique key cho React list |
| `kind` | `"file" \| "folder"` | Loại item |
| `path` | `string` | Full path, dùng để suy ra hierarchy |
| `name` | `string` | Tên hiển thị |
| `contentType` | `string` | MIME type (cho files) |
| `size` | `number` | Kích thước bytes (cho files) |
| `hasChildren` | `boolean` | Folder có nested items chưa load |
| `children` | `FileSystemItem[]` | Nested items (optional) |

### FileSystemRef (imperative handle)

| Phương thức | Mô tả |
|-------------|-------|
| `openFile(path)` | Mở file theo path. Tự động expand toàn bộ folder cha để hiện item. |
| `toggleFolder(path, isOpen)` | Expand/collapse folder theo path |
| `clearSelection()` | Xoá selection |

> **Lưu ý:** `openFile()` hiện chỉ đảm bảo hiển thị đúng khi component đang ở `view="list"`. Gọi khi đang ở `view="icons"` sẽ chọn đúng file nhưng không tự chuyển drill-down tới đúng thư mục.

## Ví dụ dùng

### List View (mặc định)

```tsx
"use client";

import { FileSystem } from "@/components/ui/file-system";

const items = [
  { key: "1", kind: "folder", path: "documents", name: "Documents" },
  { key: "2", kind: "file", path: "documents/report.pdf", name: "Report.pdf", size: 102400 },
  { key: "3", kind: "folder", path: "images", name: "Images" },
  { key: "4", kind: "file", path: "images/photo.jpg", name: "photo.jpg", size: 512000 },
];

export default function FileExplorer() {
  const handleFileOpen = (file) => {
    console.log("Open:", file.path);
    // Hook vào PDF viewer, image viewer, etc.
  };

  return (
    <FileSystem
      items={items}
      view="list"
      onFileOpen={handleFileOpen}
    />
  );
}
```

### Icons View (drill-down)

```tsx
<FileSystem items={items} view="icons" />
```

Click folder → drill-down vào. Dùng nút Back hoặc breadcrumb để quay lại.

### Với ref để control từ code

```tsx
"use client";

import { useRef } from "react";
import { FileSystem } from "@/components/ui/file-system";

export default function Demo() {
  const fileSystemRef = useRef(null);

  const handleOpenFile = (file) => {
    // Mở file...
  };

  return (
    <>
      <button onClick={() => fileSystemRef.current.openFile("documents/report.pdf")}>
        Open Report
      </button>
      <FileSystem ref={fileSystemRef} items={items} onFileOpen={handleOpenFile} />
    </>
  );
}
```
