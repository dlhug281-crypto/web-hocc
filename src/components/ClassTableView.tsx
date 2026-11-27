import React from 'react';
import { motion } from 'motion/react';
import { Users, Clock, MapPin, ArrowUpRight, CheckCircle, Bookmark, Flag } from 'lucide-react';
import { ClassItem } from '../types/classroom';

interface ClassTableViewProps {
  classes: ClassItem[];
  onSelect: (item: ClassItem) => void;
  onQuickAction: (item: ClassItem, action: 'checkin') => void;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (id: string) => void;
}

export const ClassTableView: React.FC<ClassTableViewProps> = ({
  classes,
  onSelect,
  onQuickAction,
  bookmarkedIds,
  onToggleBookmark
}) => {
  if (classes.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Không tìm thấy lớp học nào thuộc khối hoặc ban chuyên môn đã chọn.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-50/50 dark:bg-slate-800/40">
              <th className="py-3 px-4">Lớp & Ban Chuyên Môn</th>
              <th className="py-3 px-4">Giáo Viên Chủ Nhiệm</th>
              <th className="py-3 px-4">Phòng & Buổi Học</th>
              <th className="py-3 px-4">Sĩ Số / Cán Sự Lớp</th>
              <th className="py-3 px-4">Thi Đua Tuần</th>
              <th className="py-3 px-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
            {classes.map((cls, idx) => {
              const isBookmarked = bookmarkedIds.has(cls.id);

              return (
                <motion.tr
                  key={cls.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => onSelect(cls)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  {/* Title & Code */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(cls.id);
                        }}
                        className="text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            isBookmarked ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                      </button>

                      <div>
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">{cls.code}</span>
                          <span>·</span>
                          <span>Khối {cls.grade}</span>
                          <span>·</span>
                          <span>{cls.trackLabel}</span>
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {cls.title}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Homeroom teacher */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <img
                        src={cls.homeroomTeacher.avatar}
                        alt={cls.homeroomTeacher.name}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {cls.homeroomTeacher.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {cls.homeroomTeacher.subject}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Room & Session */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {cls.room}
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        {cls.session}
                      </div>
                    </div>
                  </td>

                  {/* Enrollment & Monitor */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div>
                      <span className="font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                        {cls.enrollment.current}/{cls.enrollment.max} HS
                      </span>
                      <span className="text-slate-400 text-[11px] block">
                        Lớp trưởng: {cls.monitorName}
                      </span>
                    </div>
                  </td>

                  {/* Discipline flag */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      <Flag className="w-3.5 h-3.5" />
                      <span>{cls.rankInSchool.disciplineRank}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      ĐTB: {cls.rankInSchool.avgScore}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(cls);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Sổ lớp</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickAction(cls, 'checkin');
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                      >
                        Điểm danh
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
