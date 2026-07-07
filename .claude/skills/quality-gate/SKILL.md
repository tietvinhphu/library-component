---
name: quality-gate
description: >-
  Quy trình bắt buộc sau khi viết/sửa code: viết test, chạy coverage, đảm bảo
  pass SonarQube Cloud Quality Gate trước khi báo hoàn thành hoặc push. Trigger
  khi: sửa code xong, thêm component, fix bug, refactor, chuẩn bị commit/PR,
  hoặc user hỏi về test/coverage/SonarCloud.
---

# Quality Gate — Test, Coverage, SonarQube Cloud

Mục tiêu: **không báo "xong"** và **không push** khi chưa qua checklist dưới đây.
CI trên GitHub Actions chạy `npm run test:coverage` rồi SonarQube scan — lỗi ở local
sẽ lặp lại trên CI.

## Khi nào chạy skill này

- Sau **mọi** thay đổi logic trong `registry/`, `src/lib/`, `src/components/`
  (trừ `src/components/ui/**`), `src/app/components/**`
- Cuối skill `component-distillation` (bước 8), **trước** `git push`
- Khi user yêu cầu review/fix Quality Gate SonarCloud

## Checklist bắt buộc (theo thứ tự)

### 1. Viết test cho code vừa thay đổi

| Loại file | Vị trí test | Công cụ |
|-----------|-------------|---------|
| `registry/<name>/*.tsx` | `registry/<name>/*.test.tsx` cùng thư mục | Vitest + RTL + jsdom |
| `src/lib/*.ts` | `src/lib/*.test.ts` cùng thư mục | Vitest |
| `src/components/*.tsx` | `src/components/*.test.tsx` | Vitest + RTL |
| `src/app/components/**/*.tsx` | `*.test.tsx` cùng thư mục với page/layout | Vitest + RTL |

**Nguyên tắc test:**
- Test hành vi thật (render, click, async state), không chỉ snapshot.
- Mỗi props branch quan trọng, edge case (empty, error, loading) cần ít nhất 1 test.
- Mock module ngoài bằng `vi.mock()`; với `importOriginal`, dùng type import tương đối:

```tsx
import type * as Registry from "../../../lib/registry";

vi.mock("@/lib/registry", async (importOriginal) => {
  const actual = await importOriginal<typeof Registry>();
  return { ...actual, getPreviewImage: vi.fn(() => null) };
});
```

Không dùng `typeof import("@/...")` trong test — IDE/TS không resolve alias `@/*`
trong file test (file bị exclude khỏi `tsconfig.json` chính).

**Không cần test:** `src/components/ui/**` (shadcn primitives), file config thuần.

### 2. Chạy test — tất cả phải pass

Chạy từ **đường dẫn local** (không dùng UNC `\\localhost\c$\...`):

```powershell
cd C:\Users\tiet.vinh-phu1\Downloads\library-component
npm test
```

Chạy một file cụ thể khi debug:

```powershell
npx vitest run "src/lib/registry.test.ts"
```

**Pass = exit code 0, 0 test failed.** Có fail → sửa code hoặc test, chạy lại.

### 3. Chạy coverage

```powershell
npm run test:coverage
```

Coverage được tính cho (xem `vitest.config.ts`):
- `registry/**/*.tsx`
- `src/lib/**/*.ts`
- `src/components/**/*.tsx` (trừ `ui/`)
- `src/app/components/**/*.tsx`

Báo cáo LCOV: `coverage/lcov.info` — CI đẩy file này lên SonarCloud.

**Ngưỡng SonarCloud (Quality Gate trên code mới):**
- `new_coverage` ≥ **80%**
- `new_violations` = **0** (rating A trên reliability, security, maintainability)

Sau khi chạy coverage, kiểm tra bảng text trong terminal: file vừa sửa phải có
line coverage cao (mục tiêu nội bộ **≥ 80%** trên file đó). Nếu thấp → bổ sung test.

### 4. Build production

```powershell
npm run build
```

Đảm bảo Next.js build pass (typecheck + compile).

### 5. (Tuỳ chọn) Kiểm tra SonarCloud trước push

- Project key: `tietvinhphu_library-component`
- Org: `tietvinhphu`
- Dùng SonarQube MCP (`search_sonar_issues_in_projects`) nếu có — **sau push** gate
  mới phản ánh coverage mới; local chỉ là phòng thủ.

### 6. Chỉ khi checklist pass → báo hoàn thành / commit / push

Template báo cáo cho user:

```
✓ Test: X/X pass
✓ Coverage: Y% (file đã sửa: ...)
✓ Build: pass
→ Sẵn sàng push; CI SonarQube sẽ scan tự động
```

## Quy tắc code hay bị SonarCloud flag (sửa ngay khi viết)

- Props React: `Readonly<Props>` hoặc `readonly` từng field (S6759)
- `String#replaceAll` thay `replace` với regex global (S7781)
- Import Node: `node:fs`, `node:path` (S7772)
- Sort mảng string: `.sort((a, b) => a.localeCompare(b))` (S2871)
- Tránh nesting quá sâu — tách helper (S2004)

## CI tham chiếu

File `.github/workflows/build.yml`:
1. `npm ci`
2. `npm run test:coverage`
3. SonarQube scan (token `SONAR_TOKEN` trên GitHub)

## Việc KHÔNG làm

- Không bỏ qua test vì "chỉ sửa nhỏ"
- Không push rồi mới viết test
- Không dùng `@/` trong `typeof import("...")` ở file test
- Không chạy npm từ UNC path trên Windows corporate

## Liên kết

- Test stack: `vitest.config.ts`, `vitest.setup.ts`, `tsconfig.vitest.json`
- Thêm component mới: `.claude/skills/component-distillation/SKILL.md` (chạy quality-gate trước push)
