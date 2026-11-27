/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { TodayAgendaBanner } from './components/TodayAgendaBanner';
import { WeeklyTimetableGrid } from './components/WeeklyTimetableGrid';
import { TasksDeadlinesView } from './components/TasksDeadlinesView';
import { ExtraClassesView } from './components/ExtraClassesView';
import { PomodoroFocusTimer } from './components/PomodoroFocusTimer';
import { AddOrEditSlotModal } from './components/AddOrEditSlotModal';
import { AddTaskModal } from './components/AddTaskModal';
import { BackupRestoreModal } from './components/BackupRestoreModal';
import { AccountModal } from './components/AccountModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { PrismaArchitectureModal } from './components/PrismaArchitectureModal';
import { Toast, ToastMessage } from './components/Toast';
import { ConfettiBurst } from './components/ConfettiBurst';
import { AuthUser, SyncDataPayload } from './types/auth';
import {
  saveToIndexedDB,
  getFromIndexedDB,
  requestPermanentStorage,
  getAccountsVault,
  saveAccountToVault
} from './utils/persistentStorage';
import {
  DEFAULT_SCHEDULE_SLOTS,
  DEFAULT_SUBJECTS,
  DEFAULT_TASKS,
  DEFAULT_PROFILE,
  DEFAULT_EXTRA_CLASSES
} from './data/defaultSchedule';
import {
  ScheduleSlot,
  SubjectItem,
  HomeworkTask,
  TaskAttachment,
  DayOfWeek,
  UserProfile,
  ExtraClassItem
} from './types/personalSchedule';

import { RotateCcw, FileText, Sparkles, School, ExternalLink, Calendar, Globe, ShieldCheck, Database, Bot, Layers } from 'lucide-react';

const STORAGE_VERSION = '10a1_v3';

export default function App() {
  // Determine current day of week (T2, T3, ..., CN)
  const getTodayDayOfWeek = (): DayOfWeek => {
    const dayNum = new Date().getDay(); // 0 is Sunday, 1 is Monday...
    const map: Record<number, DayOfWeek> = {
      0: 'CN',
      1: 'T2',
      2: 'T3',
      3: 'T4',
      4: 'T5',
      5: 'T6',
      6: 'T7'
    };
    return map[dayNum] || 'T2';
  };

  // LocalStorage state: Luôn ưu tiên ghi nhớ và nạp lại toàn bộ nội dung đã chỉnh sửa trước đó
  const [slots, setSlots] = useState<ScheduleSlot[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eduschedule_slots');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {}
      }
    }
    return DEFAULT_SCHEDULE_SLOTS;
  });

  const [subjects, setSubjects] = useState<SubjectItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eduschedule_subjects');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {}
      }
    }
    return DEFAULT_SUBJECTS;
  });

  const [tasks, setTasks] = useState<HomeworkTask[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eduschedule_tasks');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch (e) {}
      }
    }
    return DEFAULT_TASKS;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eduschedule_profile');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            return parsed;
          }
        } catch (e) {}
      }
    }
    return DEFAULT_PROFILE;
  });

  // Quản lý Lịch Học Thêm (Extra Classes) ngoài giờ
  const [extraClasses, setExtraClasses] = useState<ExtraClassItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eduschedule_extra_classes');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {}
      }
    }
    return DEFAULT_EXTRA_CLASSES;
  });

  // Ghi nhớ tab đang xem lần trước (Thời khóa biểu, Hôm nay, Bài tập, Lịch học thêm...)
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eduschedule_current_tab');
      if (saved === 'subjects') return 'extra';
      if (saved) return saved;
    }
    return 'schedule';
  });

  // Ghi nhớ thứ trong tuần đã chọn
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eduschedule_selected_day') as DayOfWeek;
      if (saved) return saved;
    }
    return getTodayDayOfWeek();
  });

  // PDF Viewer Modal State
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Modals state
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<ScheduleSlot | null>(null);
  const [targetSlotDay, setTargetSlotDay] = useState<DayOfWeek>('T2');

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isPrismaModalOpen, setIsPrismaModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Tài khoản người dùng đã đăng nhập (lưu vào localStorage)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eduschedule_current_user');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return null;
  });

  // Notifications & Celebrations
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confettiKey, setConfettiKey] = useState(0);

  // Khi mở web, nếu tài khoản đã đăng nhập thì tự động đồng bộ dữ liệu mới nhất về máy
  useEffect(() => {
    if (!currentUser) return;
    fetch(`/api/user/data?username=${encodeURIComponent(currentUser.username)}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          if (Array.isArray(resData.data.slots) && resData.data.slots.length > 0) {
            setSlots(resData.data.slots);
          }
          if (Array.isArray(resData.data.subjects) && resData.data.subjects.length > 0) {
            setSubjects(resData.data.subjects);
          }
          if (Array.isArray(resData.data.tasks)) {
            setTasks(resData.data.tasks);
          }
          if (resData.data.profile) {
            setProfile(resData.data.profile);
          }
        }
      })
      .catch(() => {});
  }, [currentUser?.username]);

  // Tự động đồng bộ lên máy chủ đám mây khi có tài khoản và phát sinh thay đổi
  useEffect(() => {
    if (!currentUser) return;

    const timer = setTimeout(async () => {
      try {
        setIsSyncing(true);
        await fetch('/api/user/sync', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: currentUser.username,
            data: { slots, subjects, tasks, profile },
          }),
        });
      } catch (e) {
        // Tiếp tục lưu trữ offline
      } finally {
        setIsSyncing(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [slots, subjects, tasks, profile, currentUser]);

  // Khóa bộ nhớ vào chế độ vĩnh viễn và kiểm tra phục hồi dữ liệu từ IndexedDB nếu cần
  useEffect(() => {
    requestPermanentStorage();

    (async () => {
      try {
        if (!localStorage.getItem('eduschedule_slots')) {
          const idbSlots = await getFromIndexedDB<ScheduleSlot[]>('eduschedule_slots');
          if (idbSlots && Array.isArray(idbSlots) && idbSlots.length > 0) {
            setSlots(idbSlots);
            localStorage.setItem('eduschedule_slots', JSON.stringify(idbSlots));
          }
        }
        if (!localStorage.getItem('eduschedule_subjects')) {
          const idbSubjects = await getFromIndexedDB<SubjectItem[]>('eduschedule_subjects');
          if (idbSubjects && Array.isArray(idbSubjects) && idbSubjects.length > 0) {
            setSubjects(idbSubjects);
            localStorage.setItem('eduschedule_subjects', JSON.stringify(idbSubjects));
          }
        }
        if (!localStorage.getItem('eduschedule_tasks')) {
          const idbTasks = await getFromIndexedDB<HomeworkTask[]>('eduschedule_tasks');
          if (idbTasks && Array.isArray(idbTasks)) {
            setTasks(idbTasks);
            localStorage.setItem('eduschedule_tasks', JSON.stringify(idbTasks));
          }
        }
        if (!localStorage.getItem('eduschedule_profile')) {
          const idbProfile = await getFromIndexedDB<UserProfile>('eduschedule_profile');
          if (idbProfile && typeof idbProfile === 'object') {
            setProfile(idbProfile);
            localStorage.setItem('eduschedule_profile', JSON.stringify(idbProfile));
          }
        }
        if (!localStorage.getItem('eduschedule_extra_classes')) {
          const idbExtra = await getFromIndexedDB<ExtraClassItem[]>('eduschedule_extra_classes');
          if (idbExtra && Array.isArray(idbExtra) && idbExtra.length > 0) {
            setExtraClasses(idbExtra);
            localStorage.setItem('eduschedule_extra_classes', JSON.stringify(idbExtra));
          }
        }

        // Tự động bảo lưu & rehydrate tài khoản từ két lưu trữ trên máy lên máy chủ (bảo đảm không mất khi cập nhật phiên bản)
        getAccountsVault().then((vaultAccounts) => {
          if (vaultAccounts.length > 0) {
            fetch('/api/auth/rehydrate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ accounts: vaultAccounts })
            }).catch(() => {});
          }
        });
      } catch (e) {}
    })();
  }, []);

  // Dual theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Luôn tự động đồng bộ mọi chỉnh sửa vào LocalStorage VÀ IndexedDB để không bao giờ mất sau thời gian dài
  useEffect(() => {
    try {
      localStorage.setItem('eduschedule_slots', JSON.stringify(slots));
      saveToIndexedDB('eduschedule_slots', slots);
    } catch (e) {}
  }, [slots]);

  useEffect(() => {
    try {
      localStorage.setItem('eduschedule_subjects', JSON.stringify(subjects));
      saveToIndexedDB('eduschedule_subjects', subjects);
    } catch (e) {}
  }, [subjects]);

  useEffect(() => {
    try {
      localStorage.setItem('eduschedule_tasks', JSON.stringify(tasks));
      saveToIndexedDB('eduschedule_tasks', tasks);
    } catch (e) {}
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('eduschedule_profile', JSON.stringify(profile));
      saveToIndexedDB('eduschedule_profile', profile);
    } catch (e) {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('eduschedule_current_tab', currentTab);
    } catch (e) {}
  }, [currentTab]);

  useEffect(() => {
    try {
      localStorage.setItem('eduschedule_selected_day', selectedDay);
    } catch (e) {}
  }, [selectedDay]);

  useEffect(() => {
    try {
      localStorage.setItem('eduschedule_extra_classes', JSON.stringify(extraClasses));
      saveToIndexedDB('eduschedule_extra_classes', extraClasses);
    } catch (e) {}
  }, [extraClasses]);

  // Toast Helper
  const showToast = (title: string, description?: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Schedule Slot Handlers
  const handleSaveSlot = (slot: ScheduleSlot) => {
    setSlots((prev) => {
      const exists = prev.some((s) => s.id === slot.id);
      if (exists) {
        return prev.map((s) => (s.id === slot.id ? slot : s));
      } else {
        return [...prev, slot];
      }
    });
    setConfettiKey((prev) => prev + 1);
    showToast('Đã lưu tiết học thành công!', `${slot.subject} · ${slot.period}`, 'success');
  };

  const handleDeleteSlot = (slotId: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== slotId));
    showToast('Đã xóa tiết học khỏi thời khóa biểu', undefined, 'info');
  };

  const handleToggleSlotCompleted = (slotId: string) => {
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id !== slotId) return s;
        const willBeDone = !s.completedToday;
        if (willBeDone) {
          setConfettiKey((k) => k + 1);
          showToast('Đã hoàn thành tiết học!', s.subject, 'success');
        }
        return { ...s, completedToday: willBeDone };
      })
    );
  };

  const handleOpenAddAtDay = (day: DayOfWeek) => {
    setEditingSlot(null);
    setTargetSlotDay(day);
    setIsAddSlotOpen(true);
  };

  const handleEditSlot = (slot: ScheduleSlot) => {
    setEditingSlot(slot);
    setTargetSlotDay(slot.day);
    setIsAddSlotOpen(true);
  };

  // Task Handlers
  const handleSaveTask = (task: HomeworkTask) => {
    setTasks((prev) => [task, ...prev]);
    showToast('Đã thêm bài tập mới!', task.title, 'success');
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const willBeDone = !t.isDone;
        if (willBeDone) {
          setConfettiKey((k) => k + 1);
          showToast('Tuyệt vời!', `Đã hoàn thành: ${t.title}`, 'success');
        }
        return { ...t, isDone: willBeDone };
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast('Đã xóa bài tập', undefined, 'info');
  };

  const handleAddTaskAttachments = (taskId: string, newAttachments: TaskAttachment[]) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const currentAtts = t.attachments || [];
        return {
          ...t,
          attachments: [...currentAtts, ...newAttachments],
        };
      })
    );
    showToast(
      'Đã đính kèm đề cương!',
      `Đã thêm ${newAttachments.length} file tài liệu vào bài tập.`,
      'success'
    );
  };

  const handleRemoveTaskAttachment = (taskId: string, attachmentId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          attachments: (t.attachments || []).filter((a) => a.id !== attachmentId),
        };
      })
    );
    showToast('Đã gỡ file đề cương', undefined, 'info');
  };


  // Extra Classes Handlers
  const handleAddExtraClass = (item: Omit<ExtraClassItem, 'id'>) => {
    const newItem: ExtraClassItem = {
      ...item,
      id: `extra-${Date.now()}`
    };
    setExtraClasses((prev) => [newItem, ...prev]);
  };

  const handleUpdateExtraClass = (id: string, updated: Partial<ExtraClassItem>) => {
    setExtraClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  const handleDeleteExtraClass = (id: string) => {
    setExtraClasses((prev) => prev.filter((c) => c.id !== id));
  };

  // Subject Handlers (dùng cho dropdown chọn môn của Lịch học & Bài tập)
  const handleAddSubject = (subject: SubjectItem) => {
    setSubjects((prev) => [...prev, subject]);
    showToast('Đã thêm môn học mới!', subject.name, 'success');
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    showToast('Đã xóa môn học', undefined, 'info');
  };

  const handleUpdateGrade = (id: string, newGrade: number, newTarget: number) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, currentGrade: newGrade, targetGrade: newTarget } : s))
    );
    showToast('Đã cập nhật điểm số & mục tiêu!', undefined, 'success');
  };

  // Account & Cross-Device Sync Handlers
  const handleLoginSuccess = (user: AuthUser, serverData?: SyncDataPayload) => {
    setCurrentUser(user);
    localStorage.setItem('eduschedule_current_user', JSON.stringify(user));
    // Lưu tài khoản vào Két bảo lưu vĩnh viễn (IndexedDB + LocalStorage)
    saveAccountToVault({
      username: user.username,
      name: user.name,
      syncCode: user.syncCode,
      savedAt: new Date().toISOString()
    });
    if (serverData) {
      if (Array.isArray(serverData.slots) && serverData.slots.length > 0) {
        setSlots(serverData.slots);
      }
      if (Array.isArray(serverData.subjects) && serverData.subjects.length > 0) {
        setSubjects(serverData.subjects);
      }
      if (Array.isArray(serverData.tasks)) {
        setTasks(serverData.tasks);
      }
      if (serverData.profile && typeof serverData.profile === 'object') {
        setProfile(serverData.profile);
      }
    }
    setConfettiKey((k) => k + 1);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eduschedule_current_user');
    showToast('Đã đăng xuất tài khoản', 'Dữ liệu vẫn được lưu trữ an toàn trên thiết bị này.', 'info');
  };

  const handleManualSync = async () => {
    if (!currentUser) return;
    try {
      setIsSyncing(true);
      const res = await fetch('/api/user/sync', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          data: { slots, subjects, tasks, profile },
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Đã đồng bộ thành công!', 'Dữ liệu trên máy tính và điện thoại đã được cập nhật mới nhất.', 'success');
      }
    } catch (e) {
      showToast('Lỗi khi đồng bộ', 'Vui lòng kiểm tra lại kết nối mạng.', 'warning');
    } finally {
      setIsSyncing(false);
    }
  };

  // Reset to default 10A1 template
  const handleResetToDefault = () => {
    if (window.confirm('Khôi phục lại Thời khóa biểu chuẩn Lớp 10A1 (Tuần 9 - THPT Vĩnh Thạnh)?')) {
      setSlots(DEFAULT_SCHEDULE_SLOTS);
      setSubjects(DEFAULT_SUBJECTS);
      setTasks(DEFAULT_TASKS);
      setProfile(DEFAULT_PROFILE);
      setConfettiKey((k) => k + 1);
      showToast('Đã khôi phục TKB Lớp 10A1!', 'Tuần 9 (02/11/2026 - 07/11/2026)', 'success');
    }
  };

  // Filter today's slots
  const todaySlots = useMemo(() => {
    return slots
      .filter((s) => s.day === selectedDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [slots, selectedDay]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenAddSlotModal={() => {
          setEditingSlot(null);
          setTargetSlotDay(selectedDay);
          setIsAddSlotOpen(true);
        }}
        onOpenAddTaskModal={() => setIsAddTaskOpen(true)}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        currentUser={currentUser}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        userName={currentUser?.name || profile.name}
      />

      {/* 10A1 Timetable Banner Indicator */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-700 text-white py-2.5 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-blue-200 shrink-0" />
            <span className="font-bold">THPT VĨNH THẠNH</span>
            <span>·</span>
            <span className="bg-white/20 px-2 py-0.5 rounded font-mono font-bold">LỚP 10A1</span>
            <span>·</span>
            <span className="text-blue-100">Thời khóa biểu Học Kỳ I · Tuần 9 (02/11/2026 – 07/11/2026)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPdfModal(true)}
              className="bg-white/15 hover:bg-white/25 text-white font-medium px-2.5 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Xem TKB Gốc (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Navigation Tabs Content */}
        <AnimatePresence mode="wait">
          {currentTab === 'schedule' && (
            <motion.div
              key="tab-schedule"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <WeeklyTimetableGrid
                slots={slots}
                onAddSlotAtDay={handleOpenAddAtDay}
                onEditSlot={handleEditSlot}
                onDeleteSlot={handleDeleteSlot}
                onToggleSlotCompleted={handleToggleSlotCompleted}
              />
            </motion.div>
          )}

          {currentTab === 'today' && (
            <motion.div
              key="tab-today"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <TodayAgendaBanner
                todaySlots={todaySlots}
                todayTasks={tasks}
                todayExtraClasses={extraClasses.filter((c) => c.daysOfWeek.includes(selectedDay))}
                onNavigateToExtra={() => setCurrentTab('extra')}
                onToggleSlotCompleted={handleToggleSlotCompleted}
                onOpenAddSlot={() => handleOpenAddAtDay(selectedDay)}
                onOpenAddTask={() => setIsAddTaskOpen(true)}
                currentDay={selectedDay}
                onSelectDay={setSelectedDay}
              />
            </motion.div>
          )}

          {currentTab === 'tasks' && (
            <motion.div
              key="tab-tasks"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <TasksDeadlinesView
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onOpenAddTask={() => setIsAddTaskOpen(true)}
                onAddAttachments={handleAddTaskAttachments}
                onRemoveAttachment={handleRemoveTaskAttachment}
              />

            </motion.div>
          )}

          {currentTab === 'extra' && (
            <motion.div
              key="tab-extra"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <ExtraClassesView
                extraClasses={extraClasses}
                onAddExtraClass={handleAddExtraClass}
                onUpdateExtraClass={handleUpdateExtraClass}
                onDeleteExtraClass={handleDeleteExtraClass}
                currentDay={selectedDay}
                onShowToast={showToast}
              />
            </motion.div>
          )}

          {currentTab === 'pomodoro' && (
            <motion.div
              key="tab-pomodoro"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <PomodoroFocusTimer
                onSessionCompleted={() => {
                  setConfettiKey((k) => k + 1);
                  showToast('Tuyệt vời!', 'Bạn vừa hoàn thành 1 phiên tập trung 25 phút.', 'success');
                }}
                onShowToast={showToast}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Utility Tools Strip */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Lớp 10A1 · THPT Vĩnh Thạnh
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPrismaModalOpen(true)}
              className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              title="Xem kiến trúc Prisma tích hợp nhiều cơ sở dữ liệu chồng lên 1 dự án"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kiến trúc Prisma Nhiều DB</span>
            </button>
            <button
              onClick={() => setIsBackupModalOpen(true)}
              className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              title="Tải file sao lưu hoặc khôi phục dữ liệu .json"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sao lưu & Khôi phục</span>
            </button>
            <button
              onClick={() => setShowPdfModal(true)}
              className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer font-medium"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Đối chiếu văn bản TKB gốc</span>
            </button>
            <button
              onClick={handleResetToDefault}
              className="text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors cursor-pointer"
              title="Khôi phục lại TKB 10A1 Tuần 9"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nạp lại TKB 10A1 gốc</span>
            </button>
          </div>
        </div>

      </main>

      {/* PDF View Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Thời Khóa Biểu Tuần 9 - Năm học 2026-2027 (THPT Vĩnh Thạnh)
                </h4>
                <p className="text-xs text-slate-500">
                  Cột lớp 10A1 buổi sáng (Trang 1) · Áp dụng từ 02/11/2026 đến 07/11/2026
                </p>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Đóng
              </button>
            </div>
            <div className="flex-1 w-full bg-slate-100 dark:bg-slate-950">
              <iframe
                src="/assets/aistudio/368_-_30.10.2026_-TKB_TUAN_9-_ca_truong-2026-2027_db77a151.pdf"
                className="w-full h-full border-0"
                title="Thời khóa biểu THPT Vĩnh Thạnh"
              />
            </div>
          </div>
        </div>
      )}

      {/* Backup & Permanent Storage Modal */}
      <BackupRestoreModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        slots={slots}
        subjects={subjects}
        tasks={tasks}
        extraClasses={extraClasses}
        profile={profile}
        onRestore={(data) => {
          if (data.slots && data.slots.length > 0) setSlots(data.slots);
          if (data.subjects && data.subjects.length > 0) setSubjects(data.subjects);
          if (data.tasks) setTasks(data.tasks);
          if (data.extraClasses && data.extraClasses.length > 0) setExtraClasses(data.extraClasses);
          if (data.profile) setProfile(data.profile);
          setConfettiKey((k) => k + 1);
        }}
        onShowToast={showToast}
      />

      {/* Account & Cross-Device Cloud Sync Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        onManualSync={handleManualSync}
        isSyncing={isSyncing}
        currentData={{ slots, subjects, tasks, profile }}
        onShowToast={showToast}
      />

      {/* AI Study Assistant Modal (OpenAI & Gemini with Anti-Spam Rate Limit) */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Prisma Multi-Database Architecture Modal */}
      <PrismaArchitectureModal
        isOpen={isPrismaModalOpen}
        onClose={() => setIsPrismaModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Add / Edit Timetable Slot Modal */}
      <AddOrEditSlotModal
        isOpen={isAddSlotOpen}
        onClose={() => setIsAddSlotOpen(false)}
        onSave={handleSaveSlot}
        initialSlot={editingSlot}
        defaultDay={targetSlotDay}
        subjects={subjects}
      />

      {/* Add Homework Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onSave={handleSaveTask}
        subjects={subjects}
      />

      {/* Particle Confetti Celebration */}
      <ConfettiBurst triggerKey={confettiKey} />

      {/* Floating Animated Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Footer with Author in Right Corner */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-6 bg-white/40 dark:bg-slate-900/40 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">EduSchedule · Lớp 10A1</span>
            <span>·</span>
            <span>Trường THPT Vĩnh Thạnh</span>
          </div>

          {/* Tác giả ở duy nhất góc phải cuối trang */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-xs shadow-2xs">
              <span className="text-slate-400">Tác giả:</span>
              <strong className="text-indigo-600 dark:text-indigo-400 font-bold">Đặng Lê Hùng</strong>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
