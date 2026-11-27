import { ScheduleSlot, SubjectItem, HomeworkTask, UserProfile, ExtraClassItem } from '../types/personalSchedule';

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Đặng Lê Hùng',
  schoolName: 'Trường THPT Vĩnh Thạnh',
  className: 'Lớp 10A1 · Buổi Sáng',
  targetGoal: 'Học kỳ I (2026 - 2027) · Thực hiện từ Tuần 9 (02/11/2026)'
};

export const DEFAULT_SUBJECTS: SubjectItem[] = [
  { id: 'sub-toan', name: 'Toán', code: 'TOAN', teacher: 'Thầy Dương', targetGrade: 9.5, currentGrade: 9.2, color: '#3b82f6', room: 'Phòng học 10A1', notes: 'Mệnh đề, tập hợp, hàm số bậc hai' },
  { id: 'sub-hoa', name: 'Hóa', code: 'HOA', teacher: 'Cô Nhi', targetGrade: 9.0, currentGrade: 8.8, color: '#f59e0b', room: 'Phòng học 10A1', notes: 'Bảng tuần hoàn & liên kết hóa học' },
  { id: 'sub-ly', name: 'Lý', code: 'LY', teacher: 'Thầy Quân', targetGrade: 9.0, currentGrade: 8.9, color: '#10b981', room: 'Phòng học 10A1', notes: 'Chuyển động thẳng biến đổi đều' },
  { id: 'sub-sinh', name: 'Sinh', code: 'SINH', teacher: 'Cô L Hà', targetGrade: 9.0, currentGrade: 8.7, color: '#84cc16', room: 'Phòng học 10A1', notes: 'Cấu trúc tế bào & axit nucleic' },
  { id: 'sub-tin', name: 'Tin', code: 'TIN', teacher: 'Thầy Dũng', targetGrade: 9.8, currentGrade: 9.5, color: '#06b6d4', room: 'Phòng Tin Học', notes: 'Kiểu dữ liệu & lập trình cơ bản' },
  { id: 'sub-van', name: 'Ngữ văn', code: 'VAN', teacher: 'Cô M Thảo', targetGrade: 8.5, currentGrade: 8.4, color: '#ec4899', room: 'Phòng học 10A1', notes: 'Sử thi & truyện dân gian 10' },
  { id: 'sub-anh', name: 'T Anh', code: 'ANH', teacher: 'Thầy Khiêm', targetGrade: 9.0, currentGrade: 8.8, color: '#8b5cf6', room: 'Phòng học 10A1', notes: 'Unit 3: Music & Grammar revision' },
  { id: 'sub-su', name: 'Sử', code: 'SU', teacher: 'Cô Hạnh', targetGrade: 9.0, currentGrade: 8.6, color: '#d97706', room: 'Phòng học 10A1', notes: 'Hiện thực lịch sử và nhận thức' },
  { id: 'sub-gdqp', name: 'GDQPAN', code: 'GDQP', teacher: 'Thầy Bình', targetGrade: 10, currentGrade: 9.5, color: '#475569', room: 'Sân trường / Nhà thi đấu', notes: 'Đội ngũ từng người có súng' },
  { id: 'sub-gdtc', name: 'GDTC', code: 'GDTC', teacher: 'Thầy Song', targetGrade: 10, currentGrade: 9.6, color: '#0284c7', room: 'Sân thể thao', notes: 'Chạy cự ly ngắn & Thể dục nhịp điệu' },
  { id: 'sub-tnhn', name: 'TNHN (SHDC / SHL)', code: 'TNHN', teacher: 'Cô B Thanh (GVCN)', targetGrade: 10, currentGrade: 10, color: '#dc2626', room: 'Sân trường / Phòng 10A1', notes: 'Hoạt động trải nghiệm, hướng nghiệp' },
];

/**
 * THỜI KHÓA BIỂU CHÍNH XÁC LỚP 10A1 - THPT VĨNH THẠNH
 * HỌC KÌ I, NĂM HỌC 2026-2027 - TUẦN 9 (02/11/2026 - 07/11/2026)
 * Thời gian: Tiết 1 bắt đầu lúc 07h00 sáng
 */
export const DEFAULT_SCHEDULE_SLOTS: ScheduleSlot[] = [
  // ================= THỨ HAI =================
  {
    id: '10a1-t2-1',
    day: 'T2',
    period: 'Tiết 1',
    startTime: '07:00',
    endTime: '07:45',
    subject: 'Toán',
    room: 'Phòng 10A1',
    teacher: 'Thầy Dương',
    color: '#3b82f6',
    notes: 'Toán 10 - Ôn tập hàm số & đại số'
  },
  {
    id: '10a1-t2-2',
    day: 'T2',
    period: 'Tiết 2',
    startTime: '07:50',
    endTime: '08:35',
    subject: 'Toán',
    room: 'Phòng 10A1',
    teacher: 'Thầy Dương',
    color: '#3b82f6',
    notes: 'Toán 10 - Luyện tập bài tập SGK'
  },
  {
    id: '10a1-t2-3',
    day: 'T2',
    period: 'Tiết 3',
    startTime: '08:55',
    endTime: '09:40',
    subject: 'Hóa',
    room: 'Phòng 10A1',
    teacher: 'Cô Nhi',
    color: '#f59e0b',
    notes: 'Hóa học 10 - Bảng tuần hoàn nguyên tố'
  },
  {
    id: '10a1-t2-4',
    day: 'T2',
    period: 'Tiết 4',
    startTime: '09:45',
    endTime: '10:30',
    subject: 'TNHN_1 (SHDC)',
    room: 'Sân trường',
    teacher: 'Cô B Thanh',
    color: '#dc2626',
    notes: 'Sinh hoạt dưới cờ đầu tuần'
  },
  {
    id: '10a1-t2-5',
    day: 'T2',
    period: 'Tiết 5',
    startTime: '10:35',
    endTime: '11:20',
    subject: 'TNHN_2 (SHCD)',
    room: 'Phòng 10A1',
    teacher: 'Cô B Thanh',
    color: '#dc2626',
    notes: 'Hoạt động trải nghiệm & Hướng nghiệp chủ đề'
  },

  // ================= THỨ BA =================
  {
    id: '10a1-t3-1',
    day: 'T3',
    period: 'Tiết 1',
    startTime: '07:00',
    endTime: '07:45',
    subject: 'T Anh',
    room: 'Phòng 10A1',
    teacher: 'Thầy Khiêm',
    color: '#8b5cf6',
    notes: 'Tiếng Anh 10 - Từ vựng & ngữ pháp Unit 3'
  },
  {
    id: '10a1-t3-2',
    day: 'T3',
    period: 'Tiết 2',
    startTime: '07:50',
    endTime: '08:35',
    subject: 'Sử',
    room: 'Phòng 10A1',
    teacher: 'Cô Hạnh',
    color: '#d97706',
    notes: 'Lịch sử 10 - Khái niệm lịch sử & di sản văn hóa'
  },
  {
    id: '10a1-t3-3',
    day: 'T3',
    period: 'Tiết 3',
    startTime: '08:55',
    endTime: '09:40',
    subject: 'GDQPAN',
    room: 'Nhà thi đấu / Sân trường',
    teacher: 'Thầy Bình',
    color: '#475569',
    notes: 'Giáo dục quốc phòng an ninh'
  },
  {
    id: '10a1-t3-4',
    day: 'T3',
    period: 'Tiết 4',
    startTime: '09:45',
    endTime: '10:30',
    subject: 'Sinh',
    room: 'Phòng 10A1',
    teacher: 'Cô L Hà',
    color: '#84cc16',
    notes: 'Sinh học 10 - Cấu tạo tế bào nhân sơ'
  },
  {
    id: '10a1-t3-5',
    day: 'T3',
    period: 'Tiết 5',
    startTime: '10:35',
    endTime: '11:20',
    subject: 'Ngữ văn',
    room: 'Phòng 10A1',
    teacher: 'Cô M Thảo',
    color: '#ec4899',
    notes: 'Ngữ văn 10 - Văn bản sử thi Đăm Săn'
  },

  // ================= THỨ TƯ =================
  {
    id: '10a1-t4-1',
    day: 'T4',
    period: 'Tiết 1',
    startTime: '07:00',
    endTime: '07:45',
    subject: 'Toán',
    room: 'Phòng 10A1',
    teacher: 'Thầy Dương',
    color: '#3b82f6',
    notes: 'Toán 10 - Vectơ & Tích vô hướng'
  },
  {
    id: '10a1-t4-2',
    day: 'T4',
    period: 'Tiết 2',
    startTime: '07:50',
    endTime: '08:35',
    subject: 'TNHN_3 (SHL)',
    room: 'Phòng 10A1',
    teacher: 'Cô B Thanh',
    color: '#dc2626',
    notes: 'Sinh hoạt lớp & Sơ kết nề nếp thi đua'
  },
  {
    id: '10a1-t4-3',
    day: 'T4',
    period: 'Tiết 3',
    startTime: '08:55',
    endTime: '09:40',
    subject: 'GDTC',
    room: 'Sân thể thao',
    teacher: 'Thầy Song',
    color: '#0284c7',
    notes: 'Giáo dục thể chất - Chạy cự ly ngắn'
  },
  {
    id: '10a1-t4-4',
    day: 'T4',
    period: 'Tiết 4',
    startTime: '09:45',
    endTime: '10:30',
    subject: 'Lý',
    room: 'Phòng 10A1',
    teacher: 'Thầy Quân',
    color: '#10b981',
    notes: 'Vật lý 10 - Chuyển động biến đổi đều'
  },
  {
    id: '10a1-t4-5',
    day: 'T4',
    period: 'Tiết 5',
    startTime: '10:35',
    endTime: '11:20',
    subject: 'Tin',
    room: 'Phòng Tin Học',
    teacher: 'Thầy Dũng',
    color: '#06b6d4',
    notes: 'Tin học 10 - Thực hành ngôn ngữ lập trình'
  },

  // ================= THỨ NĂM =================
  {
    id: '10a1-t5-1',
    day: 'T5',
    period: 'Tiết 1',
    startTime: '07:00',
    endTime: '07:45',
    subject: 'Hóa',
    room: 'Phòng 10A1',
    teacher: 'Cô Nhi',
    color: '#f59e0b',
    notes: 'Hóa học 10 - Quy luật biến đổi tính chất'
  },
  {
    id: '10a1-t5-2',
    day: 'T5',
    period: 'Tiết 2',
    startTime: '07:50',
    endTime: '08:35',
    subject: 'GDTC',
    room: 'Sân thể thao',
    teacher: 'Thầy Song',
    color: '#0284c7',
    notes: 'Thể dục - Kỹ thuật xuất phát thấp'
  },
  {
    id: '10a1-t5-3',
    day: 'T5',
    period: 'Tiết 3',
    startTime: '08:55',
    endTime: '09:40',
    subject: 'Lý',
    room: 'Phòng 10A1',
    teacher: 'Thầy Quân',
    color: '#10b981',
    notes: 'Vật lý 10 - Phương trình vận tốc và tọa độ'
  },
  {
    id: '10a1-t5-4',
    day: 'T5',
    period: 'Tiết 4',
    startTime: '09:45',
    endTime: '10:30',
    subject: 'Tin',
    room: 'Phòng Tin Học',
    teacher: 'Thầy Dũng',
    color: '#06b6d4',
    notes: 'Tin học 10 - Cấu trúc điều khiển'
  },
  {
    id: '10a1-t5-5',
    day: 'T5',
    period: 'Tiết 5',
    startTime: '10:35',
    endTime: '11:20',
    subject: 'T Anh',
    room: 'Phòng 10A1',
    teacher: 'Thầy Khiêm',
    color: '#8b5cf6',
    notes: 'Tiếng Anh 10 - Kỹ năng Reading & Speaking'
  },

  // ================= THỨ SÁU =================
  {
    id: '10a1-t6-1',
    day: 'T6',
    period: 'Tiết 1',
    startTime: '07:00',
    endTime: '07:45',
    subject: 'Hóa',
    room: 'Phòng 10A1',
    teacher: 'Cô Nhi',
    color: '#f59e0b',
    notes: 'Hóa học 10 - Bài tập củng cố cuối tuần'
  },
  {
    id: '10a1-t6-2',
    day: 'T6',
    period: 'Tiết 2',
    startTime: '07:50',
    endTime: '08:35',
    subject: 'Lý',
    room: 'Phòng 10A1',
    teacher: 'Thầy Quân',
    color: '#10b981',
    notes: 'Vật lý 10 - Ôn tập chuẩn bị kiểm tra'
  },
  {
    id: '10a1-t6-3',
    day: 'T6',
    period: 'Tiết 3',
    startTime: '08:55',
    endTime: '09:40',
    subject: 'Toán',
    room: 'Phòng 10A1',
    teacher: 'Thầy Dương',
    color: '#3b82f6',
    notes: 'Toán 10 - Giải đáp thắc mắc bài tập tuần'
  },

  // ================= THỨ BẢY (Tự học / Bồi dưỡng) =================
  {
    id: '10a1-t7-1',
    day: 'T7',
    period: 'Sáng',
    startTime: '08:00',
    endTime: '10:30',
    subject: 'Tự Học & Làm Bài Tập',
    room: 'Bàn học tại nhà',
    teacher: 'Cá nhân tự học',
    color: '#64748b',
    notes: 'Làm bài tập về nhà môn Toán và Hóa',
    isSelfStudy: true
  },

  // ================= CHỦ NHẬT =================
  {
    id: '10a1-cn-1',
    day: 'CN',
    period: 'Chiều',
    startTime: '15:00',
    endTime: '17:00',
    subject: 'T Anh & Chuẩn Bị Bài Mới',
    room: 'Bàn học tại nhà',
    teacher: 'Tự học',
    color: '#8b5cf6',
    notes: 'Soạn bài môn Văn & học từ vựng tiếng Anh',
    isSelfStudy: true
  }
];

export const DEFAULT_TASKS: HomeworkTask[] = [
  {
    id: 'task-1',
    title: 'Giải bài tập 1, 2, 3 trang 38 SGK Toán 10 (Hàm số)',
    subject: 'Toán',
    dueDate: '2026-11-04',
    priority: 'high',
    isDone: false,
    notes: 'Thầy Dương dặn nộp vào tiết 1 Thứ Tư',
    attachments: [
      {
        id: 'att-sample-1',
        name: 'De_cuong_on_tap_Ham_so_bac_hai_Toan_10.txt',
        size: 1420,
        type: 'text/plain',
        dataUrl: 'data:text/plain;charset=utf-8,' + encodeURIComponent('ĐỀ CƯƠNG ÔN TẬP TOÁN 10 - CHƯƠNG HÀM SỐ BẬC HAI\nTrường THPT Vĩnh Thạnh - Lớp 10A1\n\nI. KIẾN THỨC TRỌNG TÂM:\n1. Tập xác định và tập giá trị của hàm số bậc hai y = ax^2 + bx + c (a != 0)\n2. Tọa độ đỉnh parabol I(-b/(2a), -Delta/(4a))\n3. Chiều biến thiên và bảng biến thiên theo dấu của hệ số a\n\nII. BÀI TẬP VỀ NHÀ:\n- Bài 1, 2, 3 trang 38 SGK Toán 10 Chân Trời Sáng Tạo.\n- Tiết 1 Thứ Tư tuần 9 nộp vở bài tập cho Thầy Dương.'),
        uploadedAt: '2026-11-03T08:00:00.000Z'
      }
    ]
  },
  { id: 'task-2', title: 'Làm bài tập xác định vị trí nguyên tố trong Bảng tuần hoàn', subject: 'Hóa', dueDate: '2026-11-05', priority: 'high', isDone: false, notes: 'Cô Nhi dặn kiểm tra vở bài tập' },
  { id: 'task-3', title: 'Học thuộc từ vựng Unit 3 Tiếng Anh 10 (chủ đề Music)', subject: 'T Anh', dueDate: '2026-11-05', priority: 'medium', isDone: false, notes: 'Chuẩn bị trả lời vấn đáp đầu giờ Thầy Khiêm' },
  { id: 'task-4', title: 'Soạn câu hỏi phân tích trích đoạn Chiến thắng Mtao Mxây', subject: 'Ngữ văn', dueDate: '2026-11-03', priority: 'medium', isDone: true, notes: 'Đã hoàn thành sơ đồ nhân vật' },
  { id: 'task-5', title: 'Làm bài tập Vật lý tính vận tốc và gia tốc chuyển động thẳng', subject: 'Lý', dueDate: '2026-11-06', priority: 'high', isDone: false, notes: 'Chuẩn bị cho tiết 2 Thứ Sáu Thầy Quân' }
];

export const DEFAULT_EXTRA_CLASSES: ExtraClassItem[] = [
  {
    id: 'extra-toan',
    subject: 'Toán 10 Nâng Cao & Hình Không Gian',
    teacher: 'Thầy Dương',
    location: 'Trung tâm BDVH Vĩnh Thạnh (Phòng 202)',
    daysOfWeek: ['T2', 'T4', 'T6'],
    startTime: '17:30',
    endTime: '19:00',
    tuitionFee: '500.000đ / tháng',
    tuitionStatus: 'paid',
    color: '#3b82f6',
    notes: 'Luyện đề thi học sinh giỏi & chuyên đề Hàm số bậc hai, Hệ thức lượng tam giác',
    phone: '0912 345 678'
  },
  {
    id: 'extra-anh',
    subject: 'Tiếng Anh Giao Tiếp & Luyện Thi IELTS 10',
    teacher: 'Cô Mai Anh',
    location: 'Học Trực Tuyến (Google Meet)',
    daysOfWeek: ['T3', 'T5'],
    startTime: '19:30',
    endTime: '21:00',
    tuitionFee: '600.000đ / tháng',
    tuitionStatus: 'paid',
    color: '#8b5cf6',
    notes: 'Rèn luyện kỹ năng Speaking & Writing Task 1, giải đề Cambridge',
    phone: '0988 765 432'
  },
  {
    id: 'extra-ly',
    subject: 'Vật Lý 10 - Động Lực Học Chất Điểm',
    teacher: 'Thầy Quân',
    location: 'Nhà riêng Thầy Quân (Số 45 Đường 3/2)',
    daysOfWeek: ['T7', 'CN'],
    startTime: '15:00',
    endTime: '16:30',
    tuitionFee: '450.000đ / tháng',
    tuitionStatus: 'unpaid',
    color: '#10b981',
    notes: 'Ôn tập 3 Định luật Newton và bài toán lực ma sát, lực căng dây',
    phone: '0903 112 233'
  },
  {
    id: 'extra-hoa',
    subject: 'Hóa Học 10 - Bảng Tuần Hoàn & Liên Kết',
    teacher: 'Cô Nhi',
    location: 'Trung tâm Vĩnh Thạnh (Phòng 105)',
    daysOfWeek: ['T3', 'T6'],
    startTime: '17:30',
    endTime: '19:00',
    tuitionFee: '450.000đ / tháng',
    tuitionStatus: 'paid',
    color: '#f59e0b',
    notes: 'Phân dạng bài tập đồng vị, cấu hình electron và quy tắc octet',
    phone: '0977 445 566'
  }
];

