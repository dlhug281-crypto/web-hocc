import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, MapPin, User, Plus, Trash2, Edit3, CheckCircle, Calendar, Sparkles } from 'lucide-react';
import { ScheduleSlot, DayOfWeek } from '../types/personalSchedule';

interface WeeklyTimetableGridProps {
  slots: ScheduleSlot[];
  onAddSlotAtDay: (day: DayOfWeek) => void;
  onEditSlot: (slot: ScheduleSlot) => void;
  onDeleteSlot: (slotId: string) => void;
  onToggleSlotCompleted: (slotId: string) => void;
}

const DAYS: { key: DayOfWeek; label: string; fullLabel: string }[] = [
  { key: 'T2', label: 'T2', fullLabel: 'Thứ Hai' },
  { key: 'T3', label: 'T3', fullLabel: 'Thứ Ba' },
  { key: 'T4', label: 'T4', fullLabel: 'Thứ Tư' },
  { key: 'T5', label: 'T5', fullLabel: 'Thứ Năm' },
  { key: 'T6', label: 'T6', fullLabel: 'Thứ Sáu' },
  { key: 'T7', label: 'T7', fullLabel: 'Thứ Bảy' },
  { key: 'CN', label: 'CN', fullLabel: 'Chủ Nhật' },
];

export const WeeklyTimetableGrid: React.FC<WeeklyTimetableGridProps> = ({
  slots,
  onAddSlotAtDay,
  onEditSlot,
  onDeleteSlot,
  onToggleSlotCompleted,
}) => {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');

  // Unique subjects
  const subjectOptions = Array.from(new Set(slots.map((s) => s.subject)));

  const filteredSlots = selectedSubjectFilter === 'all'
    ? slots
    : slots.filter((s) => s.subject === selectedSubjectFilter);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Thời Khóa Biểu Cá Nhân (Thứ 2 - Chủ Nhật)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Bấm vào bất kỳ tiết học nào để chỉnh sửa, hoặc bấm dấu (+) ở đầu cột ngày để thêm tiết mới.
          </p>
        </div>

        {/* Filter by subject */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-500 dark:text-slate-400">Lọc môn:</span>
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Tất cả môn học ({slots.length} tiết)</option>
            {subjectOptions.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 7-Day Timetable Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {DAYS.map((day) => {
          const daySlots = filteredSlots
            .filter((s) => s.day === day.key)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div
              key={day.key}
              className="flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-slate-50/60 dark:bg-slate-900/40 p-3 min-h-[360px]"
            >
              {/* Day Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {day.fullLabel}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {daySlots.length} tiết học
                  </span>
                </div>

                <button
                  onClick={() => onAddSlotAtDay(day.key)}
                  className="w-6 h-6 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-colors cursor-pointer"
                  title={`Thêm tiết vào ${day.fullLabel}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Slot Cards List */}
              <div className="space-y-2.5 flex-1 overflow-y-auto">
                {daySlots.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-center p-2 text-slate-400 text-xs">
                    <p className="text-[11px]">Trống</p>
                    <button
                      onClick={() => onAddSlotAtDay(day.key)}
                      className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      + Thêm tiết
                    </button>
                  </div>
                ) : (
                  daySlots.map((slot) => {
                    const isDone = !!slot.completedToday;
                    return (
                      <motion.div
                        key={slot.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`group relative p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                          isDone
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 opacity-75'
                            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:shadow-md hover:border-indigo-400/50'
                        }`}
                        style={{ borderLeftColor: slot.color, borderLeftWidth: '3px' }}
                      >
                        <div>
                          {/* Time & Period */}
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                              {slot.startTime} - {slot.endTime}
                            </span>
                            <span>{slot.period}</span>
                          </div>

                          {/* Subject Name */}
                          <h5 className={`font-bold text-slate-900 dark:text-white leading-tight ${
                            isDone ? 'line-through text-slate-500' : ''
                          }`}>
                            {slot.subject}
                          </h5>

                          {/* Location & Teacher */}
                          <div className="mt-1.5 space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <div className="truncate flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                              <span>{slot.room}</span>
                            </div>
                            <div className="truncate flex items-center gap-1">
                              <User className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                              <span>{slot.teacher}</span>
                            </div>
                          </div>

                          {slot.notes && (
                            <p className="mt-1.5 text-[10px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded line-clamp-2">
                              {slot.notes}
                            </p>
                          )}
                        </div>

                        {/* Hover Action Strip */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onToggleSlotCompleted(slot.id)}
                            className={`p-1 rounded-md text-[10px] font-medium flex items-center gap-1 cursor-pointer ${
                              isDone ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-600'
                            }`}
                            title="Đánh dấu tiết học đã hoàn thành"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>{isDone ? 'Xong' : 'Học'}</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onEditSlot(slot)}
                              className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Sửa tiết học"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onDeleteSlot(slot.id)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Xóa tiết học"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
