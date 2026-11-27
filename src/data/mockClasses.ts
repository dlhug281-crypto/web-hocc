import { ClassItem } from '../types/classroom';

export const HIGH_SCHOOL_CLASSES: ClassItem[] = [
  {
    id: 'thpt-12a1',
    code: '12A1',
    title: 'Lớp 12A1 - Ban Khoa Học Tự Nhiên & Chuyên Toán',
    grade: 12,
    track: 'natural',
    trackLabel: 'Ban Tự Nhiên (Toán - Lý - Hóa)',
    homeroomTeacher: {
      name: 'Thầy Vũ Đình Cường',
      role: 'GVCN Lớp 12A1',
      subject: 'Toán Học & Giải Tích 12',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      phone: '0912.345.678',
      email: 'cuongvd@thpt-edumotion.edu.vn',
      yearsOfExperience: 16
    },
    monitorName: 'Nguyễn Hoàng Nam',
    room: 'Phòng 301 - Dãy Nhà A (Tầng 3)',
    session: 'Sáng (07:00 - 11:15)',
    enrollment: {
      current: 42,
      max: 42,
      maleCount: 22,
      femaleCount: 20
    },
    progress: {
      currentWeek: 9,
      totalWeeks: 18,
      semester: 'Học kỳ I',
      percent: 50
    },
    rankInSchool: {
      disciplineRank: 'Hạng 1 Toàn Khối 12',
      flagStatus: 'Cờ đỏ xuất sắc',
      avgScore: 8.92
    },
    image: '/src/assets/images/high_school_classroom_1793548218802.jpg',
    description: 'Tập thể lớp chọn mũi nhọn khối A00/A01 của trường. Chú trọng giải tích nâng cao, phương pháp tọa độ không gian Oxyz và rèn luyện kỹ năng giải nhanh đề thi Tốt nghiệp THPT Quốc gia.',
    nextActivity: 'Tiết 1 Ngày mai: Kiểm tra 15 phút Giải tích · Tiết 4: Vật lý thực hành',
    lessonPlans: [
      { week: 1, topic: 'Khảo sát sự biến thiên và vẽ đồ thị hàm số', subjectDetail: 'Toán 12 - Đại số', status: 'completed' },
      { week: 3, topic: 'Khối đa diện và thể tích khối đa diện lồi', subjectDetail: 'Toán 12 - Hình học', status: 'completed' },
      { week: 6, topic: 'Dao động điều hòa & Con lắc lò xo thẳng đứng', subjectDetail: 'Vật lý 12', status: 'completed' },
      { week: 9, topic: 'Hàm số lũy thừa, hàm số mũ và logarit', subjectDetail: 'Toán 12 - Chuẩn bị thi Giữa Kỳ I', status: 'current', examNote: 'Kiểm tra giữa kỳ I' },
      { week: 12, topic: 'Dòng điện xoay chiều RLC nối tiếp và cộng hưởng', subjectDetail: 'Vật lý 12 - Thí nghiệm đo góc lệch pha', status: 'upcoming' },
      { week: 15, topic: 'Kim loại kiềm, kiềm thổ và phức chất hữu cơ', subjectDetail: 'Hóa học 12', status: 'upcoming' },
      { week: 18, topic: 'Ôn tập tổng kết Học kỳ I & Thi kết thúc học phần', subjectDetail: 'Thi Học Kỳ I tập trung toàn trường', status: 'upcoming', examNote: 'Thi Học Kỳ I' }
    ],
    students: [
      { id: 'st-01', name: 'Nguyễn Hoàng Nam', studentCode: 'HS12001', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', roleInClass: 'Lớp trưởng', attendance: 100, status: 'present', gpa: 9.4, conduct: 'Tốt' },
      { id: 'st-02', name: 'Đặng Thu Thảo', studentCode: 'HS12002', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', roleInClass: 'Lớp phó học tập', attendance: 98, status: 'present', gpa: 9.6, conduct: 'Tốt' },
      { id: 'st-03', name: 'Trần Minh Anh', studentCode: 'HS12003', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', roleInClass: 'Bí thư Chi đoàn', attendance: 96, status: 'present', gpa: 9.1, conduct: 'Tốt' },
      { id: 'st-04', name: 'Lê Quốc Bảo', studentCode: 'HS12004', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', roleInClass: 'Lớp phó lao động', attendance: 95, status: 'present', gpa: 8.6, conduct: 'Tốt' },
      { id: 'st-05', name: 'Phạm Đức Khang', studentCode: 'HS12005', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80', roleInClass: 'Tổ trưởng', attendance: 92, status: 'late', gpa: 8.8, conduct: 'Tốt' },
      { id: 'st-06', name: 'Bùi Diệu Hương', studentCode: 'HS12006', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', roleInClass: 'Học sinh', attendance: 100, status: 'present', gpa: 9.2, conduct: 'Tốt' }
    ]
  },
  {
    id: 'thpt-12ca',
    code: '12 Anh',
    title: 'Lớp 12 Chuyên Anh - Khối D01 & IELTS',
    grade: 12,
    track: 'english',
    trackLabel: 'Chuyên Ngoại Ngữ (D01)',
    homeroomTeacher: {
      name: 'Cô Trần Thu Hà',
      role: 'GVCN Lớp 12 Chuyên Anh',
      subject: 'Tiếng Anh THPT & Luyện IELTS',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      phone: '0983.210.987',
      email: 'hath@thpt-edumotion.edu.vn',
      yearsOfExperience: 14
    },
    monitorName: 'Dương Khánh Linh',
    room: 'Phòng 304 - Dãy Nhà A (Tầng 3)',
    session: 'Sáng (07:00 - 11:15)',
    enrollment: {
      current: 38,
      max: 40,
      maleCount: 14,
      femaleCount: 24
    },
    progress: {
      currentWeek: 9,
      totalWeeks: 18,
      semester: 'Học kỳ I',
      percent: 50
    },
    rankInSchool: {
      disciplineRank: 'Hạng 2 Toàn Khối 12',
      flagStatus: 'Cờ thi đua',
      avgScore: 8.85
    },
    image: '/src/assets/images/high_school_assembly_1793548218866.jpg',
    description: 'Lớp mũi nhọn khối D01 và hội nhập quốc tế. 85% học sinh trong lớp sở hữu chứng chỉ IELTS từ 7.0 đến 8.0, tích cực tham gia các kỳ thi Học sinh giỏi cấp Tỉnh/Thành phố và tranh biện tiếng Anh.',
    nextActivity: 'Tiết Sinh Hoạt Lớp Thứ Bảy: Hướng nghiệp & chọn ngành xét tuyển Đại học',
    lessonPlans: [
      { week: 1, topic: 'Advanced Grammar: Inversion & Cleft Sentences', subjectDetail: 'Tiếng Anh 12', status: 'completed' },
      { week: 4, topic: 'Academic Essay Writing Task 2 - Problem & Solution', subjectDetail: 'Writing Skills', status: 'completed' },
      { week: 9, topic: 'Chuyên đề Tác phẩm Vợ Nhặt - Kim Lân', subjectDetail: 'Ngữ Văn 12 - Chuẩn bị thi Giữa Kỳ', status: 'current', examNote: 'Kiểm tra 1 tiết Văn' },
      { week: 12, topic: 'Idioms and Phrasal Verbs in High School Exams', subjectDetail: 'Luyện đề trắc nghiệm THPT', status: 'upcoming' },
      { week: 18, topic: 'Thi kết thúc Học kỳ I môn Tiếng Anh & Văn học', subjectDetail: 'Thi chung toàn khối 12', status: 'upcoming', examNote: 'Thi Học Kỳ I' }
    ],
    students: [
      { id: 'st-07', name: 'Dương Khánh Linh', studentCode: 'HS12007', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', roleInClass: 'Lớp trưởng', attendance: 100, status: 'present', gpa: 9.5, conduct: 'Tốt' },
      { id: 'st-08', name: 'Lê Gia Huy', studentCode: 'HS12008', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', roleInClass: 'Lớp phó học tập', attendance: 97, status: 'present', gpa: 9.3, conduct: 'Tốt' },
      { id: 'st-09', name: 'Nguyễn Mai Chi', studentCode: 'HS12009', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', roleInClass: 'Bí thư Chi đoàn', attendance: 95, status: 'present', gpa: 9.0, conduct: 'Tốt' }
    ]
  },
  {
    id: 'thpt-11a2',
    code: '11A2',
    title: 'Lớp 11A2 - Ban Tự Nhiên & Thực Nghiệm Vật Lý',
    grade: 11,
    track: 'natural',
    trackLabel: 'Ban Tự Nhiên (Toán - Tin - Lý)',
    homeroomTeacher: {
      name: 'Thầy Nguyễn Văn Tuấn',
      role: 'GVCN Lớp 11A2',
      subject: 'Vật Lý 11',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      phone: '0977.123.456',
      email: 'tuannv@thpt-edumotion.edu.vn',
      yearsOfExperience: 11
    },
    monitorName: 'Trần Quốc Đạt',
    room: 'Phòng 202 - Dãy Nhà B (Tầng 2)',
    session: 'Sáng (07:00 - 11:15)',
    enrollment: {
      current: 44,
      max: 45,
      maleCount: 26,
      femaleCount: 18
    },
    progress: {
      currentWeek: 9,
      totalWeeks: 18,
      semester: 'Học kỳ I',
      percent: 50
    },
    rankInSchool: {
      disciplineRank: 'Hạng 1 Toàn Khối 11',
      flagStatus: 'Cờ đỏ xuất sắc',
      avgScore: 8.65
    },
    image: '/src/assets/images/class_modern_physics_1793547672621.jpg',
    description: 'Lớp học sôi nổi, nhiều thành viên nòng cốt tham gia đội tuyển Thí nghiệm Khoa học trẻ và CLB Sáng tạo Kỹ thuật. Phòng học trang bị máy chiếu tương tác phục vụ bài giảng đa phương tiện.',
    nextActivity: 'Thứ Năm: Thực hành thí nghiệm đo suất điện động nguồn điện tại Lab Vật Lý',
    lessonPlans: [
      { week: 1, topic: 'Điện tích, định luật Cu-lông và điện trường', subjectDetail: 'Vật lý 11', status: 'completed' },
      { week: 4, topic: 'Công dòng điện, công suất và định luật Ôm toàn mạch', subjectDetail: 'Vật lý 11 - Bài tập mạch cầu', status: 'completed' },
      { week: 9, topic: 'Lượng giác 11 & Phương trình lượng giác cơ bản', subjectDetail: 'Toán 11 - Ôn thi Giữa Kỳ I', status: 'current', examNote: 'Thi Giữa Kỳ I' },
      { week: 13, topic: 'Khúc xạ ánh sáng và lăng kính quang học', subjectDetail: 'Vật lý 11 - Thực hành Lab', status: 'upcoming' },
      { week: 18, topic: 'Thi kết thúc học kỳ I các môn Tự nhiên', subjectDetail: 'Toàn khối 11', status: 'upcoming', examNote: 'Thi Học Kỳ I' }
    ],
    students: [
      { id: 'st-10', name: 'Trần Quốc Đạt', studentCode: 'HS11001', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', roleInClass: 'Lớp trưởng', attendance: 98, status: 'present', gpa: 9.1, conduct: 'Tốt' },
      { id: 'st-11', name: 'Nguyễn Thị Hải Yến', studentCode: 'HS11002', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', roleInClass: 'Lớp phó học tập', attendance: 100, status: 'present', gpa: 9.4, conduct: 'Tốt' },
      { id: 'st-12', name: 'Hoàng Minh Quân', studentCode: 'HS11003', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80', roleInClass: 'Bí thư Chi đoàn', attendance: 92, status: 'present', gpa: 8.5, conduct: 'Tốt' }
    ]
  },
  {
    id: 'thpt-11b1',
    code: '11B1',
    title: 'Lớp 11B1 - Khối Khoa Học Xã Hội & Ngữ Văn Sáng Tạo',
    grade: 11,
    track: 'social',
    trackLabel: 'Ban Xã Hội (Văn - Sử - Địa)',
    homeroomTeacher: {
      name: 'Cô Phan Bích Thủy',
      role: 'GVCN Lớp 11B1',
      subject: 'Ngữ Văn 11',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      phone: '0904.567.890',
      email: 'thuy.pb@thpt-edumotion.edu.vn',
      yearsOfExperience: 18
    },
    monitorName: 'Phạm Phương Thảo',
    room: 'Phòng 205 - Dãy Nhà B (Tầng 2)',
    session: 'Chiều (13:30 - 17:15)',
    enrollment: {
      current: 40,
      max: 42,
      maleCount: 12,
      femaleCount: 28
    },
    progress: {
      currentWeek: 9,
      totalWeeks: 18,
      semester: 'Học kỳ I',
      percent: 50
    },
    rankInSchool: {
      disciplineRank: 'Hạng 3 Toàn Khối 11',
      flagStatus: 'Tiêu biểu',
      avgScore: 8.48
    },
    image: '/src/assets/images/class_ui_ux_design_1793547671846.jpg',
    description: 'Tập thể năng động, sáng tạo với thế mạnh về văn hóa đọc, sân khấu hóa các tác phẩm văn học kinh điển và làm chủ bản tin phát thanh học đường của trường.',
    nextActivity: 'Thứ Sáu Tiết 8: Sinh hoạt chuyên đề Sân khấu hóa Văn học Dân gian',
    lessonPlans: [
      { week: 1, topic: 'Đặc trưng thể loại Bi kịch & Đoạn trích Vĩnh biệt Cửu Trùng Đài', subjectDetail: 'Ngữ Văn 11', status: 'completed' },
      { week: 4, topic: 'Cách mạng công nghiệp thế kỷ XVIII - XIX và biến đổi xã hội', subjectDetail: 'Lịch Sử 11', status: 'completed' },
      { week: 9, topic: 'Thơ mới lãng mạn Việt Nam 1932 - 1945: Xuân Diệu & Huy Cận', subjectDetail: 'Ngữ Văn 11 - Giữa Kỳ', status: 'current', examNote: 'Kiểm tra 1 tiết' },
      { week: 14, topic: 'Toàn cầu hóa và xu hướng hội nhập kinh tế quốc tế', subjectDetail: 'Địa Lý 11', status: 'upcoming' },
      { week: 18, topic: 'Kiểm tra chất lượng Học kỳ I', subjectDetail: 'Đánh giá năng lực theo chuẩn GDPT', status: 'upcoming', examNote: 'Thi Học Kỳ I' }
    ],
    students: [
      { id: 'st-13', name: 'Phạm Phương Thảo', studentCode: 'HS11004', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', roleInClass: 'Lớp trưởng', attendance: 98, status: 'present', gpa: 8.9, conduct: 'Tốt' },
      { id: 'st-14', name: 'Đỗ Hà My', studentCode: 'HS11005', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', roleInClass: 'Lớp phó học tập', attendance: 96, status: 'present', gpa: 9.1, conduct: 'Tốt' }
    ]
  },
  {
    id: 'thpt-10a1',
    code: '10A1',
    title: 'Lớp 10A1 - Lớp Chọn Cơ Bản Ban Tự Nhiên (CT Mới)',
    grade: 10,
    track: 'natural',
    trackLabel: 'Ban Tự Nhiên (Toán - Lý - Hóa)',
    homeroomTeacher: {
      name: 'Thầy Đỗ Quốc Bảo',
      role: 'GVCN Lớp 10A1',
      subject: 'Hóa Học 10',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      phone: '0918.789.012',
      email: 'baodq@thpt-edumotion.edu.vn',
      yearsOfExperience: 9
    },
    monitorName: 'Vũ Minh Trí',
    room: 'Phòng 101 - Dãy Nhà C (Tầng 1)',
    session: 'Sáng (07:00 - 11:15)',
    enrollment: {
      current: 45,
      max: 45,
      maleCount: 24,
      femaleCount: 21
    },
    progress: {
      currentWeek: 9,
      totalWeeks: 18,
      semester: 'Học kỳ I',
      percent: 50
    },
    rankInSchool: {
      disciplineRank: 'Hạng 1 Toàn Khối 10',
      flagStatus: 'Cờ đỏ xuất sắc',
      avgScore: 8.72
    },
    image: '/src/assets/images/high_school_classroom_1793548218802.jpg',
    description: 'Khóa học sinh lớp 10 theo chương trình Giáo dục Phổ thông 2018. Lớp học có nền tảng tư duy toán logic vững vàng, nề nếp kỷ cương tốt, tích cực trong các phong trào thi đua hoa điểm mười.',
    nextActivity: 'Thứ Ba Tiết 3: Khảo sát chất lượng giữa kỳ môn Hóa Học 10',
    lessonPlans: [
      { week: 1, topic: 'Mệnh đề toán học và tập hợp con', subjectDetail: 'Toán 10 - Chương trình mới', status: 'completed' },
      { week: 4, topic: 'Cấu tạo nguyên tử & bảng tuần hoàn các nguyên tố hóa học', subjectDetail: 'Hóa học 10', status: 'completed' },
      { week: 9, topic: 'Vectơ trong mặt phẳng tọa độ & Tích vô hướng của 2 vectơ', subjectDetail: 'Toán 10 - Hình học', status: 'current', examNote: 'Kiểm tra 15 phút' },
      { week: 13, topic: 'Chuyển động thẳng biến đổi đều và đồ thị vận tốc', subjectDetail: 'Vật lý 10', status: 'upcoming' },
      { week: 18, topic: 'Thi kết thúc học kỳ I toàn trường', subjectDetail: 'Đánh giá học lực và rèn luyện', status: 'upcoming', examNote: 'Thi Học Kỳ I' }
    ],
    students: [
      { id: 'st-15', name: 'Vũ Minh Trí', studentCode: 'HS10001', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80', roleInClass: 'Lớp trưởng', attendance: 100, status: 'present', gpa: 9.3, conduct: 'Tốt' },
      { id: 'st-16', name: 'Hoàng Ngọc Mai', studentCode: 'HS10002', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', roleInClass: 'Lớp phó học tập', attendance: 98, status: 'present', gpa: 9.5, conduct: 'Tốt' }
    ]
  },
  {
    id: 'thpt-10tin',
    code: '10 Tin',
    title: 'Lớp 10 Chuyên Tin Học & STEM Robotics',
    grade: 10,
    track: 'stem',
    trackLabel: 'Ban STEM & Tin Học (Python/C++)',
    homeroomTeacher: {
      name: 'Cô Vũ Mai Phương',
      role: 'GVCN Lớp 10 Tin',
      subject: 'Tin Học 10 & Thuật Toán',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      phone: '0936.456.789',
      email: 'phuongvm@thpt-edumotion.edu.vn',
      yearsOfExperience: 8
    },
    monitorName: 'Lê Minh Tuấn',
    room: 'Phòng Tin Học 1 & Lab Robotics (Tòa C)',
    session: 'Chiều (13:30 - 17:15)',
    enrollment: {
      current: 36,
      max: 38,
      maleCount: 25,
      femaleCount: 11
    },
    progress: {
      currentWeek: 9,
      totalWeeks: 18,
      semester: 'Học kỳ I',
      percent: 50
    },
    rankInSchool: {
      disciplineRank: 'Hạng 2 Toàn Khối 10',
      flagStatus: 'Cờ thi đua',
      avgScore: 8.8
    },
    image: '/src/assets/images/class_computer_science_1793547671259.jpg',
    description: 'Chuyên đề giải thuật lập trình Python/C++, cấu trúc dữ liệu cơ bản, thiết kế mạch vi điều khiển Arduino và chuẩn bị đội tuyển tham gia Hội thi Tin học trẻ toàn quốc.',
    nextActivity: 'Thứ Bảy: Tập huấn lập trình thuật toán giải quyết bài toán mảng 2 chiều',
    lessonPlans: [
      { week: 1, topic: 'Nhập môn lập trình Python: Kiểu dữ liệu và toán tử', subjectDetail: 'Tin học 10', status: 'completed' },
      { week: 4, topic: 'Cấu trúc rẽ nhánh if-else và vòng lặp for/while', subjectDetail: 'Tin học thực hành', status: 'completed' },
      { week: 9, topic: 'Xử lý chuỗi ký tự (String) và mảng danh sách List', subjectDetail: 'Chuẩn bị thi Giữa Kỳ', status: 'current', examNote: 'Kiểm tra trên máy' },
      { week: 13, topic: 'Thuật toán tìm kiếm nhị phân & sắp xếp Bubble/QuickSort', subjectDetail: 'Bồi dưỡng HSG Tin học', status: 'upcoming' },
      { week: 18, topic: 'Thi thực hành lập trình Học kỳ I', subjectDetail: 'Chấm điểm tự động qua máy chủ Themis', status: 'upcoming', examNote: 'Thi Học Kỳ I' }
    ],
    students: [
      { id: 'st-17', name: 'Lê Minh Tuấn', studentCode: 'HS10003', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', roleInClass: 'Lớp trưởng', attendance: 100, status: 'present', gpa: 9.6, conduct: 'Tốt' }
    ]
  }
];
