# CLAUDE.md

> Điều phối 3 tầng: Cursor **soạn prompt** cho founder paste Claude Code — không tự sửa file, không gọi `claude -p` thay founder (trừ khi founder nói "em làm"/"Cursor làm"). Soạn prompt: `.claude/skills/executor-prompt/SKILL.md`. Protocol: `.claude/docs/coordination-protocol.md`.

Bối cảnh nền cho Claude Code khi làm việc trong repo này. Đọc file này mỗi phiên, bất kể đang làm task gì.

## Repo này là gì

Đây là **registry component cá nhân** — kho lưu trữ các UI component (Button, File System, Rich Text, Animation...) đã được founder tự nghiên cứu, chọn lọc và "chưng cất" lại theo phong cách thiết kế riêng, để dùng lại cho nhiều dự án SaaS khác nhau.

Mục tiêu public: **ai cũng xem và cài được**, không cần đăng nhập, không lưu dữ liệu người dùng runtime. Cài component bằng:

```bash
npx shadcn@latest add https://<domain-cua-anh>/r/<name>.json
```

## Stack

- Next.js (App Router, thư mục `src/app/`) — vừa là trang catalog hiển thị component, vừa là nguồn code, vừa là điểm phát JSON tĩnh cho lệnh `shadcn add`.
- Không dùng Supabase, không auth, không database. Site này thuần đọc/tĩnh.
- Deploy: Vercel, tự động từ nhánh `main`.
- Sinh `public/r/*.json` bằng lệnh CLI chính thức `npx shadcn build` — không viết script riêng để làm lại việc này.

## Cấu trúc thư mục

```
src/app/
  components/
    [category]/
      page.tsx              # trang danh sách theo nhóm (Button, File System...)
      layout.tsx             # render @modal slot
      @modal/
        default.tsx          # bắt buộc, return null
        (.)[slug]/
          page.tsx            # nội dung khi bấm từ danh sách (hiện như popup)
      [slug]/
        page.tsx              # trang đầy đủ khi truy cập trực tiếp / F5 / share link
registry/
  <name>/                    # source code thật của từng component
registry.json                # theo đúng schema chính thức shadcn (xem .claude/docs/registry-schema.md)
public/r/
  <name>.json                # sinh tự động bởi `npx shadcn build`, Vercel serve tĩnh
.claude/
  skills/component-distillation/SKILL.md
  docs/registry-schema.md
  docs/license-checklist.md
  docs/coordination-protocol.md
```

## Quy ước đặt tên

- `name`: kebab-case, duy nhất trong toàn registry, dùng làm URL và tên file JSON (`primary-glow-button`). Không có field `slug` riêng.
- `categories`: mảng string, dùng để nhóm hiển thị ở sidebar (`["button"]`, `["file-system"]`).
- Route `[slug]/page.tsx` và `@modal/(.)[slug]/page.tsx` phải gọi chung một component hiển thị duy nhất (`<ComponentDetail />`), không viết trùng logic.

## Lệnh thường dùng

```bash
npm run dev              # chạy local
npm run build             # build production
npm test                  # chạy toàn bộ test (Vitest)
npm run test:coverage     # test + coverage (dùng trước push / SonarCloud)
npx shadcn build           # sinh public/r/*.json từ registry.json
```

**Windows:** chạy npm từ `C:\Users\tiet.vinh-phu1\Downloads\library-component`, không từ UNC `\\localhost\c$\...`.

## Quality Gate — sau khi viết/sửa code

Trước khi báo hoàn thành hoặc `git push`, đọc và làm đủ checklist trong
`.claude/skills/quality-gate/SKILL.md`: viết test → `npm test` → `npm run test:coverage`
→ `npm run build` → CI SonarQube Cloud pass.

## Nguyên tắc làm việc

Việc gì đã bắt tay làm phải xong hẳn rồi mới chuyển sang việc khác — không để lại lỗi đã biết hoặc nợ kỹ thuật "để sau", vì "sau" dễ quên. Khi tự review code vừa viết:

- Bug ảnh hưởng đúng chức năng đã khai báo (props, docs.md, description) — bắt buộc sửa trước khi báo hoàn thành, không liệt kê như "known issue" rồi cho qua.
- Giới hạn phạm vi có chủ đích (ví dụ: v1 chưa hỗ trợ tính năng X) — được phép, nhưng phải ghi rõ trong docs.md, không âm thầm bỏ qua.
- Trước khi báo "hoàn thành", tự hỏi: nếu người lạ cài component này qua `npx shadcn add` ngay bây giờ, có gặp hành vi khác với những gì docs.md mô tả không? Nếu có, chưa được coi là xong.

## Khi cần thêm component mới

Không tự viết ngay ở đây — đọc `.claude/skills/component-distillation/SKILL.md` để theo đúng quy trình (kiểm tra license nguồn trước khi bắt tay build).