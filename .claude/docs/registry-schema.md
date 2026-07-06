# Schema của registry.json

Tài liệu tham chiếu đầy đủ cho cấu trúc `registry.json` ở root repo.
`registry.json` viết trực tiếp theo schema chính thức của shadcn — không có
lớp chuyển đổi riêng, không có script tự viết. Sinh `public/r/<name>.json`
bằng lệnh CLI chính thức:

```bash
npx shadcn build
```

Lệnh này tự đọc `registry.json`, mở từng file khai báo trong `files[].path`,
nhúng nguyên mã nguồn vào field `content`, rồi ghi ra `public/r/<name>.json`
— đây là file mà `npx shadcn add <url>` thực sự tải về khi cài. Không viết
script riêng để làm lại việc này (dễ quên nhúng `content`, gây lỗi "No files
updated" khi cài).

## Field chuẩn shadcn (bắt buộc theo schema chính thức)

| Field         | Kiểu   | Mô tả                                                                |
|---------------|--------|-------------------------------------------------------------------------|
| `name`        | string | Định danh duy nhất, kebab-case. Dùng làm URL, tên file JSON, không cần field `slug` riêng. |
| `type`        | string | `registry:component`, `registry:block`, `registry:ui`...                |
| `description` | string | Mô tả ngắn, 1-2 câu.                                                     |
| `files`       | array  | Danh sách file thuộc component (`path`, `type`).                        |

## Field chuẩn shadcn (tuỳ chọn, dùng khi cần)

| Field                   | Kiểu   | Mô tả                                                          |
|-------------------------|--------|-------------------------------------------------------------------|
| `title`                 | string | Tên hiển thị dễ đọc (VD: "Primary Glow Button").                  |
| `categories`            | array  | Nhóm sidebar, mảng string (VD: `["button"]`). Thay cho `category` số ít tự chế. |
| `dependencies`          | array  | Package npm cần cài kèm (VD: `["@radix-ui/react-popover"]`).      |
| `registryDependencies`  | array  | Component khác trong registry mà component này phụ thuộc.         |

## Field tuỳ biến — bắt buộc gom vào `meta`

Schema chính thức có sẵn field `meta` dành riêng cho dữ liệu tuỳ biến. Mọi
field không thuộc danh sách chuẩn ở trên (`designRationale`,
`inspirationSource`, `tags`, `version`...) phải nằm trong `meta`, không đặt
thẳng ở top-level — tránh lệch chuẩn khi CLI hoặc tool khác đọc file.

```json
"meta": {
  "designRationale": "...",
  "inspirationSource": { "...": "..." },
  "tags": ["file-system", "drag-drop"],
  "version": "1.0.0"
}
```

## Cấu trúc `inspirationSource`

```json
{
  "platform": "21st.dev",
  "url": "https://21st.dev/@extend-hq/components/file-system",
  "author": "extend-hq",
  "licenseStatus": "reviewed-rewritten"
}
```

`licenseStatus` nhận một trong ba giá trị, khớp với phân loại trong
`license-checklist.md`: `reviewed-safe-reference`, `reviewed-rewritten`,
`rejected` (nếu `rejected` thì không được có mặt trong registry — giá trị
này chỉ dùng cho mục đích ghi log nội bộ nếu cần).

## Ví dụ một entry đầy đủ (JSON sinh ra trong public/r/)

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "file-system-explorer",
  "title": "File System Explorer",
  "type": "registry:component",
  "description": "Cây thư mục có thể mở rộng, kéo-thả, đổi tên inline.",
  "categories": ["file-system"],
  "dependencies": ["@pierre/trees"],
  "registryDependencies": [],
  "files": [
    { "path": "registry/file-system-explorer/index.tsx", "type": "registry:component" }
  ],
  "meta": {
    "designRationale": "Ưu tiên feedback tức thời khi drag — highlight vùng thả trước khi drop, tránh người dùng thả nhầm thư mục.",
    "inspirationSource": {
      "platform": "21st.dev",
      "url": "https://21st.dev/@extend-hq/components/file-system",
      "author": "extend-hq",
      "licenseStatus": "reviewed-rewritten"
    },
    "tags": ["file-system", "drag-drop", "tree"],
    "version": "1.0.0"
  }
}
```

`registry.json` ở root viết y hệt cấu trúc trên (không có `content` — CLI tự
nhúng lúc build), chỉ khác là bọc trong `{ "items": [...] }`. Muốn thêm
component mới, sửa trực tiếp `registry.json`, chạy lại `npx shadcn build`.

## docs.md — không phải một phần của schema shadcn

Mỗi component có thêm `registry/<name>/docs.md` (tiếng Việt, khung 4 phần:
Mô tả, Cài đặt, Props, Ví dụ dùng — xem `component-distillation/SKILL.md`).
File này **không** liệt kê trong `files[]` của registry.json, vì bất cứ file
nào trong `files[]` sẽ bị `shadcn add` copy thẳng vào project của người cài.
Docs tiếng Việt là để trang catalog của chính mình đọc và hiển thị, không
phải thứ đi kèm khi người khác cài component.

## Quy tắc version

Đặt trong `meta.version`, theo SemVer:

- `1.0.0` → `1.x.0`: thêm prop mới, không phá vỡ code cũ.
- `1.x.0` → `2.0.0`: đổi tên prop, đổi behavior mặc định, hoặc đổi cấu trúc
  file — bất kỳ thay đổi nào bắt người dùng cũ phải sửa code khi update.
- Không tăng version cho sửa lỗi nhỏ không ảnh hưởng API (patch không bắt
  buộc phải track riêng ở quy mô solo).