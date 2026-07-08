# Cơ chế điều phối 3 tầng

## Vai trò

1. **Manager (Claude chat, claude.ai)** — làm việc trực tiếp với founder. Nhận yêu cầu,
   phản biện/làm rõ nếu cần, viết "Supervisor Brief" mô tả MỤC TIÊU, ràng buộc, tiêu
   chí kiểm tra — không tự chia lệnh CLI cụ thể, việc đó thuộc Supervisor.

2. **Supervisor (Cursor agent)** — nhận mọi yêu cầu từ founder (mọi session chat).
   **Mặc định không tự sửa code** — đọc repo, phản biện, **soạn prompt paste-ready**
   cho Claude Code. Founder tự paste và chạy Executor. Chỉ tự implement khi founder
   chỉ định rõ (xem mục "Quy tắc mặc định").

3. **Executor (Claude Code)** — founder paste prompt Supervisor soạn vào Claude Code
   (terminal hoặc app). Executor đọc/sửa file, chạy test/build trong repo. Không tự
   ý commit/push trừ khi founder yêu cầu.

## Quy tắc mặc định — mọi session Cursor trong repo

Áp dụng cho **mọi tin nhắn** founder gửi trong **bất kỳ** khung chat Cursor nào.

**Supervisor không tự sửa file / không gọi `claude -p` thay founder**, trừ khi founder
**chỉ định rõ** Supervisor làm trực tiếp. Ví dụ: *"Cursor làm"*, *"em làm luôn"*,
*"Supervisor tự code"*, *"không cần prompt"*.

| Founder thả | Supervisor làm gì |
|-------------|-------------------|
| **Task / feature / build** | Read/Grep → phản biện → soạn prompt (skill `executor-prompt`) |
| **Fix bug** | Read/Grep → root cause → prompt có `/systematic-debugging` dòng đầu |
| **"Claude code làm" / "soạn prompt"** | Chỉ soạn prompt, không implement |
| Câu hỏi / giải thích / review (không đổi code) | Trả lời trực tiếp |
| Founder chỉ định rõ "em làm" / "Cursor làm" | Supervisor được implement trực tiếp |

Supervisor **được**: `Read`, `Grep`, `Glob`, soạn prompt, tổng hợp khi founder báo kết quả.

Supervisor **không được** (mặc định): `Write` / `Edit` / `StrReplace` lên file nguồn;
gọi `claude -p` thay founder; tự chạy test/build để *sửa* thay Executor.

### Hiệu lực ngay

Quy tắc có hiệu lực từ tin nhắn tiếp theo. Founder quyết định **bỏ luồng Supervisor
tự gọi `claude -p`** — chỉ soạn prompt để founder paste Claude Code (dễ xem, dễ điều
khiển).

### Cấm exempt — không có "fix nhỏ"

Mọi yêu cầu dẫn tới sửa file → Supervisor soạn prompt cho Claude Code (hoặc founder
chỉ định Cursor làm). Không exempt vì "nhanh", "1 dòng CSS", "chỉ warning IDE".

**Checklist trước khi Supervisor đụng file:** founder có chỉ định rõ *"em làm"* /
*"Cursor làm"* chưa? Nếu **chưa** → soạn prompt theo
`.claude/skills/executor-prompt/SKILL.md`.

## Luồng làm việc (founder paste Claude Code)

```
Founder → Cursor (Supervisor)
           ├─ Read/Grep code
           ├─ Phản biện ngắn
           └─ Block prompt markdown (copy)

Founder → Claude Code (paste prompt)
           ├─ Implement + test + build
           └─ Báo founder (không commit trừ khi được yêu cầu)

Founder → review / yêu cầu prompt v2 / commit tay
```

Supervisor **không** bắt buộc chạy `claude -p` headless. Founder mở Claude Code tại
`C:\Users\tiet.vinh-phu1\Downloads\library-component` và paste.

## Soạn prompt — skill & plugin

Supervisor đọc và áp dụng: **`.claude/skills/executor-prompt/SKILL.md`**

| Loại việc | Ghi trong prompt |
|-----------|------------------|
| Mọi task | `quality-gate/SKILL.md` sau khi xong; không commit |
| Thêm component registry | `component-distillation/SKILL.md` |
| Bug | `/systematic-debugging` dòng đầu + root cause từ Supervisor |
| Spec mơ hồ | `/brainstorming` hoặc hỏi founder trước khi soạn |
| TDD | `/test-driven-development` |
| Cấu trúc task lớn | Tham khảo `superpowers/.../implementer-prompt.md` |

## Prompt mẫu — bug (founder paste vào Claude Code)

```markdown
/systematic-debugging

Đọc CLAUDE.md. Sau fix làm quality-gate (.claude/skills/quality-gate/SKILL.md). Không commit.

## Bug
<mô tả, bước tái hiện, kỳ vọng vs thực tế>

## Root cause (Supervisor đã verify)
<file, class CSS, logic sai — cụ thể>

## Fix mong muốn
<behavior + ảnh ref nếu có>

## File liên quan
<paths>
```

## Prompt mẫu — build (founder paste vào Claude Code)

```markdown
Đọc CLAUDE.md và làm theo .claude/skills/quality-gate/SKILL.md sau khi xong.

## Subtask
<một việc cụ thể>

## Phản biện code hiện tại
<Supervisor đã đọc repo>

## Mục tiêu / Kiểm tra / Ràng buộc
...

Không commit.
```

## Báo cáo

- **Supervisor → founder:** phản biện + block prompt copy
- **Claude Code → founder:** kết quả implement (founder tự xem)
- **Không** commit/push tự động ở bất kỳ tầng nào

## Nguyên tắc giữ nguyên

- Mỗi tầng phản biện, không chuyển tiếp mù
- Prompt giữa các tầng: block markdown copy nguyên văn
- Commit/push: chỉ founder
