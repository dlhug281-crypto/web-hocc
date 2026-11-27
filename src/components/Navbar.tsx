import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, Plus, Calendar, Clock, CheckSquare, GraduationCap, Timer, Sparkles, User, Bot } from 'lucide-react';
import { AuthUser } from '../types/auth';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenAddSlotModal: () => void;
  onOpenAddTaskModal: () => void;
  onOpenAccountModal: () => void;
  onOpenAiModal: () => void;
  currentUser: AuthUser | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  userName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenAddSlotModal,
  onOpenAddTaskModal,
  onOpenAccountModal,
  onOpenAiModal,
  currentUser,
  isDarkMode,
  onToggleDarkMode,
  userName,
}) => {
  const navItems = [
    { id: 'schedule', label: 'Thời Khóa Biểu', icon: Calendar },
    { id: 'today', label: 'Hôm Nay', icon: Clock },
    { id: 'tasks', label: 'Bài Tập & Deadline', icon: CheckSquare },
    { id: 'extra', label: 'Lịch Học Thêm', icon: GraduationCap },
    { id: 'pomodoro', label: 'Học Tập Trung', icon: Timer },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onTabChange('schedule');
            }}
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 dark:text-white cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="font-extrabold">EduSchedule</span>
          </a>
          <span className="hidden sm:inline-block text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/40">
            Lớp 10A1
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-x-2 -bottom-2 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions + Account + Theme Toggle + Share */}
        <div className="flex items-center gap-2 shrink-0">
          {currentUser ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenAccountModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100/80 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800 rounded-lg transition-all cursor-pointer shadow-xs"
              title="Tài khoản cá nhân & Quản lý đồng bộ"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline font-bold">{currentUser.name}</span>
              <span className="sm:hidden font-bold">TK</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenAccountModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-all cursor-pointer shadow-xs"
              title="Đăng nhập tài khoản để đồng bộ sang điện thoại và máy tính"
            >
              <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Tài Khoản & Đồng Bộ</span>
              <span className="sm:hidden">Tài Khoản</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 hover:bg-purple-100/80 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 border border-purple-200/80 dark:border-purple-800 rounded-lg transition-all cursor-pointer shadow-xs"
            title="Mở Trợ lý Học tập AI (OpenAI & Gemini)"
          >
            <Bot className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">Trợ Lý AI</span>
            <span className="sm:hidden">AI</span>
          </motion.button>

          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Chuyển chế độ sáng/tối"
            title={isDarkMode ? 'Giao diện sáng' : 'Giao diện tối'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenAddSlotModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 rounded-lg shadow-sm shadow-indigo-600/20 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            title="Thêm tiết học mới vào thời khóa biểu"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Thêm Tiết Học</span>
            <span className="sm:hidden">Tiết Mới</span>
          </motion.button>
        </div>

      </div>

      {/* Mobile Bottom/Secondary Tab Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-100 dark:border-slate-800/80 px-2 py-1.5 bg-white/90 dark:bg-slate-950/90 text-xs">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`p-2 rounded-lg flex flex-col items-center gap-0.5 ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
