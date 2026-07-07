---
name: component-distillation
description: >-
  Dùng skill này khi founder tìm được một component tham khảo (từ 21st.dev,
  hoặc nguồn khác) và muốn "chưng cất" lại thành component riêng để thêm vào
  registry cá nhân. Trigger khi user nói: thêm component mới, chưng cất
  component, build lại component từ nguồn X, hoặc dán link 21st.dev/nguồn khác
  kèm ý định đưa vào registry.
---

# Quy trình chưng cất component vào registry cá nhân

Mục tiêu: biến một component tham khảo từ nguồn ngoài thành một entry hoàn
chỉnh, sạch license, đúng schema chính thức shadcn, có trong registry.json và
có thể cài bằng `npx shadcn add`.

## Các bước

### 1. Xác định nguồn tham khảo

Ghi lại: tên component, link nguồn gốc thật sự (không chỉ nơi thấy đầu tiên —
21st.dev thường mirror lại registry chính thức của tác giả, tìm bằng GitHub
để xác nhận license chính xác), tác giả/tổ chức xuất bản. Đây là dữ liệu điền
vào `meta.inspirationSource` trong registry.json.

### 2. Kiểm tra license nguồn — BẮT BUỘC trước khi code

Đọc `.claude/docs/license-checklist.md` và phân loại nguồn vào một trong ba
nhóm ở đó (dùng thẳng được tham khảo / phải viết lại toàn bộ không đọc code /
không được lấy). Không bỏ qua bước này dù nguồn trông "chỉ là component nhỏ".

Nếu nguồn rơi vào nhóm "không được lấy" — dừng lại, báo cho user, không tiếp
tục các bước sau.

### 3. Xác định phạm vi — tách phần lõi khỏi tính năng phụ nặng

Nếu component gốc kéo theo dependency nặng cho tính năng phụ (ví dụ: file
system kéo theo PDF/DOCX/XLSX viewer để preview khi mở file), không build
liền một khối như bản gốc. Tách phần lõi (state, tương tác chính) thành
component riêng, expose callback prop (ví dụ `onOpenFile(file)`) để nơi dùng
tự quyết định nối gì vào. Tính năng phụ nặng, nếu cần, chưng cất thành entry
registry riêng, category riêng — không ép người cài phải nhận toàn bộ chuỗi
dependency chỉ để dùng phần lõi.

### 4. Chốt visual direction (Open Design — tuỳ chọn)

Chỉ dùng bước này nếu founder muốn thử nhiều hướng màu sắc/spacing trước khi
build, hoặc muốn tận dụng một Design System có sẵn trong Open Design.

Prompt cho Open Design cần nói rõ đây là **chốt hướng thị giác**, không phải
sinh code sản xuất:

> "Thiết kế visual direction cho component [tên]: màu chủ đạo, spacing,
> border-radius, typography. Không cần logic tương tác, không cần đúng
> framework — chỉ cần mockup tĩnh để tham khảo phong cách."

Không đưa output của Open Design thẳng vào registry. Output ở đây chỉ là
tài liệu tham khảo cho bước 5.

### 5. Build lại bằng Claude Code — viết mới, không copy

Viết component từ đầu theo schema chính thức shadcn, tham khảo (không copy)
logic tương tác của bản gốc, phạm vi đã chốt ở bước 3, và visual direction đã
chốt ở bước 4 (nếu có).

Yêu cầu kỹ thuật bắt buộc:
- TypeScript, functional component, có type cho toàn bộ props.
- Dùng token Tailwind chuẩn (`bg-background`, `border-border`...), không
  hard-code màu.
- `"use client"` nếu có state/interactivity.
- File nguồn đặt tên theo component (`primary-glow-button.tsx`), không dùng
  `index.tsx` — tránh nhiều component ghi đè lên cùng một file khi cài.
- Mọi package npm dùng trong code (kể cả nhỏ như `class-variance-authority`)
  phải khai báo trong `dependencies` của registry item — không phụ thuộc vào
  việc project người cài "tình cờ" đã có sẵn.

### 6. Viết docs.md — tài liệu tiếng Việt cho trang catalog

Tạo `registry/<name>/docs.md`, theo khung 4 phần:

```
## Mô tả
1-2 câu, component này giải quyết vấn đề gì.

## Cài đặt
npx shadcn@latest add https://<domain>/r/<name>.json

## Props
| Tên | Kiểu | Mặc định | Mô tả |
|-----|------|----------|-------|

## Ví dụ dùng
```tsx
// đoạn code ví dụ thực tế
```
```

Quan trọng: `docs.md` **không** đưa vào `files[]` của registry.json — field
đó là danh sách file sẽ bị copy thẳng vào project của người cài khi họ chạy
`shadcn add`. Docs tiếng Việt không nên xuất hiện trong repo của họ. File
này chỉ để trang catalog của chính mình đọc và hiển thị.

### 7. Thêm vào registry.json

Đọc `.claude/docs/registry-schema.md` để biết đầy đủ field theo schema chính
thức. Tối thiểu phải điền: `name`, `title`, `type`, `description`,
`categories`, `files`, và trong `meta`: `designRationale`, `inspirationSource`.

### 8. Quality Gate — test & coverage (bắt buộc trước push)

Đọc `.claude/skills/quality-gate/SKILL.md` và làm đủ checklist: viết test,
`npm test`, `npm run test:coverage`, `npm run build`. Không push nếu test fail
hoặc coverage file mới quá thấp.

### 9. Sinh JSON tĩnh và deploy

```bash
npx shadcn build      # sinh public/r/<name>.json từ registry.json
git add .
git commit -m "feat(registry): them component <name>"
git push
```

Vercel tự deploy từ `main`. Không cần thao tác thủ công thêm.

## Việc KHÔNG làm trong skill này

- Không tạo tài khoản, auth, hay bảng database cho component mới — registry
  này thuần đọc/tĩnh (xem CLAUDE.md).
- Không copy nguyên văn code từ nguồn tham khảo, kể cả khi nguồn là MIT —
  viết lại theo convention riêng của registry (đặt tên prop, cấu trúc file
  có thể khác bản gốc).
- Không viết script riêng để sinh public/r/*.json — dùng lệnh chính thức
  `npx shadcn build`.