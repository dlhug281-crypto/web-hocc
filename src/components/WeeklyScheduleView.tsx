import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, MapPin, User, Calendar as CalendarIcon, ArrowRight, Flag, BookOpen } from 'lucide-react';
import { ClassItem } from '../types/classroom';

interface WeeklyScheduleViewProps {
  classes: ClassItem[];
  onSelectClass: (item: ClassItem) => void;
}

const DAYS_OF_WEEK = [
  { key: 'Thứ 2', label: 'Thứ Hai', short: 'T2', note: 'Chào cờ đầu tuần' },
  { key: 'Thứ 3', label: 'Thứ Ba', short: 'T3', note: 'Tiết học chính khóa' },
  { key: 'Thứ 4', label: 'Thứ Tư', short: 'T4', note: 'KHTN & Thực hành' },
  { key: 'Thứ 5', label: 'Thứ Năm', short: 'T5', note: 'KHXH & Ngoại ngữ' },
  { key: 'Thứ 6', label: 'Thứ Sáu', short: 'T6', note: 'Kiểm tra định kỳ' },
  { key: 'Thứ 7', label: 'Thứ Bảy', short: 'T7', note: 'Sinh hoạt lớp & Chi đoàn' },
];

export const WeeklyScheduleView: React.FC<WeeklyScheduleViewProps> = ({
  classes,
  onSelectClass
}) => {
  const [selectedDay, setSelectedDay] = useState('Thứ 2');

  return (
    <div className="space-y-6">
      {/* Day Selection Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 overflow-x-auto">
        <div className="flex items-center gap-2">
          {DAYS_OF_WEEK.map((day) => {
            const isSelected = selectedDay === day.key;

            return (
              <button
                key={day.key}
                onClick={() => setSelectedDay(day.key)}
                className={`relative px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex flex-col items-start cursor-pointer ${
                  isSelected
                    ? 'text-white bg-indigo-600 shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>{day.label}</span>
                </div>
                <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {day.note}
                </span>
              </button>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <CalendarIcon className="w-4 h-4 text-indigo-500" />
          <span>Thời Khóa Biểu THPT · Áp dụng từ Tuần 1 đến Tuần 18 (HK I)</span>
        </div>
      </div>

      {/* High school periods overview for selected day */}
      <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex flex-wrap items-center justify-between gap-3 text-xs text-indigo-950 dark:text-indigo-200">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="font-semibold">{selectedDay}:</span>
          <span>Ca Sáng (Tiết 1 - 5: 07:00 - 11:15)</span>
          <span>·</span>
          <span>Ca Chiều (Tiết 6 - 9: 13:30 - 16:45)</span>
        </div>
        {selectedDay === 'Thứ 2' && (
          <span className="font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <Flag className="w-3.5 h-3.5" /> 07:00: Nghi thức Chào cờ & Nhận xét nề nếp tuần
          </span>
        )}
        {selectedDay === 'Thứ 7' && (
          <span className="font-medium text-emerald-600 dark:text-emerald-400">
            Tiết 5: Sinh hoạt Chi đoàn & Đánh giá thi đua tuần
          </span>
        )}
      </div>

      {/* Class Schedule Grid for Selected Day */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {classes.map((cls, idx) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              onClick={() => onSelectClass(cls)}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                    <span className="font-mono">{cls.code}</span>
                    <span className="text-slate-400 font-normal">·</span>
                    <span className="font-medium">{cls.session.split(' ')[0]}</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {cls.room.split(' - ')[0]}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {cls.title}
                </h4>

                {/* Teacher and monitor info */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">GVCN: <strong>{cls.homeroomTeacher.name}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Môn chính: {cls.homeroomTeacher.subject}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-mono">
                  Sĩ số: {cls.enrollment.current} HS
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Sổ theo dõi <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
