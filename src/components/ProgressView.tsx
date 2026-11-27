import React from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle2, Flag, Download, TrendingUp, School, Star } from 'lucide-react';
import { ClassItem } from '../types/classroom';

interface ProgressViewProps {
  classes: ClassItem[];
  onSelectClass: (item: ClassItem) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info') => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  classes,
  onSelectClass,
  onShowToast
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Báo Cáo Nề Nếp Thi Đua & Học Lực THPT
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tổng hợp kết quả học tập và phong trào thi đua tuần của các lớp Khối 10, Khối 11, Khối 12.
          </p>
        </div>

        <button
          onClick={() => onShowToast('Đang xuất báo cáo thi đua tuần', 'Bảng xếp loại cờ thi đua THPT EduMotion', 'success')}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 self-start sm:self-auto shadow-sm shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Tải Bảng Thi Đua Toàn Trường</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tiến Độ Chương Trình GDPT</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
              Tuần 9 / 18
            </span>
            <span className="text-xs text-slate-500">50% Học kỳ I</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full bg-indigo-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '50%' }}
              transition={{ duration: 1 }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tỷ Lệ Chuyên Cần Toàn Trường</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              98.6%
            </span>
            <span className="text-xs text-emerald-600 font-medium">+0.8% so với tuần 8</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '98.6%' }}
              transition={{ duration: 1 }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Lớp Đạt Cờ Đỏ Xuất Sắc</span>
            <Flag className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
              {classes.filter((c) => c.rankInSchool.flagStatus === 'Cờ đỏ xuất sắc').length} Lớp
            </span>
            <span className="text-xs text-slate-500">Dẫn đầu tuần</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full bg-amber-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Class Discipline Rankings */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
          Bảng Điểm Danh & Xếp Loại Thi Đua Từng Lớp
        </h4>
        <div className="space-y-3">
          {classes.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectClass(c)}
              className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-indigo-500/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{c.code}</span>
                  <span>·</span>
                  <span>Khối {c.grade}</span>
                  <span>·</span>
                  <span>{c.trackLabel}</span>
                </div>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {c.title}
                </h5>
                <p className="text-xs text-slate-500 mt-0.5">
                  GVCN: {c.homeroomTeacher.name} · Lớp trưởng: {c.monitorName} · {c.room}
                </p>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 justify-end">
                    <Flag className="w-3.5 h-3.5" />
                    <span>{c.rankInSchool.disciplineRank}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 block font-mono">
                    Điểm TB: {c.rankInSchool.avgScore} / 10
                  </span>
                </div>

                <div className="w-28 text-right hidden sm:block">
                  <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 block">
                    {c.enrollment.current}/{c.enrollment.max} HS
                  </span>
                  <span className="text-[10px] text-emerald-600">Đủ sĩ số</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
