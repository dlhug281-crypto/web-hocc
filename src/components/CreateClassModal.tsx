import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, School } from 'lucide-react';
import { ClassItem, GradeLevel, TrackCategory } from '../types/classroom';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newClass: ClassItem) => void;
}

export const CreateClassModal: React.FC<CreateClassModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    grade: 10 as GradeLevel,
    track: 'natural' as TrackCategory,
    teacherName: '',
    teacherSubject: 'Toán Học',
    monitorName: '',
    room: 'Phòng 102 - Dãy Nhà A (Tầng 1)',
    session: 'Sáng (07:00 - 11:15)' as 'Sáng (07:00 - 11:15)' | 'Chiều (13:30 - 17:15)',
    maxEnrollment: 42,
    description: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.code || !formData.teacherName) return;

    const trackLabels: Record<TrackCategory, string> = {
      natural: 'Ban Tự Nhiên (Toán - Lý - Hóa)',
      social: 'Ban Xã Hội (Văn - Sử - Địa)',
      english: 'Chuyên Ngoại Ngữ (D01)',
      stem: 'Ban STEM & Tin Học',
      general: 'Cơ Bản'
    };

    const newClass: ClassItem = {
      id: `thpt-${Date.now()}`,
      code: formData.code.toUpperCase(),
      title: formData.title,
      grade: Number(formData.grade) as GradeLevel,
      track: formData.track,
      trackLabel: trackLabels[formData.track],
      homeroomTeacher: {
        name: formData.teacherName,
        role: `GVCN Lớp ${formData.code.toUpperCase()}`,
        subject: formData.teacherSubject,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        phone: '0912.000.111',
        email: `${formData.code.toLowerCase()}@thpt-edumotion.edu.vn`,
        yearsOfExperience: 10
      },
      monitorName: formData.monitorName || 'Trần Văn Minh',
      room: formData.room,
      session: formData.session,
      enrollment: {
        current: Number(formData.maxEnrollment) || 40,
        max: Number(formData.maxEnrollment) || 42,
        maleCount: Math.floor((Number(formData.maxEnrollment) || 40) / 2),
        femaleCount: Math.ceil((Number(formData.maxEnrollment) || 40) / 2)
      },
      progress: {
        currentWeek: 9,
        totalWeeks: 18,
        semester: 'Học kỳ I',
        percent: 50
      },
      rankInSchool: {
        disciplineRank: `Hạng Tiêu Biểu Khối ${formData.grade}`,
        flagStatus: 'Cờ thi đua',
        avgScore: 8.5
      },
      image: '/src/assets/images/high_school_classroom_1793548218802.jpg',
      description: formData.description || 'Lớp học nỗ lực rèn luyện phẩm chất và năng lực theo chương trình Giáo dục Phổ thông mới.',
      nextActivity: 'Tiết 1 Ngày mai: Sinh hoạt nề nếp đầu tuần',
      lessonPlans: [
        { week: 1, topic: 'Ổn định tổ chức lớp và phân công ban cán sự', subjectDetail: 'Sinh hoạt chủ nhiệm', status: 'completed' },
        { week: 4, topic: 'Khảo sát chất lượng đầu năm học', subjectDetail: 'Toàn trường', status: 'completed' },
        { week: 9, topic: 'Ôn tập và kiểm tra định kỳ Giữa Học Kỳ I', subjectDetail: 'Các môn văn hóa', status: 'current', examNote: 'Thi Giữa Kỳ I' },
        { week: 18, topic: 'Thi kết thúc Học kỳ I & Đánh giá thi đua lớp', subjectDetail: 'Học kỳ I', status: 'upcoming', examNote: 'Thi Học Kỳ I' }
      ],
      students: [
        { id: `st-new-${Date.now()}-1`, name: formData.monitorName || 'Trần Văn Minh', studentCode: `HS${formData.grade}099`, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', roleInClass: 'Lớp trưởng', attendance: 100, status: 'present', gpa: 9.0, conduct: 'Tốt' }
      ]
    };

    onCreate(newClass);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 my-8"
        >
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600">
                <School className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Mở Lớp Học THPT Mới
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Đăng ký hồ sơ lớp học và phân công Giáo viên chủ nhiệm mới.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tên Lớp Đầy Đủ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lớp 10A2 - Ban Khoa Học Tự Nhiên"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Ký Hiệu Lớp *
                </label>
                <input
                  type="text"
                  required
                  placeholder="10A2"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Khối Lớp
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: Number(e.target.value) as GradeLevel })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={10}>Khối 10 (Lớp 10)</option>
                  <option value={11}>Khối 11 (Lớp 11)</option>
                  <option value={12}>Khối 12 (Lớp 12)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Ban Chuyên Môn
                </label>
                <select
                  value={formData.track}
                  onChange={(e) => setFormData({ ...formData, track: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="natural">Ban Tự Nhiên (KHTN)</option>
                  <option value="social">Ban Xã Hội (KHXH)</option>
                  <option value="english">Chuyên Anh (D01)</option>
                  <option value="stem">STEM & Tin Học</option>
                  <option value="general">Cơ Bản</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Buổi Học
                </label>
                <select
                  value={formData.session}
                  onChange={(e) => setFormData({ ...formData, session: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Sáng (07:00 - 11:15)">Sáng (Tiết 1 - 5)</option>
                  <option value="Chiều (13:30 - 17:15)">Chiều (Tiết 6 - 9)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Giáo Viên Chủ Nhiệm (GVCN) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Thầy Nguyễn Văn Nam"
                  value={formData.teacherName}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Môn Giảng Dạy Chính
                </label>
                <input
                  type="text"
                  placeholder="Toán Học / Vật Lý / Ngữ Văn"
                  value={formData.teacherSubject}
                  onChange={(e) => setFormData({ ...formData, teacherSubject: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Phòng Học
                </label>
                <input
                  type="text"
                  placeholder="Phòng 204 - Dãy Nhà B"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Lớp Trưởng
                </label>
                <input
                  type="text"
                  placeholder="Trần Quốc Anh"
                  value={formData.monitorName}
                  onChange={(e) => setFormData({ ...formData, monitorName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Sĩ Số Lớp
                </label>
                <input
                  type="number"
                  min="30"
                  max="50"
                  value={formData.maxEnrollment}
                  onChange={(e) => setFormData({ ...formData, maxEnrollment: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Đặc Điểm & Phong Trào Lớp
              </label>
              <textarea
                rows={2}
                placeholder="Mô tả phong trào học tập, thế mạnh môn chuyên của lớp..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Lưu & Mở Lớp THPT</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
