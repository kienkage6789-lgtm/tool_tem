# Tiến độ Dự án: Tool Tạo Tem Vật Liệu (Offline)

## Danh sách công việc Giai đoạn 1 (Nhập liệu thủ công) - ✅ ĐÃ HOÀN THÀNH
- [x] **Giao diện Web Offline**: Xây dựng thành công bộ khung HTML/CSS/JS thuần (file `app.html`), không cần cài đặt server, không bị lỗi bảo mật CORS.
- [x] **Giao diện Tem**: Thiết kế CSS kích thước, font chữ, vị trí (checkbox, logo RoHS) khớp hoàn toàn với hình mẫu.
- [x] **Form nhập liệu**:
  - Đầy đủ các trường: Phân loại, Nội dung mã QR, Tên SP, Mã đơn, Mã liệu, NCC, Số lượng...
  - Ràng buộc: Dropdown phân loại mặc định là "Để trống" để khi mới tải trang sẽ không tự động tick vào ô nào.
- [x] **Live Preview & QR Code**: Gõ tới đâu hiển thị tới đó. Sinh mã QR động chuẩn xác dựa trên trường "Nội dung Mã QR".
- [x] **Xuất PDF / In ấn**:
  - Dàn trang in A4 chuẩn: 6 tem / 1 trang (2 cột, 3 hàng).
  - Khắc phục lỗi xuất file bằng cách sử dụng công cụ In ấn `window.print()` tích hợp của trình duyệt. Tự động dàn full trang A4 khi Save as PDF.

---

## Danh sách công việc Giai đoạn 2 (Tự động hóa từ Excel) - ✅ ĐÃ HOÀN THÀNH
- [x] Tải thư viện đọc Excel (`SheetJS / xlsx`) về thư mục `lib/` để có thể chạy offline.
- [x] Thiết kế giao diện (UI) Upload File: Khu vực cho phép kéo thả hoặc chọn file Excel.
- [x] Viết hàm (Script) đọc dữ liệu từ file Excel tải lên.
- [x] Chốt cấu trúc các cột (header) trong file Excel mẫu để code logic **Ánh xạ (Mapping)** dữ liệu (Ví dụ: Cột A vào Tên SP, Cột B vào LOT.NO,...).
- [x] Tạo giao diện xem trước (Preview) **hàng loạt**: Khi tải Excel lên có 100 dòng thì hiển thị nháp toàn bộ 100 tem để người dùng lướt kiểm tra trước.
- [x] Nâng cấp tính năng **Xuất PDF**: Dàn trang tự động cho danh sách số lượng lớn (Ví dụ: 100 tem sinh ra 17 trang A4).
