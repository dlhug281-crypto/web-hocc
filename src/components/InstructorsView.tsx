import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, BookOpen, Star, School, ExternalLink, Award } from 'lucide-react';
import { ClassItem } from '../types/classroom';

interface InstructorsViewProps {
  classes: ClassItem[];
  onSelectClass: (item: ClassItem) => void;
}

export const InstructorsView: React.FC<InstructorsViewProps> = ({
  classes,
  onSelectClass
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Hội Đồng Sư Phạm & Giáo Viên Chủ Nhiệm THPT
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Đội ngũ các thầy cô giáo viên chủ nhiệm tận tâm, nhiều năm kinh nghiệm bồi dưỡng học sinh giỏi và ôn thi Đại học.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls, idx) => {
          const teacher = cls.homeroomTeacher;
          return (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4">
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-xs"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {teacher.name}
                    </h4>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                      {teacher.role}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Môn giảng dạy: <strong className="text-slate-700 dark:text-slate-300">{teacher.subject}</strong>
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Thâm niên sư phạm:</span>
                    <span className="font-semibold">{teacher.yearsOfExperience || 12} năm công tác</span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-slate-400">Điện thoại liên hệ:</span>
                    <span>{teacher.phone}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-slate-400">Email công vụ:</span>
                    <span className="truncate max-w-[160px]">{teacher.email}</span>
                  </div>
                </div>

                {/* Assigned class card */}
                <div className="mt-4">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-2">
                    Lớp chủ nhiệm
                  </span>
                  <button
                    onClick={() => onSelectClass(cls)}
                    className="w-full text-left p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 block">
                        {cls.code} · Khối {cls.grade}
                      </span>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {cls.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {cls.room} · Sĩ số: {cls.enrollment.current} HS
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-indigo-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                  <Award className="w-3.5 h-3.5" /> Giáo viên dạy giỏi
                </span>
                <span className="text-slate-400">
                  {cls.session.split(' ')[0]}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
