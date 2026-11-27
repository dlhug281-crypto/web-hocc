export type DayOfWeek = 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7' | 'CN';

export type TaskPriority = 'high' | 'medium' | 'low';

export interface ScheduleSlot {
  id: string;
  day: DayOfWeek;
  period: string; // ví dụ: "Tiết 1 - 2", "Tiết 3", "Ca Sáng", "Ca Tối 19:30"
  startTime: string; // "07:00"
  endTime: string; // "08:35"
  subject: string; // "Toán Hình", "Vật Lý", "Ngữ Văn", "Tiếng Anh IELTS"
  room: string; // "Phòng 301", "Lab Tin Học", "Bàn học tại nhà", "Zoom"
  teacher: string; // "Thầy Tuấn", "Cô Hà"
  color: string; // hex code for accents
  notes?: string;
  completedToday?: boolean;
  isSelfStudy?: boolean;
}

export interface SubjectItem {
  id: string;
  name: string;
  code?: string;
  teacher: string;
  targetGrade: number; // Mục tiêu cá nhân: 9.0
  currentGrade: number; // Điểm trung bình hiện tại: 8.7
  color: string;
  room?: string;
  notes?: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  size: number; // in bytes
  type: string;
  dataUrl: string;
  uploadedAt: string;
}

export interface HomeworkTask {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // "2026-11-05"
  priority: TaskPriority;
  isDone: boolean;
  notes?: string;
  attachments?: TaskAttachment[];
}

export interface UserProfile {
  name: string;
  schoolName: string;
  className: string;
  targetGoal: string;
}

export interface ExtraClassItem {
  id: string;
  subject: string; // Tên môn học thêm (Toán 10 Nâng Cao, Anh Văn IELTS, v.v.)
  teacher: string; // Tên Thầy / Cô giảng dạy
  location: string; // Địa điểm: Trung tâm, Nhà riêng, Online
  daysOfWeek: DayOfWeek[]; // Các thứ trong tuần học: ['T2', 'T4', 'T6']
  startTime: string; // Giờ bắt đầu: "17:30"
  endTime: string; // Giờ kết thúc: "19:00"
  tuitionFee?: string; // Mức học phí (ví dụ: "500.000đ / tháng")
  tuitionStatus?: 'paid' | 'unpaid'; // 'paid' (Đã đóng) | 'unpaid' (Chưa đóng)
  color: string; // Mã màu chủ đạo
  notes?: string; // Ghi chú, dặn dò bài tập
  phone?: string; // Số điện thoại liên hệ giáo viên
  isCompletedToday?: boolean; // Đánh dấu đã học buổi hôm nay
}

