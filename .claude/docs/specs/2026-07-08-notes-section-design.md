# Notes — thiết kế section ghi chú kiến thức cá nhân

Ngày: 2026-07-08

## Mục đích

Ghi chép kiến thức có hệ thống cho founder (network/security/cloud/ISO 27001/SaaS building...), tra cứu lại là ưu tiên chính — public chỉ là hệ quả phụ, không tối ưu SEO/audience/traffic.

## Kiến trúc

Tách hoàn toàn khỏi component registry — không dùng chung registry.json (vi phạm schema chính thức shadcn nếu nhét note vào đó), không dùng chung taxonomy (category component theo UI-pattern, category note theo domain kiến thức — không giao nhau).

## Nav & Route

- Nav label: "Notes", ngang hàng mục component hiện tại.
- Route: `/notes` (danh sách, group theo category), `/notes/[slug]` (chi tiết — phẳng, KHÔNG có category trong URL vì 1 note có thể thuộc nhiều category).

## Taxonomy

Không định nghĩa trước. Category xuất hiện khi có note đầu tiên gắn category đó — cùng cách component registry đang vận hành (hiện chỉ có "File System").

## Data model (frontmatter, file phẳng content/notes/\<slug\>.md)

| Field | Bắt buộc | Ghi chú |
|---|---|---|
| title | có | |
| categories | có | mảng string |
| tags | không | lọc thêm |
| date | có | ISO date |
| description | có | tóm tắt ngắn |
| source | không | link nguồn nếu chưng cất từ bài viết ngoài |

Không có trạng thái draft — file tồn tại trong content/notes/ nghĩa là đã publish, giữ đúng tinh thần "thuần tĩnh" của site.

## Rendering

Dùng lại nguyên pipeline docs.md hiện có: unified + remark-gfm + rehype-pretty-code qua `MarkdownDocs` (`src/lib/markdown-code.tsx`). Không thêm renderer khác, không cần MDX vì note không nhúng component React sống.

## UI

- `src/app/notes/layout.tsx`: sidebar category, derive động từ frontmatter tất cả note (giống cách Categories sidebar component đang derive từ registry.json).
- `src/app/notes/page.tsx`: danh sách group theo category, mỗi note hiện title/description/date.
- `src/app/notes/[slug]/page.tsx`: chi tiết, hiện title/date/categories/tags, link source nếu có, render nội dung.
- `src/lib/notes.ts`: đọc content/notes/*.md, parse frontmatter (gray-matter).
- KHÔNG cần @modal parallel route như component (đó là cho live preview code — note không cần quick-preview phức tạp vậy).

## Quy trình chưng cất (.claude/skills/notes-distillation/SKILL.md, song song component-distillation nhưng khác đầu ra — không registry.json/demo.tsx/install cmd)

1. Ghi lại nguồn nếu có → điền vào frontmatter `source`.
2. Viết lại bằng lời riêng, không copy nguyên văn dài từ nguồn — cùng nguyên tắc bản quyền đang áp cho component, đổi đối tượng từ code sang văn bản.
3. Viết nội dung, điền đủ frontmatter, lưu content/notes/\<slug\>.md.
4. npm run dev kiểm tra render, npm run build + lint sạch. Không cần Quality Gate coverage như component (không có logic React để test).

## Non-goals (rõ ràng, tránh scope creep)

- Không SEO đầu tư (không sitemap ưu tiên, không OG image tự động).
- Không comment, không newsletter, không RSS ở v1.
- Không pillar thứ 3 — chưa định hình, không thiết kế trước (YAGNI).
- Không trạng thái draft/workflow duyệt bài phức tạp.

## DỪNG LẠI VÀ HỎI TRƯỚC KHI

- `gray-matter` xung đột với cách đọc frontmatter khác đã có sẵn trong repo
- Có ≥2 cách hợp lý để derive sidebar category động (build-time vs runtime) — lựa chọn ảnh hưởng kiến trúc, không tự quyết
- Một lỗi không tự sửa được sau 2 lần thử
- Bất kỳ thay đổi nào vượt phạm vi đã nêu ở trên

## CHECKPOINT

Sau mỗi bước lớn, in: ✅ [việc vừa xong].
