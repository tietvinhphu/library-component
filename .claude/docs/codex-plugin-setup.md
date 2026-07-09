# Codex plugin cho Claude Code — cài đặt & quy trình repo

Plugin chính thức: [openai/codex-plugin-cc](https://github.com/openai/codex-plugin-cc)

Dùng **trong cùng phiên Claude Code (Executor)** — sau quality-gate local, trước báo founder xong.

## Yêu cầu

- Node.js ≥ 18.18
- Tài khoản Codex: ChatGPT subscription (kể cả Free) hoặc OpenAI API key
- Claude Code đã cài plugin marketplace

## Cài đặt (một lần, trong Claude Code)

```text
/plugin marketplace add openai/codex-plugin-cc
/plugin install codex@openai-codex
/reload-plugins
/codex:setup
```

Nếu chưa có Codex CLI:

```bash
npm install -g @openai/codex
codex login
```

Chạy lại `/codex:setup` cho đến khi báo sẵn sàng.

**Không bật review gate tự động** (`/codex:setup --enable-review-gate`) trừ khi founder chủ động monitor — gate tự chạy mỗi lần Stop có thể tốn quota và loop lâu.

## Lệnh dùng trong quy trình repo

| Thời điểm | Lệnh | Ghi chú |
|-----------|------|---------|
| Sau quality-gate local (Executor tự gọi) | `/codex:review` | Read-only; review diff hiện tại |
| Task lớn / nhiều file / trước merge | `/codex:review --background` rồi `/codex:status` → `/codex:result` | Review chạy nền |
| So với `main` trước PR | `/codex:review --base main` | Branch review |
| Feature kiến trúc / auth / data | `/codex:adversarial-review` + focus text | Challenge design, không chỉ syntax |
| Executor kẹt, cần tay khác | `/codex:rescue --background <mô tả>` | Delegate fix; dùng `/codex:status` |

## Luồng (cập nhật)

```
Founder → Cursor (Supervisor)     → prompt paste-ready
Founder → Claude Code (Executor)  → implement + quality-gate + /codex:review (bắt buộc)
Founder → review → commit/push
```

Executor **tự gọi** `/codex:review` trong cùng session — founder không cần gõ lại. Codex **không** tự commit/push.

> Plugin không có `/codex:preview` — dùng `/codex:review`.

## Cấu hình tuỳ chọn

File `.codex/config.toml` ở root repo (khi project trusted):

```toml
model = "gpt-5.4-mini"
model_reasoning_effort = "high"
```

Plugin dùng cùng config user `~/.codex/config.toml` và project override.

## Tiếp tục trong Codex App/TUI

Sau `/codex:result`, copy `session-id` và chạy:

```bash
codex resume <session-id>
```

Hoặc chuyển ngữ cảnh từ Claude Code sang Codex:

```text
/codex:transfer
```
