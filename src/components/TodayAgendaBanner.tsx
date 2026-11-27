import React from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin, CheckCircle, Circle, ArrowRight, User, AlertCircle, Sparkles, BookOpen, GraduationCap } from 'lucide-react';
import { ScheduleSlot, DayOfWeek, HomeworkTask, ExtraClassItem } from '../types/personalSchedule';

interface TodayAgendaBannerProps {
  todaySlots: ScheduleSlot[];
  todayTasks: HomeworkTask[];
  todayExtraClasses?: ExtraClassItem[];
  onNavigateToExtra?: () => void;
  onToggleSlotCompleted: (slotId: string) => void;
  onOpenAddSlot: () => void;
  onOpenAddTask: () => void;
  currentDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
}

const DAY_LABELS: Record<DayOfWeek, string> = {
  T2: 'Thứ Hai',
  T3: 'Thứ Ba',
  T4: 'Thứ Tư',
  T5: 'Thứ Năm',
  T6: 'Thứ Sáu',
  T7: 'Thứ Bảy',
  CN: 'Chủ Nhật'
};

export const TodayAgendaBanner: React.FC<TodayAgendaBannerProps> = ({
  todaySlots,
  todayTasks,
  todayExtraClasses = [],
  onNavigateToExtra,
  onToggleSlotCompleted,
  onOpenAddSlot,
  onOpenAddTask,
  currentDay,
  onSelectDay
}) => {
  const completedSlotsCount = todaySlots.filter((s) => s.completedToday).length;
  const progressPercent = todaySlots.length > 0
    ? Math.round((completedSlotsCount / todaySlots.length) * 100)
    : 0;

  const urgentTasks = todayTasks.filter((t) => !t.isDone && t.priority === 'high');

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-indigo-800/40">
        {/* Ambient background blur elements */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Lịch trình cá nhân hôm nay · {DAY_LABELS[currentDay]}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {todaySlots.length > 0
                ? `Hôm nay bạn có ${todaySlots.length} tiết học`
                : 'Hôm nay bạn không có lịch học cố định'}
            </h2>

            <p className="text-xs sm:text-sm text-indigo-200/80 leading-relaxed">
              {urgentTasks.length > 0 ? (
                <span className="text-amber-300 font-semibold">
                  ⚠️ Có {urgentTasks.length} bài tập quan trọng cần hoàn thành sớm!
                </span>
              ) : (
                'Theo dõi bài giảng, đánh dấu các tiết đã học xong và chuẩn bị bài tập đúng hạn.'
              )}
            </p>
          </div>

          {/* Progress Circle & Quick Stat */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md shrink-0">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-indigo-300 block">
                Tiến độ ngày
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black font-mono tabular-nums">
                  {completedSlotsCount}/{todaySlots.length}
                </span>
                <span className="text-xs text-indigo-200">tiết đã học</span>
              </div>
              <div className="w-32 h-1.5 rounded-full bg-white/10 overflow-hidden mt-1">
                <motion.div
                  className="h-full bg-emerald-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>

            <div className="text-right pl-3 border-l border-white/10">
              <span className="text-xs text-indigo-300 block">Hoàn thành</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Day Selector Strip */}
        <div className="mt-8 pt-5 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {(['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] as DayOfWeek[]).map((day) => {
            const isSelected = currentDay === day;
            return (
              <button
                key={day}
                onClick={() => onSelectDay(day)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-indigo-950 font-bold shadow-md'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                <span>{DAY_LABELS[day]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's Timeline Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Chi Tiết Lịch Học {DAY_LABELS[currentDay]}</span>
          </h3>

          <button
            onClick={onOpenAddSlot}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            + Thêm tiết vào ngày này
          </button>
        </div>

        {todaySlots.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Ngày này chưa có tiết học nào.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Bạn có thể dành thời gian tự học, nghỉ ngơi hoặc bấm nút bên dưới để tạo lịch mới.
            </p>
            <button
              onClick={onOpenAddSlot}
              className="mt-3 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
            >
              + Thêm Tiết Học Mới
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {todaySlots.map((slot) => {
              const isDone = !!slot.completedToday;
              return (
                <motion.div
                  key={slot.id}
                  whileHover={{ scale: 1.01 }}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-3 ${
                    isDone
                      ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 opacity-80'
                      : 'border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Checkbox button */}
                    <button
                      onClick={() => onToggleSlotCompleted(slot.id)}
                      className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        isDone
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'border-2 border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-transparent'
                      }`}
                      title={isDone ? 'Bỏ đánh dấu' : 'Đánh dấu đã học xong'}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{slot.period}</span>
                        <span>·</span>
                        <span>{slot.startTime} - {slot.endTime}</span>
                        {slot.isSelfStudy && (
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded">
                            Tự học
                          </span>
                        )}
                      </div>

                      <h4 className={`text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5 ${
                        isDone ? 'line-through text-slate-500 dark:text-slate-400' : ''
                      }`}>
                        {slot.subject}
                      </h4>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{slot.room}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{slot.teacher}</span>
                        </span>
                      </div>

                      {slot.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg leading-relaxed">
                          📝 {slot.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject color indicator dot */}
                  <div
                    className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: slot.color }}
                  />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Evening Extra Classes / Lịch Học Thêm Chiều Tối */}
        {todayExtraClasses.length > 0 && (
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Ca Học Thêm Chiều & Tối ({todayExtraClasses.length} ca)
                </h4>
              </div>

              {onNavigateToExtra && (
                <button
                  onClick={onNavigateToExtra}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Xem chi tiết lịch học thêm</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {todayExtraClasses.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                      <span className="font-bold">{item.startTime} - {item.endTime}</span>
                      <span>·</span>
                      <span className="truncate">{item.teacher}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.subject}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      item.tuitionStatus === 'paid'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}>
                      {item.tuitionStatus === 'paid' ? 'Đã đóng học phí' : 'Chưa đóng'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
