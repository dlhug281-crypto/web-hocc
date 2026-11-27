import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  MapPin,
  Users,
  Check,
  Flag,
  Award,
  Phone,
  Mail,
  School,
  Clock,
  BookOpen,
  Calendar
} from 'lucide-react';
import { ClassItem, Student } from '../types/classroom';

interface ClassDetailModalProps {
  item: ClassItem | null;
  onClose: () => void;
  onUpdateAttendance: (classId: string, studentId: string, status: 'present' | 'late' | 'excused' | 'unexcused') => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info') => void;
}

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({
  item,
  onClose,
  onUpdateAttendance,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'students' | 'discipline'>('overview');

  if (!item) return null;

  const tabs = [
    { id: 'overview', label: 'Hồ Sơ Lớp' },
    { id: 'curriculum', label: 'Phân Phối Chương Trình' },
    { id: 'students', label: `Sổ Danh Sách Học Sinh (${item.students.length})` },
    { id: 'discipline', label: 'Thi Đua & Nề Nếp' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]"
        >
          {/* Header Banner */}
          <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-800 shrink-0">
            <img
              src={item.image}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
              aria-label="Đóng sổ lớp"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title & Badge */}
            <div className="absolute bottom-4 left-6 right-6 text-white">
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-300 mb-1">
                <span className="font-bold">{item.code}</span>
                <span>·</span>
                <span>Khối {item.grade}</span>
                <span>·</span>
                <span>{item.trackLabel}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {item.title}
              </h2>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-6 gap-2 bg-slate-50 dark:bg-slate-900/60 overflow-x-auto shrink-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative py-3.5 px-3 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeModalTab"
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-100">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
                    Mục Tiêu & Đặc Điểm Tập Thể Lớp
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Địa Điểm & Buổi Học
                    </span>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <MapPin className="w-4 h-4 text-indigo-500" />
                      <span>{item.room}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.session}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Cơ Cấu Sĩ Số
                    </span>
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span>Sĩ số: {item.enrollment.current}/{item.enrollment.max}</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-mono text-xs">
                        {item.enrollment.maleCount} Nam · {item.enrollment.femaleCount} Nữ
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${(item.enrollment.current / item.enrollment.max) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Homeroom Teacher Profile */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">
                    Giáo Viên Chủ Nhiệm
                  </h4>
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60">
                    <img
                      src={item.homeroomTeacher.avatar}
                      alt={item.homeroomTeacher.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div className="flex-1">
                      <h5 className="text-sm font-bold">{item.homeroomTeacher.name}</h5>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                        {item.homeroomTeacher.role} · Môn: {item.homeroomTeacher.subject}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.homeroomTeacher.phone}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.homeroomTeacher.email}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2">
                  <span>Chương trình GDPT Học Kỳ I ({item.lessonPlans.length} mốc tiến độ chính)</span>
                  <span className="text-indigo-600 font-semibold">Chuẩn Bộ Giáo Dục & Đào Tạo</span>
                </div>

                <div className="space-y-3">
                  {item.lessonPlans.map((lp, index) => {
                    const isDone = lp.status === 'completed';
                    const isCurrent = lp.status === 'current';

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-xl border transition-all ${
                          isCurrent
                            ? 'border-indigo-500/50 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                              isDone
                                ? 'bg-emerald-500 text-white'
                                : isCurrent
                                ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}
                          >
                            {isDone ? <Check className="w-4 h-4" /> : lp.week}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-semibold">{lp.topic}</h5>
                              {lp.examNote && (
                                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded">
                                  {lp.examNote}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                              {lp.subjectDetail}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Sổ điểm danh nề nếp buổi học hôm nay</span>
                  <span className="font-mono">Sĩ số: {item.students.length} học sinh</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
                  {item.students.map((student) => (
                    <div
                      key={student.id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                              {student.name}
                            </p>
                            {student.roleInClass && student.roleInClass !== 'Học sinh' && (
                              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.2 rounded">
                                {student.roleInClass}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {student.studentCode} · Điểm TB: <strong className="text-slate-700 dark:text-slate-300">{student.gpa}</strong> · HK: {student.conduct}
                          </p>
                        </div>
                      </div>

                      {/* Interactive THPT Attendance States */}
                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button
                          onClick={() => {
                            onUpdateAttendance(item.id, student.id, 'present');
                            onShowToast(`Đã điểm danh ${student.name}`, 'Trạng thái: Có mặt', 'success');
                          }}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                            student.status === 'present'
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          Có mặt
                        </button>
                        <button
                          onClick={() => {
                            onUpdateAttendance(item.id, student.id, 'late');
                            onShowToast(`Đã điểm danh ${student.name}`, 'Trạng thái: Đi trễ', 'info');
                          }}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                            student.status === 'late'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          Đi trễ
                        </button>
                        <button
                          onClick={() => {
                            onUpdateAttendance(item.id, student.id, 'excused');
                            onShowToast(`Đã điểm danh ${student.name}`, 'Trạng thái: Nghỉ có phép (P)', 'info');
                          }}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                            student.status === 'excused'
                              ? 'bg-blue-500 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          Có phép (P)
                        </button>
                        <button
                          onClick={() => {
                            onUpdateAttendance(item.id, student.id, 'unexcused');
                            onShowToast(`Đã ghi nhận ${student.name}`, 'Trạng thái: Nghỉ không phép (K)', 'warning' as any);
                          }}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                            student.status === 'unexcused'
                              ? 'bg-rose-500 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          Không phép (K)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'discipline' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Flag className="w-6 h-6 text-amber-500" />
                    <div>
                      <h5 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                        {item.rankInSchool.disciplineRank}
                      </h5>
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        Danh hiệu: {item.rankInSchool.flagStatus} · Đạt 100 điểm thi đua tuần
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-amber-600">
                    Tuần 9: +15đ thi đua
                  </span>
                </div>

                <div className="space-y-2">
                  <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Nhật Ký Thi Đua Của Ban Cờ Đỏ
                  </h5>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                      <span>Đồng phục & Phù hiệu lớp: Đầy đủ 100%</span>
                      <span className="text-emerald-600 font-semibold">+10 điểm</span>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                      <span>Vệ sinh lớp học & Kê bàn ghế ngay ngắn: Rất sạch sẽ</span>
                      <span className="text-emerald-600 font-semibold">+10 điểm</span>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                      <span>Chào cờ đầu tuần: Xếp hàng nhanh, trật tự, nghiêm túc</span>
                      <span className="text-emerald-600 font-semibold">+10 điểm</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-3 shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Sổ theo dõi lớp: <code className="font-mono">{item.code}-THPT2026</code>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  onShowToast('Đã lưu sổ đầu bài & điểm danh', `Lớp ${item.title}`, 'success');
                  onClose();
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
              >
                Lưu Sổ Đầu Bài
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
