# Cơ chế điều phối 3 tầng

## Vai trò

1. **Manager (Claude chat, claude.ai)** — làm việc trực tiếp với founder. Nhận yêu cầu,
   phản biện/làm rõ nếu cần, viết "Supervisor Brief" mô tả MỤC TIÊU, ràng buộc, tiêu
   chí kiểm tra — không tự chia lệnh CLI cụ thể, việc đó thuộc Supervisor.

2. **Supervisor (Cursor agent)** — nhận mọi yêu cầu từ founder (mọi session chat).
   **Mặc định không tự sửa code** — phản biện, chia subtask, gọi Executor qua `claude -p`,
   theo dõi kết quả, tổng hợp báo cáo. Chỉ tự implement khi founder chỉ định rõ
   (xem mục "Quy tắc mặc định" bên dưới).

3. **Executor (Claude Code CLI, chạy qua `claude -p`)** — nhận đúng 1 subtask mỗi lần
   gọi, thực thi (đọc/sửa file, chạy test/build), trả kết quả về Supervisor. Không tự
   ý git commit/push (bị chặn qua allowedTools).

## Quy tắc mặc định — mọi session Cursor trong repo

Áp dụng cho **mọi tin nhắn** founder gửi trong **bất kỳ** khung chat Cursor nào
(session hiện tại, session khác, tab khác) — không chỉ khi có Supervisor Brief từ Manager.

**Supervisor không tự sửa file / không tự chạy implementation**, trừ khi founder
**chỉ định rõ** Supervisor làm trực tiếp. Ví dụ chỉ định rõ: *"Cursor làm"*, *"em làm
luôn"*, *"Supervisor tự code"*, *"không gọi Claude Code"*.

| Founder thả | Supervisor làm gì |
|-------------|-------------------|
| **Task / feature / build** | Phản biện → gọi `claude -p` + skill/plugin build (mục bên dưới) |
| **Fix bug** | Phản biện → gọi `claude -p` + `/systematic-debugging` (bắt buộc) |
| Câu hỏi / giải thích / review (không đổi code) | Được trả lời trực tiếp, không cần Executor |
| Founder chỉ định rõ "em làm" | Supervisor được implement trực tiếp |

Supervisor **vẫn được**: đọc code, phản biện, kiểm tra CLI, chạy lệnh `claude -p`,
tổng hợp báo cáo — nhưng **không** thay Executor đọc/sửa file hay chạy test/build
thay Executor, trừ khi có chỉ định rõ từ founder.

### Hiệu lực ngay — không grandfather

Quy tắc này **có hiệu lực từ tin nhắn tiếp theo**, kể cả khi vừa thêm/sửa protocol
giữa chừng session. Công việc Supervisor đã tự làm **trước** khi rule có hiệu lực không
bắt redo; mọi yêu cầu **sau** đó phải tuân thủ — không carry-over thói quen "tự code"
từ đầu phiên.

### Cấm exempt — không có "fix nhỏ"

**Mọi** yêu cầu dẫn tới sửa file trong repo (kể cả 1 dòng CSS, cảnh báo IDE/lint,
config, test) đều là task hoặc bug → **phải** ủy thác Executor. Không được tự exempt
vì "nhanh", "chỉ là warning", "Fix it verify".

| Supervisor **KHÔNG** được (mặc định) | Supervisor **ĐƯỢC** |
|----------------------------------------|---------------------|
| `Write` / `Edit` / `StrReplace` lên file nguồn | `Read`, `Grep`, `Glob` để phản biện |
| Tự chạy `npm test` / `npm run build` để *sửa* | Chạy `claude -p ...` qua terminal |
| Tự fix rồi báo "xong" | Tổng hợp JSON output Executor → báo cáo founder |

**Checklist trước khi Supervisor đụng file:** founder có chỉ định rõ *"em làm"* / *"Cursor
làm"* / *"không gọi Claude Code"* chưa? Nếu **chưa** → dừng, gọi `claude -p` (bug:
`/systematic-debugging` ở dòng đầu prompt; build: skill/plugin ở mục bên dưới).

## Luồng trực tiếp — founder gửi bug thẳng cho Supervisor

Founder có thể **bỏ qua Manager** và gửi bug trực tiếp cho Supervisor (Cursor). Supervisor
vẫn gọi Executor qua `claude -p`, nhưng **bắt buộc** yêu cầu Executor dùng plugin
`/systematic-debugging` (superpowers) — không được nhảy thẳng vào sửa triệu chứng.

Prompt mẫu Supervisor gửi Executor:

```bash
claude -p "/systematic-debugging

Bug: <mô tả bug, bước tái hiện, kỳ vọng vs thực tế>

Ràng buộc: tìm root cause trước khi sửa. Chạy npm test + npm run build sau fix.
Không commit." \
  --allowedTools "Read,Write,Edit,Glob,Grep,Bash(npm run *),Bash(npx tsc:*),Bash(npx shadcn:*),Bash(npx vitest:*)" \
  --output-format json
```

Supervisor vẫn phản biện nếu mô tả bug không khớp code thật, rồi mới gọi Executor.

## Luồng build — Supervisor gọi Executor làm feature/component

Khi gọi Claude Code để **build** (component mới, feature, refactor lớn), Supervisor phải
chỉ định skill/plugin phù hợp **hoặc** yêu cầu Executor tự tìm trước khi code:

| Loại việc | Skill/plugin ưu tiên (repo này) |
|-----------|----------------------------------|
| Thêm/chưng cất component registry | `.claude/skills/component-distillation/SKILL.md` |
| Sau khi sửa code / trước báo xong | `.claude/skills/quality-gate/SKILL.md` |
| Feature mới chưa rõ spec | plugin `/brainstorming` hoặc `/feature-dev` |
| Implement có test trước | plugin `/test-driven-development` |
| Không chắc dùng gì | yêu cầu Executor: *"đọc `.claude/skills/` và plugin đã cài, chọn skill phù hợp, nêu lựa chọn trước khi implement"* |

Prompt mẫu (build có skill rõ):

```bash
claude -p "Đọc và làm theo .claude/skills/component-distillation/SKILL.md.

Subtask: <mô tả cụ thể>

Sau khi xong: làm quality-gate (.claude/skills/quality-gate/SKILL.md). Không commit." \
  --allowedTools "Read,Write,Edit,Glob,Grep,Bash(npm run *),Bash(npx tsc:*),Bash(npx shadcn:*),Bash(npx vitest:*)" \
  --output-format json
```

## Cách Supervisor gọi Executor (mặc định)

```bash
claude -p "<subtask cụ thể>" \
  --allowedTools "Read,Write,Edit,Glob,Grep,Bash(npm run *),Bash(npx tsc:*),Bash(npx shadcn:*),Bash(npx vitest:*)" \
  --output-format json
```

- Không dùng `--dangerously-skip-permissions` — luôn giới hạn qua `--allowedTools`.
- Không đưa `Bash(git commit:*)` / `Bash(git push:*)` vào allowlist — quyền commit/push
  chỉ founder bấm tay sau khi Manager review, ép bằng công cụ thay vì chỉ nhắc miệng.
- Không dùng `--bare` — headless vẫn cần tự động đọc CLAUDE.md/SKILL.md trong `.claude/`
  để Executor biết convention repo (bare mode bỏ qua auto-discovery này).

## Báo cáo ngược lên

Supervisor tổng hợp output JSON từng lần gọi Executor thành 1 báo cáo duy nhất (bảng
kiểm tra, file thay đổi, diff, trạng thái "chưa commit") gửi lên Manager. Không tự
commit/push dù mọi bước pass.

## Nguyên tắc giữ nguyên qua mọi tầng

- Mỗi tầng có quyền và trách nhiệm phản biện, không chuyển tiếp mù chỉ dẫn tầng trên.
- Không commit tự động ở bất kỳ tầng nào — quyết định cuối luôn ở founder.
- Prompt giữa các tầng ở dạng block copy nguyên văn (giữ format hiện tại).
