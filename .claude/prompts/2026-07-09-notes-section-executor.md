Đọc CLAUDE.md. Sau khi xong chạy: `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`. Không cần test mới cho notes.ts, không cần `npm run test:coverage`. **KHÔNG commit, KHÔNG push.**

## Subtask

Dựng section Notes (ghi chú kiến thức cá nhân) — hệ thống độc lập thứ 2, tách hoàn toàn khỏi component registry.

## Phản biện / code hiện tại (Supervisor đã verify)

- Chưa có global nav — chỉ có sidebar category trong `src/app/components/layout.tsx`. Cần tạo `SiteNav` tối giản + gắn root layout.
- Markdown render qua `src/components/MarkdownDocs.tsx` + `compileMarkdownToJsx()` (`src/lib/markdown-code.tsx`), KHÔNG dùng `<ReactMarkdown>`.
- `gray-matter` chưa có trong repo, không xung đột — được phép cài.
- Pattern data layer: mirror `src/lib/registry.ts` (sync fs, `getAllCategories`-style helpers).
- Next.js 16: `params` là `Promise<{ slug: string }>`.

## Mục tiêu

- `content/notes/` có ≥1 file `.md` mẫu, đọc qua `src/lib/notes.ts`.
- Route `/notes` (list group theo category) và `/notes/[slug]` (chi tiết, URL phẳng) hoạt động, đúng theme Cursor.
- Spec `.claude/docs/specs/2026-07-08-notes-section-design.md` và skill `.claude/skills/notes-distillation/SKILL.md` tồn tại.
- `CLAUDE.md`: thêm 1 dòng trỏ skill `notes-distillation`.
- Nav chính: mục "Notes" ngang hàng "Components".

## Không phải mục tiêu

- Không đụng `registry.json`, `registry/**`, `src/lib/registry.ts`.
- Không SEO/RSS/comment/draft workflow.
- Không @modal parallel route cho notes.
- Không thêm dependency ngoài `gray-matter`.
- Không tạo route `/notes/[category]` — chỉ `/notes` và `/notes/[slug]`.

## Kiểm tra

- `npm run dev` → `/notes` list + `/notes/<slug>` detail render đúng theme, không lỗi console.
- `npx tsc --noEmit` sạch.
- `npm run lint` sạch.
- `npm run build` pass.
- `npm test` — toàn bộ test cũ vẫn pass.

## File tạo mới

| Path | Mô tả |
|------|-------|
| `content/notes/<slug>.md` | ≥1 note mẫu (frontmatter đủ field bắt buộc) |
| `src/lib/notes.ts` | Đọc `content/notes/*.md`, parse gray-matter, export helpers |
| `src/app/notes/layout.tsx` | Sidebar category derive động từ frontmatter |
| `src/app/notes/page.tsx` | Danh sách group theo category |
| `src/app/notes/[slug]/page.tsx` | Chi tiết note |
| `src/components/SiteNav.tsx` | Top nav 2 link: Components \| Notes |
| `.claude/docs/specs/2026-07-08-notes-section-design.md` | Dán spec bên dưới nguyên văn |
| `.claude/skills/notes-distillation/SKILL.md` | Quy trình chưng cất note (song song component-distillation) |

## File sửa

| Path | Thay đổi |
|------|----------|
| `src/app/layout.tsx` | Gắn `<SiteNav />` trước `{children}` |
| `CLAUDE.md` | Thêm 1 dòng trỏ `notes-distillation` skill |
| `package.json` | Thêm `gray-matter` (chỉ dep này) |

## `src/lib/notes.ts` — API gợi ý (mirror registry.ts)

```ts
export interface NoteMeta {
  title: string;
  categories: string[];
  tags?: string[];
  date: string; // ISO date
  description: string;
  source?: string;
}

export interface Note extends NoteMeta {
  slug: string;
  content: string; // body sau frontmatter, không gồm YAML
}

// getAllNotes(): Note[]
// getNoteBySlug(slug): Note | null
// getAllNoteCategories(): string[] — unique, sorted, từ categories[] tất cả note
// getNotesByCategory(category): Note[] — filter notes có categories.includes(category)
```

Quy ước implementation:

- `NOTES_DIR = path.join(process.cwd(), "content/notes")`
- Slug = tên file không `.md`
- Validate field bắt buộc (title, categories, date, description); file thiếu → bỏ qua + log warn (hoặc throw rõ — chọn 1, nhất quán)
- Trả `content` là body sau frontmatter

## UI — mirror pattern có sẵn

### Sidebar

Copy shell từ `src/app/components/layout.tsx`:

- `flex min-h-screen bg-canvas`, `aside w-64 border-r border-hairline`
- `text-caption-uppercase`, `nav-link`, `category.replaceAll("-", " ")`
- Link category → `/notes#<category>` (anchor trên cùng trang `/notes`, KHÔNG route riêng)
- Mỗi section trên `/notes` page có `id="<category>"` để anchor hoạt động

### List page (`/notes`)

Group theo category (note nhiều category → hiện ở mỗi group):

- Typography: `text-display-sm`, `text-title-md`, `text-body-md`
- Link note → `/notes/[slug]` (không category trong URL)
- Hiện title, description, date

### Detail page (`/notes/[slug]`)

Mirror `ComponentDetail` grid (bỏ demo/install):

- `component-detail-layout` + `component-detail-main` + `component-detail-toc`
- Header: title, date, categories, tags, link `source` nếu có
- Body: `<MarkdownDocs content={body} />`
- TOC: `<TableOfContents content={body} />`
- `generateStaticParams()` từ `getAllNotes()`; slug không tồn tại → `notFound()`

### SiteNav

Theo `.claude/docs/DESIGN-cursor.md` section `top-nav`:

- `bg-canvas`, `text-ink`, height ~64px, `border-b border-hairline`
- Link: `/components/file-system` (hoặc `/components`) + `/notes`
- Dùng class `nav-link` hoặc pattern tương đương trong `globals.css`

## Note mẫu gợi ý

`content/notes/zero-trust-basics.md` — category `network-security`, có code block để verify syntax highlight terminal tối.

## SPEC — dán nguyên vào `.claude/docs/specs/2026-07-08-notes-section-design.md`

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

## Báo cáo khi xong

1. Bảng M/A/D toàn bộ file đã tạo/sửa
2. Kết quả tsc / lint / test / build
3. URL đã kiểm tra tay
4. Không commit — chờ coordinator review
