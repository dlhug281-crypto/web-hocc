export type GradeLevel = 10 | 11 | 12;

export type TrackCategory = 'natural' | 'social' | 'english' | 'stem' | 'general';

export type ClassStatus = 'ongoing' | 'upcoming' | 'completed';

export interface Teacher {
  name: string;
  role: string; // GVCN - Giáo viên chủ nhiệm / GVBM - Giáo viên bộ môn
  subject: string; // Môn giảng dạy chính: Toán, Ngữ Văn, Tiếng Anh, Vật Lý, Hóa Học, v.v.
  avatar: string;
  phone: string;
  email: string;
  yearsOfExperience?: number;
}

export interface Student {
  id: string;
  name: string;
  studentCode: string; // Mã học sinh: HS26001
  avatar: string;
  roleInClass?: 'Lớp trưởng' | 'Lớp phó học tập' | 'Lớp phó lao động' | 'Bí thư Chi đoàn' | 'Tổ trưởng' | 'Học sinh';
  attendance: number; // percentage
  status: 'present' | 'late' | 'excused' | 'unexcused'; // Có mặt, Đi trễ, Nghỉ có phép, Nghỉ không phép
  gpa: number; // Điểm trung bình môn (thang điểm 10)
  conduct: 'Tốt' | 'Khá' | 'Trung bình'; // Hạnh kiểm
}

export interface WeeklySchedulePeriod {
  period: number; // Tiết 1, 2, 3, 4, 5
  time: string; // 07:00 - 07:45
  subject: string; // Toán hình, Đại số, Vật lý...
  teacher: string;
}

export interface LessonPlanItem {
  week: number;
  topic: string;
  subjectDetail: string;
  status: 'completed' | 'current' | 'upcoming';
  examNote?: string; // Kiểm tra 15 phút, Kiểm tra 1 tiết, Thi giữa kỳ...
}

export interface ClassItem {
  id: string;
  code: string; // Ví dụ: 12A1-KHTN, 10A2, 11CA
  title: string; // Lớp 12A1 - Chuyên Toán & KHTN
  grade: GradeLevel; // 10 | 11 | 12
  track: TrackCategory;
  trackLabel: string; // Ban Khoa Học Tự Nhiên, Ban Xã Hội, Chuyên Anh...
  homeroomTeacher: Teacher; // Giáo viên chủ nhiệm
  monitorName: string; // Lớp trưởng
  room: string; // Phòng 301 - Dãy nhà A
  session: 'Sáng (07:00 - 11:15)' | 'Chiều (13:30 - 17:15)' | 'Cả ngày';
  enrollment: {
    current: number;
    max: number;
    maleCount: number;
    femaleCount: number;
  };
  progress: {
    currentWeek: number;
    totalWeeks: number; // 18 tuần học kỳ 1
    semester: 'Học kỳ I' | 'Học kỳ II';
    percent: number;
  };
  rankInSchool: {
    disciplineRank: string; // Hạng 1 toàn trường, Hạng 2...
    flagStatus: 'Cờ đỏ xuất sắc' | 'Cờ thi đua' | 'Tiêu biểu';
    avgScore: number; // 8.75 / 10
  };
  image: string;
  description: string;
  lessonPlans: LessonPlanItem[];
  students: Student[];
  nextActivity: string; // Buổi học / Sự kiện tiếp theo
}
