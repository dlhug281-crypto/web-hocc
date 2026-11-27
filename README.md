# EduSchedule - Quản Lý Thời Khóa Biểu & Kế Hoạch Học Tập Lớp 10A1 (THPT Vĩnh Thạnh)

Ứng dụng web cá nhân hóa dành cho học sinh, tích hợp thời khóa biểu chuẩn xác Tuần 9 (Học kỳ I 2026-2027), bảng theo dõi điểm số mục tiêu, sổ bài tập và đồng hồ tập trung Pomodoro.

---

## 🛠️ Hướng Dẫn Mở & Chạy Dự Án Trong Visual Studio Code

### Yêu Cầu Trước Tiên
- Máy tính đã cài đặt **Node.js** (Phiên bản v18 trở lên). Tải tại: [https://nodejs.org](https://nodejs.org)
- Phần mềm **Visual Studio Code**. Tải tại: [https://code.visualstudio.com](https://code.visualstudio.com)

---

### Bước 1: Mở thư mục dự án trong Visual Studio Code
1. Mở **Visual Studio Code**.
2. Chọn menu **File** > **Open Folder...** (hoặc phím tắt `Ctrl + K, Ctrl + O`).
3. Chọn thư mục chứa mã nguồn của dự án này.

---

### Bước 2: Cài đặt các gói thư viện (Dependencies)
Mở Terminal tích hợp của VS Code bằng cách nhấn:
- Phím tắt: `Ctrl + \`` (Windows / Linux) hoặc `Cmd + \`` (macOS)
- Hoặc trên thanh menu chọn: **Terminal** > **New Terminal**

Gõ lệnh sau và nhấn **Enter**:
```bash
npm install
```
*(Chờ khoảng 10-30 giây để npm tải các thư viện React, Tailwind CSS, Motion, Lucide Icons...)*

---

### Bước 3: Khởi chạy môi trường phát triển (Dev Server)
Sau khi cài đặt xong, nhập lệnh:
```bash
npm run dev
```

Terminal sẽ hiển thị đường dẫn:
```
  VITE v8.x.x  ready in 300 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Giữ phím `Ctrl` (hoặc `Cmd`) và click chuột vào đường dẫn `http://localhost:3000` để mở giao diện trên trình duyệt web.

---

### Bước 4: Đóng gói sản phẩm (Build Production)
Khi muốn đóng gói website để đưa lên hosting (Vercel, Netlify, GitHub Pages, Cloudflare Pages...):
```bash
npm run build
```
Thư mục xuất xưởng sẽ nằm trong `/dist`.

---

## 📂 Cấu Trúc Thư Mục Dự Án
```text
├── index.html                   # Trang HTML chính nạp ứng dụng
├── package.json                 # Cấu hình danh sách thư viện và lệnh npm
├── tsconfig.json                # Cấu hình biên dịch TypeScript
├── vite.config.ts               # Cấu hình Vite bundler & Tailwind CSS
├── README.md                    # Tài liệu hướng dẫn sử dụng
└── src/
    ├── main.tsx                 # Điểm khởi chạy React DOM
    ├── App.tsx                  # Giao diện chính điều phối toàn bộ ứng dụng
    ├── index.css                # CSS toàn cục + Tailwind CSS v4
    ├── types/
    │   └── personalSchedule.ts  # Kiểu dữ liệu TypeScript
    ├── data/
    │   ├── defaultSchedule.ts   # TKB mẫu Tuần 9 Lớp 10A1 THPT Vĩnh Thạnh
    │   └── projectCodeData.ts   # Dữ liệu xuất mã nguồn dự án
    └── components/              # Các thành phần giao diện
        ├── Navbar.tsx           # Thanh điều hướng trên cùng
        ├── WeeklyTimetableGrid.tsx # Bảng thời khóa biểu Thứ 2 - CN
        ├── TodayAgendaBanner.tsx   # Lịch trình và tiến độ hôm nay
        ├── TasksDeadlinesView.tsx  # Quản lý bài tập & hạn nộp
        ├── SubjectsGradeTracker.tsx# Theo dõi môn học & điểm số mục tiêu
        ├── PomodoroFocusTimer.tsx  # Đồng hồ tập trung Pomodoro
        ├── ExportVsCodeModal.tsx   # Hộp thoại xuất code cho VS Code (.zip)
        ├── AddOrEditSlotModal.tsx  # Modal thêm / sửa tiết học
        ├── AddTaskModal.tsx        # Modal thêm bài tập mới
        ├── Toast.tsx               # Thông báo nổi
        └── ConfettiBurst.tsx       # Hiệu ứng pháo hoa khi hoàn thành
```
