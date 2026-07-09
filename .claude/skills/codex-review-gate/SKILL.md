---
name: codex-review-gate
description: >-
  Bước bắt buộc sau khi Claude Code (Executor) báo xong task: founder chạy Codex
  plugin trong Claude Code để review độc lập. Trigger khi: Executor hoàn thành,
  chuẩn bị commit/PR, hoặc founder hỏi "review codex".
---

# Codex Review Gate

Mục tiêu: **không commit/push** khi chưa có pass review từ Codex plugin (read-only).

Cài đặt plugin: `.claude/docs/codex-plugin-setup.md`

## Khi nào chạy

- **Sau mọi task** Executor báo xong (quality-gate local đã pass)
- **Trước** founder (hoặc Coordinator) commit/push
- **Trước PR** — dùng `--base main`

## Checklist (founder chạy trong Claude Code)

### 1. Chọn lệnh review

| Tình huống | Lệnh |
|------------|------|
| Task thường, diff nhỏ | `/codex:review` |
| Nhiều file / review lâu | `/codex:review --background` → `/codex:status` → `/codex:result` |
| So với main trước merge | `/codex:review --base main` |
| Kiến trúc, auth, data loss, race | `/codex:adversarial-review <focus>` |

### 2. Đọc kết quả

- Issue **phải sửa** → quay lại Executor (prompt mới) hoặc Cursor Supervisor soạn fix
- Issue **chấp nhận được** → ghi rõ lý do trong PR/commit message (nếu có)
- Review sạch → sang bước commit

### 3. Nếu Codex yêu cầu sửa code

1. Sửa (Executor hoặc Cursor nếu founder chỉ định)
2. Chạy lại `.claude/skills/quality-gate/SKILL.md`
3. Chạy lại `/codex:review` trên diff mới

### 4. Chỉ khi Codex review pass → commit/push

Template báo cáo:

```
✓ Executor: quality-gate pass
✓ Codex: /codex:review — không issue blocking (hoặc đã xử lý)
→ Sẵn sàng commit/push
```

## Lệnh khác (không thay review)

- `/codex:rescue` — delegate investigation/fix khi Executor kẹt (không skip review sau rescue)
- `/codex:transfer` — chuyển session sang Codex TUI/App
- `/codex:cancel` — huỷ job background

## Việc KHÔNG làm

- Không commit ngay sau Executor mà bỏ qua Codex review
- Không bật `--enable-review-gate` tự động trừ khi founder monitor chủ động
- Không nhầm Codex review với SonarQube CI — cả hai đều cần; Codex review logic/design, Sonar gate coverage/violations

## Liên kết

- Plugin: https://github.com/openai/codex-plugin-cc
- Quality gate local: `.claude/skills/quality-gate/SKILL.md`
- Điều phối: `.claude/docs/coordination-protocol.md`
