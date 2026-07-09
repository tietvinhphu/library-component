---
name: notes-distillation
description: Chưng cất ghi chú kiến thức cá nhân từ nguồn (bài viết, tài liệu, video) thành file .md trong content/notes/. Song song với component-distillation nhưng cho kiến thức văn bản thay vì code.
trigger: Thêm note mới, chưng cất note, viết ghi chú, tạo note từ nguồn X
---

# Notes Distillation — Quy trình chưng cất ghi chú kiến thức

## Khi nào dùng skill này

- Founder tìm được bài viết/bài post/video YouTube và muốn chưng cất thành note riêng
- Cần ghi lại kiến thức học được từ dự án, khách hàng, hoặc incident
- Viết lại tài liệu kỹ thuật bằng lời riêng để tra cứu sau này

## Trước khi bắt đầu

1. **Ghi lại nguồn** — URL gốc, nếu có, sẽ điền vào frontmatter `source`
2. **Đọc hiểu nguồn** — không cần đọc từng chữ, nhưng phải nắm được ý chính
3. **Đặt tên slug** — chọn tên ngắn, mô tả, kebab-case. VD: `zero-trust-basics`, `aws-iam-best-practices`, `iso-27001-gap-analysis`

## Quy trình 5 bước

### Bước 1 — Nghĩ về người đọc

Trước khi viết bất cứ gì, tự hỏi: **"6 tháng sau, mình mở lại note này, mình cần nhớ gì?"**

Note phục vụ tra cứu cá nhân, không phải SEO. Viết để mình hiểu khi quên, không phải để người lạ hiểu lần đầu.

### Bước 2 — Viết frontmatter

```yaml
---
title: <Tên đầy đủ, rõ ràng>
categories:
  - <category chính>
  - <category phụ nếu có>
tags:
  - <tag 1>
  - <tag 2>
date: "<YYYY-MM-DD>"
description: "<1-2 câu tóm tắt, đủ để nhớ lại nội dung>"
source: <URL nguồn nếu có, bỏ trống nếu không>
---
```

**Quy tắc categories:**
- Dùng domain knowledge, không UI pattern. VD: `network-security`, `cloud-security`, `iso-27001`, `saas-building`
- Không dùng chung category với component registry (button, file-system...)
- Mỗi note có thể thuộc nhiều category

**Quy tắc tags:**
- Từ khóa cụ thể để lọc/tra cứu. VD: `zero-trust`, `iam`, `mfa`, `encryption`
- Không bắt buộc, nhưng có thì hữu ích

### Bước 3 — Viết nội dung

**Nguyên tắc viết:**

- **Viết bằng lời mình** — không copy nguyên văn từ nguồn. Tóm tắt, diễn giải, thêm ví dụ từ kinh nghiệm cá nhân.
- **Cấu trúc rõ ràng** — dùng heading (##, ###) để phân chia ý.
- **Ví dụ cụ thể** — code snippet, config, command line đều tốt.
- **Link khi có thể** — thay vì copy nội dung dài, ghi link + tóm tắt.
- **Bảng là bạn** — so sánh, checklist, framework dễ tra cứu bằng bảng.

**Độ dài:**
- Tối thiểu: đủ frontmatter + 3 heading + 1 code block hoặc bảng
- Không có maximum — note dài 2000 dòng vẫn OK nếu nội dung liên quan

### Bước 4 — Lưu file

```
content/notes/<slug>.md
```

### Bước 5 — Verify

```bash
npm run dev
# Mở http://localhost:3000/notes/<slug>
# Kiểm tra:
#   - Title hiển thị đúng
#   - Date, categories, tags đúng
#   - Nội dung markdown render đúng (heading, code block, table)
#   - Source link hoạt động (nếu có)
#   - TOC hoạt động (click vào heading trong TOC → scroll đến)
#   - Console không lỗi

npm run build
# Phải pass không lỗi
```

## Ví dụ

**Nguồn:** https://www.cloudflare.com/learning/security/glossary/what-is-zero-trust/

**Slug:** `zero-trust-basics`

**Frontmatter:**
```yaml
---
title: Zero Trust Architecture — Nền tảng bảo mật cho SaaS hiện đại
categories:
  - network-security
  - cloud-security
tags:
  - zero-trust
  - identity
  - microsegmentation
date: "2026-06-15"
description: Nguyên tắc Zero Trust và cách triển khai cho hệ thống cloud-native. Phân biệt Zero Trust với perimeter-based security truyền thống.
source: https://www.cloudflare.com/learning/security/glossary/what-is-zero-trust/
---
```

## Không phải mục tiêu

- Không cần test như component (note không có logic React)
- Không cần Quality Gate coverage
- Không cần demo.tsx hoặc install command
- Không cần SEO optimization

## Từ chối gracefully

Nếu nguồn:
- Quá ngắn (< 500 từ, không có gì đáng ghi)
- Quá trừu tượng/bài quảng cáo (không có thông tin thực)
- Đã có note tương tự trong repo (check trước bằng grep)

→ Nói rõ lý do, không viết note vì "đã hứa".
