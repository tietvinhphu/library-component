---
name: executor-prompt
description: Dùng khi Supervisor (Cursor) cần soạn prompt paste-ready cho founder chạy trong Claude Code — không gọi claude -p thay founder.
---

# Soạn prompt cho Claude Code (Executor)

Supervisor **không** gọi `claude -p` và **không** tự sửa file implementation. Supervisor đọc code → phản biện → xuất **một block markdown** founder copy nguyên văn vào Claude Code.

## Khi nào dùng skill này

- Founder yêu cầu feature, fix bug, refactor trong repo
- Founder nói *"Claude code làm"*, *"soạn prompt"*, *"paste qua Claude Code"*
- **Không** dùng khi founder chỉ hỏi/giải thích (trả lời trực tiếp) hoặc chỉ định *"Cursor làm"* / *"em làm"*

## Nguồn tham khảo chất lượng prompt

| Nguồn | Dùng cho |
|-------|----------|
| `.claude/skills/quality-gate/SKILL.md` | Luôn nhắc Executor chạy test/coverage/build trước khi báo xong |
| `.claude/skills/component-distillation/SKILL.md` | Thêm/chưng cất component registry |
| Plugin `/systematic-debugging` | **Bug** — dòng đầu prompt, root cause trước khi sửa |
| Plugin `/test-driven-development` | Feature phức tạp, cần test trước |
| Plugin `/brainstorming` | Spec mơ hồ, nhiều hướng |
| `superpowers/.../implementer-prompt.md` | Cấu trúc: Context → Job → Files → Report |
| `writing-skills` (recipe not prohibition) | Mô tả **output mong muốn** (hình ảnh, behavior), tránh chỉ liệt kê "đừng làm X" |

Supervisor **đọc** các skill trên để chọn dòng mở đầu phù hợp; không copy cả file vào prompt.

## Quy trình Supervisor

1. **Read / Grep / Glob** — xác minh code thật, ghi root cause nếu là bug
2. **Phản biện** — nói ngắn với founder nếu yêu cầu không khớp code (trước khi soạn prompt)
3. **Soạn prompt** theo template bên dưới
4. **Giao founder** — block copy, không tự chạy Claude Code
5. Founder paste → Claude Code làm → founder review / báo lại Cursor nếu cần prompt v2

## Template prompt (copy nguyên văn cho founder)

```markdown
Đọc CLAUDE.md và làm theo .claude/skills/quality-gate/SKILL.md sau khi xong.

[CHỈ BUG — dòng đầu:]
/systematic-debugging

[CHỈ BUILD COMPONENT:]
Đọc và làm theo .claude/skills/component-distillation/SKILL.md.

## Subtask
<Một việc cụ thể — đủ nhỏ để xong trong một phiên Claude Code>

## Phản biện / root cause (Supervisor đã verify)
<2–5 bullet: code hiện tại làm gì, sai ở đâu, file + dòng nếu biết>

## Mục tiêu
<Behavior mong muốn — mô tả như ảnh ref, không mơ hồ>

## Không phải mục tiêu (nếu cần)
<Phạm vi loại trừ>

## Ảnh / ref (nếu có)
- Đúng: <path hoặc mô tả>
- Sai: <path hoặc mô tả>

## Kiểm tra
URL hoặc bước: <vd. /components/file-system/file-system → Source Code>

## File liên quan
<liệt kê path cụ thể>

## Ràng buộc
- Giữ convention repo (server shiki, terminal tối, v.v.)
- npm test, tsc, lint, build — pass
- **KHÔNG commit, KHÔNG push**

## Báo cáo khi xong
- Root cause đã fix (1–2 câu)
- File đổi
- Kết quả test/build
```

## Checklist chất lượng trước khi giao prompt

- [ ] Có **root cause** hoặc **phản biện code thật** (không chỉ lặp lại lời founder)
- [ ] **Một subtask** — không nhồi 3 feature trong một prompt
- [ ] Có **tiêu chí kiểm tra** (URL, test, hành vi UI)
- [ ] Có **đường dẫn file** Executor cần đọc/sửa
- [ ] Nhắc **quality-gate** và **không commit**
- [ ] Bug có `/systematic-debugging` ở dòng đầu
- [ ] Ảnh ref: path trong `assets/` hoặc mô tả rõ collapsed vs expanded

## Output Supervisor gửi founder

1. Phản biện ngắn (2–4 câu tiếng Việt)
2. Block prompt trong fenced ` ```markdown ` — founder copy toàn bộ nội dung bên trong
3. Gợi ý: mở terminal Claude Code tại `C:\Users\tiet.vinh-phu1\Downloads\library-component`, paste prompt

Không chạy `claude -p` thay founder trừ khi founder yêu cầu rõ.
