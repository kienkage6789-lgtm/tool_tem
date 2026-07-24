# Tool Tạo Tem Vật Liệu

> [!WARNING]
> **Tuyên bố miễn trừ trách nhiệm (Disclaimer):** Đây là dự án mã nguồn mở miễn phí 100% được cấp phép dưới điều khoản Giấy phép MIT. Phần mềm được cung cấp "như hiện trạng" (AS IS), tác giả và các bên đóng góp không chịu trách nhiệm pháp lý đối với bất kỳ khiếu nại, thiệt hại hoặc nghĩa vụ nào phát sinh từ việc sử dụng hoặc các hoạt động khác liên quan đến phần mềm này.

## Mục tiêu Dự án
Phát triển công cụ mã nguồn mở 100% nhằm tự động hóa việc tạo và in Tem Vật liệu dựa trên dữ liệu, hỗ trợ đồng nghiệp tự động hóa quy trình sản xuất. Hệ thống được thiết kế chạy Offline hoàn toàn trên trình duyệt.

## Tình trạng dự án

### ✅ Giai đoạn 1: Giao diện Nhập liệu Thủ công (Đã hoàn thành)
- **Kiến trúc Offline**: Chạy 100% local qua file HTML/CSS/JS thuần, không bị lỗi CORS/Bảo mật. (Sử dụng file \ pp.html\).
- **Giao diện chuẩn hóa**: Layout CSS thiết kế khớp 100% tỷ lệ, font chữ, viền bảng và các vị trí logo so với ảnh mẫu.
- **Data Binding & Live Preview**: Gõ form tới đâu tem cập nhật tới đó. Hỗ trợ trường Checkbox (để trống mặc định) và tùy chỉnh Nội dung Mã QR.
- **Dàn trang in A4 chuẩn**: Xử lý dàn trang tự động 6 tem / 1 trang A4. Sử dụng lệnh in gốc của trình duyệt để xuất PDF vector sắc nét mà không cần thư viện bên thứ 3.

### ✅ Giai đoạn 2: Tự động hóa QR & Quản lý Mẫu Tem (v0.2.x)
- **Quản lý Mẫu Tem (Template)**: Cho phép lưu, tải lại, và xóa các form dữ liệu tem ngay trong trình duyệt (Offline 100% bằng `localStorage`). Không cần dựa vào file Excel.
- **Tự động sinh mã QR**: Mã QR được sinh động dựa vào quy tắc `[Mã liệu]-[DZ][Lot No][Ca làm việc][Mã vật liệu]-[Thứ tự thùng/túi]-[Số lượng]`.
- **Hỗ trợ Tem Thùng / Tem Túi**:
  - Tem Thùng: Số thứ tự thùng trong QR tự động tăng dần khi in số lượng lớn (VD: B001, B002).
  - Tem Túi: Số thứ tự cố định khi in nhiều bản.
- **Tối ưu hóa In ấn**: Tích hợp thanh trượt Scale, xem trước bản in chính xác.

### 🚀 Giai đoạn 3: Ứng dụng Desktop (Sắp tới)
- Chuyển đổi mã nguồn Web Offline thành Desktop App chuyên nghiệp (Electron hoặc Tauri) để thuận tiện cho việc phân phối và sử dụng tại xưởng sản xuất.

## Cấu trúc thư mục (Phiên bản hiện tại)
- `web_offline/app.html`: File giao diện chạy chính.
- `web_offline/style_v2.css`: File định dạng và dàn trang in.
- `web_offline/script_v2.js`: File xử lý logic nhập liệu, render QR và In.
- `web_offline/lib/`: Chứa các thư viện offline (`qrcode.min.js`).

## Giấy phép (License)

Dự án này được cấp phép theo các điều khoản của [Giấy phép MIT](file:///D:/x%C6%B0%E1%BB%9Fng%20nh%E1%BB%B1a/Tool%20t%E1%BA%A1o%20tem/LICENSE) - xem file [LICENSE](file:///D:/x%C6%B0%E1%BB%9Fng%20nh%E1%BB%B1a/Tool%20t%E1%BA%A1o%20tem/LICENSE) để biết thêm chi tiết.

