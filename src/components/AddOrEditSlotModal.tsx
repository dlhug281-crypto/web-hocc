import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, MapPin, User, Palette, Check } from 'lucide-react';
import { ScheduleSlot, DayOfWeek, SubjectItem } from '../types/personalSchedule';

interface AddOrEditSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (slot: ScheduleSlot) => void;
  initialSlot?: ScheduleSlot | null;
  defaultDay?: DayOfWeek;
  subjects: SubjectItem[];
}

const COLOR_PRESETS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#ef4444', // red
  '#64748b', // slate
];

export const AddOrEditSlotModal: React.FC<AddOrEditSlotModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSlot,
  defaultDay = 'T2',
  subjects,
}) => {
  const [day, setDay] = useState<DayOfWeek>(defaultDay);
  const [period, setPeriod] = useState('Tiết 1 - 2');
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('08:35');
  const [subject, setSubject] = useState('Toán Học');
  const [room, setRoom] = useState('Phòng 301');
  const [teacher, setTeacher] = useState('Thầy Cường');
  const [color, setColor] = useState('#3b82f6');
  const [notes, setNotes] = useState('');
  const [isSelfStudy, setIsSelfStudy] = useState(false);

  useEffect(() => {
    if (initialSlot) {
      setDay(initialSlot.day);
      setPeriod(initialSlot.period);
      setStartTime(initialSlot.startTime);
      setEndTime(initialSlot.endTime);
      setSubject(initialSlot.subject);
      setRoom(initialSlot.room);
      setTeacher(initialSlot.teacher);
      setColor(initialSlot.color);
      setNotes(initialSlot.notes || '');
      setIsSelfStudy(!!initialSlot.isSelfStudy);
    } else {
      setDay(defaultDay);
      setPeriod('Tiết 1 - 2');
      setStartTime('07:00');
      setEndTime('08:35');
      if (subjects.length > 0) {
        setSubject(subjects[0].name);
        setColor(subjects[0].color);
        setTeacher(subjects[0].teacher);
        setRoom(subjects[0].room || 'Phòng 301');
      }
      setNotes('');
      setIsSelfStudy(false);
    }
  }, [initialSlot, defaultDay, isOpen]);

  if (!isOpen) return null;

  const handleSelectSubjectPreset = (subName: string) => {
    setSubject(subName);
    const matched = subjects.find((s) => s.name === subName);
    if (matched) {
      setColor(matched.color);
      setTeacher(matched.teacher);
      if (matched.room) setRoom(matched.room);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    const newSlot: ScheduleSlot = {
      id: initialSlot ? initialSlot.id : `slot-${Date.now()}`,
      day,
      period,
      startTime,
      endTime,
      subject: subject.trim(),
      room: room.trim() || 'Phòng học',
      teacher: teacher.trim() || 'Tự học',
      color,
      notes: notes.trim(),
      isSelfStudy,
      completedToday: initialSlot ? initialSlot.completedToday : false,
    };

    onSave(newSlot);
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
          className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 my-8"
        >
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {initialSlot ? 'Chỉnh Sửa Tiết Học' : 'Thêm Tiết Học Vào Thời Khóa Biểu'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Cập nhật thông tin tiết học, phòng học và thời gian của bạn.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Day of Week */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Ngày Trong Tuần
              </label>
              <div className="grid grid-cols-7 gap-1.5">
                {[
                  { key: 'T2', label: 'T2' },
                  { key: 'T3', label: 'T3' },
                  { key: 'T4', label: 'T4' },
                  { key: 'T5', label: 'T5' },
                  { key: 'T6', label: 'T6' },
                  { key: 'T7', label: 'T7' },
                  { key: 'CN', label: 'CN' },
                ].map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setDay(d.key as DayOfWeek)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      day === d.key
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject selector or input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Tên Môn Học *</span>
                <span className="text-[11px] text-slate-400 font-normal">Chọn nhanh từ danh sách</span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {subjects.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectSubjectPreset(s.name)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                      subject === s.name
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              <input
                type="text"
                required
                placeholder="Ví dụ: Toán Học / Tiếng Anh IELTS / Tự Học"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Period Name & Time Range */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Ký Hiệu Tiết
                </label>
                <input
                  type="text"
                  placeholder="Tiết 1-2 / Ca Tối"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Bắt Đầu
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Kết Thúc
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Room & Teacher */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Phòng Học / Địa Điểm
                </label>
                <input
                  type="text"
                  placeholder="Phòng 301 / Lab 2 / Nhà"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Giáo Viên / Giảng Viên
                </label>
                <input
                  type="text"
                  placeholder="Thầy/Cô..."
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Color Palette */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Màu Nhận Diện Tiết Học
              </label>
              <div className="flex items-center gap-2">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className="w-6 h-6 rounded-full border border-black/10 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                    style={{ backgroundColor: c }}
                  >
                    {color === c && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Ghi Chú Tiết Học (Chuẩn bị sách, đồ dùng, bài tập...)
              </label>
              <input
                type="text"
                placeholder="Mang máy tính Casio, sách bài tập trang 45..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Is Self Study Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isSelfStudy}
                onChange={(e) => setIsSelfStudy(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Đây là ca tự học cá nhân (không phải học trên lớp)</span>
            </label>

            {/* Submit buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                {initialSlot ? 'Cập Nhật Tiết Học' : 'Lưu Vào Thời Khóa Biểu'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
