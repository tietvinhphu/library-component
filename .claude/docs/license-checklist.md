# Checklist kiểm tra license nguồn

Áp dụng cho mọi component tham khảo từ nguồn ngoài (21st.dev, GitHub,
CodePen, bất kỳ đâu) trước khi đưa vào registry công khai. Bắt buộc thực
hiện ở bước 2 của `component-distillation/SKILL.md`.

## Bước kiểm tra

1. Tìm file `LICENSE` ở repo gốc (nếu component đến từ GitHub) hoặc mục
   license trên trang nguồn (21st.dev thường ghi license ngay ở trang
   component, hoặc trong `package.json` nếu cài qua CLI của họ).
2. Nếu không tìm thấy license rõ ràng — mặc định coi là **có bản quyền, mọi
   quyền được bảo lưu** (đây là mặc định pháp lý, không phải phỏng đoán).
3. Ghi lại kết quả vào `inspirationSource.licenseStatus` trong registry.json.

## Phân loại

### Nhóm A — MIT / Apache-2.0 / BSD / có ghi rõ "free to use, modify"

Được phép tham khảo logic và cấu trúc component khi build lại. Vẫn phải
viết lại code (không copy-paste nguyên văn) theo convention riêng của
registry — lý do là để tránh dính lỗi/giả định của bản gốc, và để đảm bảo
component nhất quán style với các component khác trong registry.

→ `licenseStatus: "reviewed-safe-reference"`

### Nhóm B — Không ghi license, hoặc license không rõ ràng (custom, ghi
chung chung "for personal use")

Chỉ được dùng làm **tham khảo ý tưởng UX** (VD: "component này có pattern
kéo-thả hay"), không được nhìn code gốc để build. Viết lại 100% từ mô tả
hành vi quan sát được qua demo, không đọc source.

→ `licenseStatus: "reviewed-rewritten"`

### Nhóm C — Ghi rõ cấm sao chép/thương mại hoá, hoặc là sản phẩm trả phí

Không đưa vào registry dưới bất kỳ hình thức nào, kể cả viết lại. Nếu thấy
component đẹp, chỉ nên dùng làm nguồn cảm hứng nói chung (không ghi cụ thể
tên/link nguồn trong registry), và phải khác biệt rõ về cách triển khai.

→ Dừng, không tiếp tục quy trình chưng cất.

## Trường hợp đặc biệt: 21st.dev

21st.dev là marketplace tổng hợp component từ nhiều tác giả — license áp
dụng theo từng component, không phải theo toàn nền tảng. Luôn kiểm tra
license ghi trên từng trang component cụ thể, không suy ra từ component
khác trên cùng site.
