import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import {
  Users,
  Clock,
  MapPin,
  Calendar,
  Bookmark,
  ArrowUpRight,
  Sparkles,
  School,
  CheckCircle,
  Flag,
  Award
} from 'lucide-react';
import { ClassItem } from '../types/classroom';

interface ClassCardProps {
  item: ClassItem;
  onSelect: (item: ClassItem) => void;
  onQuickAction: (item: ClassItem, action: 'checkin' | 'rate') => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  index: number;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  item,
  onSelect,
  onQuickAction,
  isBookmarked,
  onToggleBookmark,
  index
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for 3D physics tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.05, 0.3),
        ease: [0.16, 1, 0.3, 1]
      }}
      className="perspective-1000"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        className="group relative flex flex-col h-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-indigo-400/50 dark:hover:border-indigo-500/50 transition-all duration-300 overflow-hidden cursor-pointer"
        onClick={() => onSelect(item)}
      >
        {/* Dynamic Specular Glare */}
        {isHovered && (
          <div
            className="pointer-events-none absolute inset-0 z-20 rounded-2xl opacity-40 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 260px at ${(x.get() + 0.5) * 100}% ${(y.get() + 0.5) * 100}%, rgba(255,255,255,0.3), transparent 70%)`
            }}
          />
        )}

        {/* Classroom Image Banner */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <motion.img
            src={item.image}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent pointer-events-none" />

          {/* Floating tags */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <div className="px-2.5 py-1 rounded-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-xs flex items-center gap-1.5">
              <span>Khối {item.grade}</span>
              <span>·</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{item.code}</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(item.id);
              }}
              className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-rose-500 dark:hover:text-rose-400 transition-colors shadow-xs cursor-pointer"
              aria-label="Lưu lớp theo dõi"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  isBookmarked ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
            </button>
          </div>

          {/* Bottom Banner Status: Discipline flag */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs z-10">
            <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded backdrop-blur-md font-medium">
              <Flag className="w-3.5 h-3.5 text-amber-400" />
              <span>{item.rankInSchool.disciplineRank}</span>
            </div>
            <div className="bg-black/50 px-2 py-1 rounded backdrop-blur-md font-mono text-emerald-400 font-semibold tabular-nums">
              ĐTB: {item.rankInSchool.avgScore}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Track kicker (Zero-pill rule: unboxed text with separator) */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              <span>{item.trackLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{item.session}</span>
            </div>

            {/* Class Title */}
            <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {item.title}
            </h3>

            {/* Description */}
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {item.description}
            </p>

            {/* Location & Monitor */}
            <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">{item.room}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">Lớp trưởng: <strong className="text-slate-800 dark:text-slate-200">{item.monitorName}</strong></span>
              </div>
            </div>
          </div>

          {/* Footer Area: Homeroom teacher & Quick actions */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            {/* Semester progress */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500 dark:text-slate-400">
                  {item.progress.semester}: Tuần {item.progress.currentWeek}/{item.progress.totalWeeks}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                  {item.enrollment.current}/{item.enrollment.max} Học sinh
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress.percent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                />
              </div>
            </div>

            {/* Homeroom teacher */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={item.homeroomTeacher.avatar}
                  alt={item.homeroomTeacher.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {item.homeroomTeacher.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {item.homeroomTeacher.subject}
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0 text-right font-mono">
                Nam: {item.enrollment.maleCount} · Nữ: {item.enrollment.femaleCount}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(item);
                }}
                className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Hồ sơ lớp</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickAction(item, 'checkin');
                }}
                className="py-1.5 px-3.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Điểm danh sổ</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
