---
name: codex-review-gate
description: >-
  Bước bắt buộc trong cùng phiên Claude Code (Executor): sau quality-gate local,
  Executor tự gọi /codex:review. Trigger khi: Executor hoàn thành implement,
  chuẩn bị báo founder, hoặc founder hỏi "review codex".
---

# Codex Review Gate

Mục tiêu: **không báo xong / không commit/push** khi chưa có pass review từ Codex plugin (read-only).

Cài đặt plugin: `.claude/docs/codex-plugin-setup.md`

> **Tên lệnh:** plugin chỉ có `/codex:review` (không có `/codex:preview`). Khi founder nói "codex preview" trong repo này = `/codex:review`.

## Khi nào chạy

- **Sau quality-gate local** (test → coverage → build) trong **cùng phiên Executor**
- **Trước** Executor báo founder "xong"
- **Trước** founder commit/push
- Trước PR — dùng `--base main`

## Ai chạy

| Tầng | Việc |
|------|------|
| **Executor (Claude Code)** | Tự gọi `/codex:review` — **bắt buộc** |
| **Founder** | Chỉ commit/push sau khi Executor báo Codex pass |

## Checklist (Executor chạy trong Claude Code)

### 1. Chọn lệnh review

| Tình huống | Lệnh |
|------------|------|
| Task thường, diff nhỏ | `/codex:review` |
| Nhiều file / review lâu | `/codex:review --background` → `/codex:status` → `/codex:result` |
| So với main trước merge | `/codex:review --base main` |
| Kiến trúc, auth, data loss, race | `/codex:adversarial-review <focus>` |

### 2. Đọc kết quả

- Issue **blocking** → Executor sửa trong cùng phiên
- Issue **chấp nhận được** → ghi lý do trong báo cáo cho founder
- Review sạch → báo founder sẵn sàng commit

### 3. Nếu Codex yêu cầu sửa code

1. Sửa (Executor)
2. Chạy lại `.claude/skills/quality-gate/SKILL.md`
3. Chạy lại `/codex:review` trên diff mới

### 4. Chỉ khi Codex review pass → báo founder / commit

Template báo cáo Executor gửi founder:

```
✓ Quality-gate: test / coverage / build pass
✓ Codex: /codex:review — không issue blocking (hoặc đã xử lý: ...)
→ Sẵn sàng commit/push (founder quyết định)
```

## Lệnh khác (không thay review)

- `/codex:rescue` — delegate investigation/fix khi Executor kẹt (không skip review sau rescue)
- `/codex:transfer` — chuyển session sang Codex TUI/App
- `/codex:cancel` — huỷ job background

## Việc KHÔNG làm

- Không báo "xong" sau quality-gate mà bỏ qua `/codex:review`
- Không đẩy founder phải tự gõ `/codex:review` — Executor làm trong cùng session
- Không bật `--enable-review-gate` tự động trừ khi founder monitor chủ động
- Không nhầm Codex review với SonarQube CI — cả hai đều cần

## Liên kết

- Plugin: https://github.com/openai/codex-plugin-cc
- Quality gate local: `.claude/skills/quality-gate/SKILL.md`
- Điều phối: `.claude/docs/coordination-protocol.md`
