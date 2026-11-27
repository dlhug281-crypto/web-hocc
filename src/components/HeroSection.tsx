import React from 'react';
import { motion } from 'motion/react';
import {
  Search,
  LayoutGrid,
  List,
  Calendar,
  Sparkles,
  School,
  Award,
  TrendingUp,
  X,
  Flag
} from 'lucide-react';
import { TrackCategory } from '../types/classroom';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedGrade: string; // 'all' | '10' | '11' | '12'
  onSelectGrade: (grade: string) => void;
  selectedTrack: string;
  onSelectTrack: (track: string) => void;
  viewMode: 'grid' | 'table' | 'schedule';
  onViewModeChange: (mode: 'grid' | 'table' | 'schedule') => void;
  totalClasses: number;
  totalStudents: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedGrade,
  onSelectGrade,
  selectedTrack,
  onSelectTrack,
  viewMode,
  onViewModeChange,
  totalClasses,
  totalStudents
}) => {
  const gradeOptions = [
    { id: 'all', label: 'Tất Cả Khối' },
    { id: '10', label: 'Khối 10 (CT Mới)' },
    { id: '11', label: 'Khối 11' },
    { id: '12', label: 'Khối 12 (Tốt Nghiệp)' },
  ];

  const trackOptions = [
    { id: 'all', label: 'Tất Cả Ban Chuyên Môn' },
    { id: 'natural', label: 'Ban Tự Nhiên (KHTN)' },
    { id: 'social', label: 'Ban Xã Hội (KHXH)' },
    { id: 'english', label: 'Chuyên Anh (D01)' },
    { id: 'stem', label: 'STEM - Tin Học' },
  ];

  return (
    <section className="relative pt-8 pb-6 overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-emerald-600/10 blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        
        {/* Main Headline */}
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2.5"
          >
            <School className="w-4 h-4" />
            <span>Trường Trung Học Phổ Thông EduMotion · Năm Học 2026 - 2027</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
          >
            Danh Sách Lớp Học & Quản Lý Nề Nếp THPT
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl"
          >
            Hệ thống điện tử hóa danh sách các lớp Khối 10, 11 và 12; theo dõi tiến độ phân phối chương trình GDPT, sổ điểm danh nề nếp và thời khóa biểu theo tiết học.
          </motion.p>
        </div>

        {/* Live Metrics Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs"
        >
          <div className="p-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">Quy Mô Lớp Học</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {totalClasses}
              </span>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">lớp THPT</span>
            </div>
          </div>

          <div className="p-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">Tổng Số Đoàn Viên - Học Sinh</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {totalStudents}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">học sinh</span>
            </div>
          </div>

          <div className="p-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">Tỷ Lệ Chuyên Cần Tuần 9</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                98.6%
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Xuất sắc</span>
            </div>
          </div>

          <div className="p-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">Điểm Thi Đua Bình Quân</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                8.74
              </span>
              <span className="text-xs text-amber-500 font-medium flex items-center gap-1">
                <Flag className="w-3 h-3" /> Cờ đỏ
              </span>
            </div>
          </div>
        </motion.div>

        {/* Search, Filter Bar and View Mode Switcher */}
        <div className="space-y-3.5">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm lớp (12A1, 10 Tin), giáo viên chủ nhiệm, phòng học..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Mode & Grade Filter */}
            <div className="flex items-center gap-2.5 shrink-0 justify-between md:justify-end">
              
              {/* Grade Selector */}
              <select
                value={selectedGrade}
                onChange={(e) => onSelectGrade(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-xs cursor-pointer font-medium"
              >
                {gradeOptions.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>

              {/* View Mode Segmented Control */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onViewModeChange('grid')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'grid'
                      ? 'text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Chế độ lưới thẻ 3D"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lưới 3D</span>
                </button>

                <button
                  type="button"
                  onClick={() => onViewModeChange('table')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'table'
                      ? 'text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Sổ theo dõi lớp học"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sổ Lớp</span>
                </button>

                <button
                  type="button"
                  onClick={() => onViewModeChange('schedule')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'schedule'
                      ? 'text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Thời khóa biểu theo tiết"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lịch Tiết</span>
                </button>
              </div>

            </div>

          </div>

          {/* Track Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {trackOptions.map((trk) => {
              const isSelected = selectedTrack === trk.id;
              return (
                <button
                  key={trk.id}
                  onClick={() => onSelectTrack(trk.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 ring-1 ring-indigo-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{trk.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
