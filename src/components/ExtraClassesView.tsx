import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Plus,
  Clock,
  MapPin,
  Calendar,
  User,
  CheckCircle2,
  Circle,
  Phone,
  Edit2,
  Trash2,
  Search,
  Filter,
  DollarSign,
  AlertCircle,
  Sparkles,
  BookOpen,
  LayoutGrid,
  ListFilter,
  X,
  ExternalLink
} from 'lucide-react';
import { ExtraClassItem, DayOfWeek } from '../types/personalSchedule';

interface ExtraClassesViewProps {
  extraClasses: ExtraClassItem[];
  onAddExtraClass: (item: Omit<ExtraClassItem, 'id'>) => void;
  onUpdateExtraClass: (id: string, updated: Partial<ExtraClassItem>) => void;
  onDeleteExtraClass: (id: string) => void;
  currentDay: DayOfWeek;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning') => void;
}

const ALL_DAYS: { key: DayOfWeek; label: string; fullLabel: string }[] = [
  { key: 'T2', label: 'T2', fullLabel: 'Thứ Hai' },
  { key: 'T3', label: 'T3', fullLabel: 'Thứ Ba' },
  { key: 'T4', label: 'T4', fullLabel: 'Thứ Tư' },
  { key: 'T5', label: 'T5', fullLabel: 'Thứ Năm' },
  { key: 'T6', label: 'T6', fullLabel: 'Thứ Sáu' },
  { key: 'T7', label: 'T7', fullLabel: 'Thứ Bảy' },
  { key: 'CN', label: 'CN', fullLabel: 'Chủ Nhật' },
];

const PRESET_COLORS = [
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#6366f1', // Indigo
  '#e11d48', // Rose
];

export const ExtraClassesView: React.FC<ExtraClassesViewProps> = ({
  extraClasses,
  onAddExtraClass,
  onUpdateExtraClass,
  onDeleteExtraClass,
  currentDay,
  onShowToast,
}) => {
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [tuitionFilter, setTuitionFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExtraClassItem | null>(null);

  // Form states for modal
  const [formSubject, setFormSubject] = useState('');
  const [formTeacher, setFormTeacher] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formDays, setFormDays] = useState<DayOfWeek[]>(['T2', 'T4', 'T6']);
  const [formStartTime, setFormStartTime] = useState('17:30');
  const [formEndTime, setFormEndTime] = useState('19:00');
  const [formTuitionFee, setFormTuitionFee] = useState('500.000đ / tháng');
  const [formTuitionStatus, setFormTuitionStatus] = useState<'paid' | 'unpaid'>('paid');
  const [formColor, setFormColor] = useState(PRESET_COLORS[0]);
  const [formNotes, setFormNotes] = useState('');
  const [formPhone, setFormPhone] = useState('');

  // Classes occurring today
  const todayClasses = useMemo(() => {
    return extraClasses.filter((c) => c.daysOfWeek.includes(currentDay));
  }, [extraClasses, currentDay]);

  // Tuition stats
  const totalClasses = extraClasses.length;
  const paidCount = extraClasses.filter((c) => c.tuitionStatus === 'paid').length;
  const unpaidCount = totalClasses - paidCount;

  // Filtered classes
  const filteredClasses = useMemo(() => {
    return extraClasses.filter((item) => {
      // Day filter
      if (selectedDayFilter === 'today') {
        if (!item.daysOfWeek.includes(currentDay)) return false;
      } else if (selectedDayFilter !== 'all') {
        if (!item.daysOfWeek.includes(selectedDayFilter as DayOfWeek)) return false;
      }

      // Tuition filter
      if (tuitionFilter === 'paid' && item.tuitionStatus !== 'paid') return false;
      if (tuitionFilter === 'unpaid' && item.tuitionStatus !== 'unpaid') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSub = item.subject.toLowerCase().includes(q);
        const matchTeach = item.teacher.toLowerCase().includes(q);
        const matchLoc = item.location.toLowerCase().includes(q);
        if (!matchSub && !matchTeach && !matchLoc) return false;
      }

      return true;
    });
  }, [extraClasses, selectedDayFilter, tuitionFilter, searchQuery, currentDay]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormSubject('');
    setFormTeacher('');
    setFormLocation('Trung tâm Bồi dưỡng Văn hóa');
    setFormDays(['T2', 'T4', 'T6']);
    setFormStartTime('17:30');
    setFormEndTime('19:00');
    setFormTuitionFee('500.000đ / tháng');
    setFormTuitionStatus('paid');
    setFormColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
    setFormNotes('');
    setFormPhone('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ExtraClassItem) => {
    setEditingItem(item);
    setFormSubject(item.subject);
    setFormTeacher(item.teacher);
    setFormLocation(item.location);
    setFormDays(item.daysOfWeek);
    setFormStartTime(item.startTime);
    setFormEndTime(item.endTime);
    setFormTuitionFee(item.tuitionFee || '');
    setFormTuitionStatus(item.tuitionStatus || 'paid');
    setFormColor(item.color || PRESET_COLORS[0]);
    setFormNotes(item.notes || '');
    setFormPhone(item.phone || '');
    setIsModalOpen(true);
  };

  const handleToggleDaySelection = (day: DayOfWeek) => {
    if (formDays.includes(day)) {
      if (formDays.length > 1) {
        setFormDays(formDays.filter((d) => d !== day));
      } else {
        onShowToast('Cần ít nhất một ngày học', 'Vui lòng chọn ít nhất 1 buổi học trong tuần', 'info');
      }
    } else {
      setFormDays([...formDays, day]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim()) {
      onShowToast('Vui lòng nhập môn học', 'Tên môn học thêm không được để trống', 'warning');
      return;
    }

    if (editingItem) {
      onUpdateExtraClass(editingItem.id, {
        subject: formSubject.trim(),
        teacher: formTeacher.trim(),
        location: formLocation.trim(),
        daysOfWeek: formDays,
        startTime: formStartTime,
        endTime: formEndTime,
        tuitionFee: formTuitionFee.trim(),
        tuitionStatus: formTuitionStatus,
        color: formColor,
        notes: formNotes.trim(),
        phone: formPhone.trim(),
      });
      onShowToast('Đã cập nhật lớp học thêm', formSubject.trim(), 'success');
    } else {
      onAddExtraClass({
        subject: formSubject.trim(),
        teacher: formTeacher.trim(),
        location: formLocation.trim(),
        daysOfWeek: formDays,
        startTime: formStartTime,
        endTime: formEndTime,
        tuitionFee: formTuitionFee.trim(),
        tuitionStatus: formTuitionStatus,
        color: formColor,
        notes: formNotes.trim(),
        phone: formPhone.trim(),
        isCompletedToday: false,
      });
      onShowToast('Đã thêm lớp học thêm mới', formSubject.trim(), 'success');
    }

    setIsModalOpen(false);
  };

  const handleToggleTuitionStatus = (item: ExtraClassItem) => {
    const nextStatus = item.tuitionStatus === 'paid' ? 'unpaid' : 'paid';
    onUpdateExtraClass(item.id, { tuitionStatus: nextStatus });
    onShowToast(
      nextStatus === 'paid' ? 'Đã đổi: Đã đóng học phí' : 'Đã đổi: Chưa đóng học phí',
      item.subject,
      'info'
    );
  };

  const handleToggleTodayAttendance = (item: ExtraClassItem) => {
    const next = !item.isCompletedToday;
    onUpdateExtraClass(item.id, { isCompletedToday: next });
    onShowToast(
      next ? 'Đã điểm danh buổi học hôm nay!' : 'Đã bỏ đánh dấu buổi học hôm nay',
      item.subject,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-indigo-900/40 shadow-xl">
        <div className="pointer-events-none absolute -top-16 -right-16 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200">
              <GraduationCap className="w-4 h-4 text-indigo-300" />
              <span>Thời Khóa Biểu Học Thêm & Luyện Thi</span>
              <span>·</span>
              <span>Lớp 10A1</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Lịch Học Thêm & Bồi Dưỡng Ngoài Giờ
            </h2>

            <p className="text-xs sm:text-sm text-indigo-200/80 leading-relaxed">
              Quản lý các ca học thêm buổi chiều/tối, ca luyện thi học sinh giỏi, theo dõi học phí hàng tháng và không bao giờ bỏ lỡ buổi học nào.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Lớp Học Thêm</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <span className="text-indigo-300 block text-[11px]">Tổng số lớp học</span>
            <div className="text-xl font-bold font-mono tabular-nums text-white mt-0.5">
              {totalClasses} lớp
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <span className="text-indigo-300 block text-[11px]">Ca học hôm nay ({currentDay})</span>
            <div className="text-xl font-bold font-mono tabular-nums text-emerald-400 mt-0.5 flex items-center gap-1.5">
              <span>{todayClasses.length} ca</span>
              {todayClasses.length > 0 && (
                <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  Có lịch
                </span>
              )}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <span className="text-indigo-300 block text-[11px]">Đã nộp học phí</span>
            <div className="text-xl font-bold font-mono tabular-nums text-indigo-300 mt-0.5">
              {paidCount} / {totalClasses}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <span className="text-indigo-300 block text-[11px]">Chưa đóng học phí</span>
            <div className="text-xl font-bold font-mono tabular-nums text-amber-300 mt-0.5">
              {unpaidCount} lớp
            </div>
          </div>
        </div>
      </div>

      {/* Today Alert Banner if any classes today */}
      {todayClasses.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-transparent border border-emerald-500/30 dark:border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                Hôm nay bạn có {todayClasses.length} ca học thêm chiều/tối:
              </div>
              <div className="text-slate-600 dark:text-slate-400 mt-0.5">
                {todayClasses.map((c, idx) => (
                  <span key={c.id}>
                    <strong className="text-indigo-600 dark:text-indigo-400">{c.subject}</strong> ({c.startTime} - {c.endTime} · {c.teacher})
                    {idx < todayClasses.length - 1 ? ' · ' : ''}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedDayFilter('today')}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer"
          >
            Xem lịch hôm nay
          </button>
        </div>
      )}

      {/* Control Bar: Day Filter + Search + Tuition Status */}
      <div className="space-y-3">
        {/* Day Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedDayFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedDayFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            Tất cả các ngày ({extraClasses.length})
          </button>

          <button
            onClick={() => setSelectedDayFilter('today')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedDayFilter === 'today'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
            }`}
          >
            Hôm nay ({currentDay}: {todayClasses.length})
          </button>

          <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1 shrink-0" />

          {ALL_DAYS.map((d) => {
            const countOnDay = extraClasses.filter((c) => c.daysOfWeek.includes(d.key)).length;
            const isSelected = selectedDayFilter === d.key;
            return (
              <button
                key={d.key}
                onClick={() => setSelectedDayFilter(d.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span>{d.fullLabel}</span>
                <span className="ml-1 opacity-70 text-[10px]">({countOnDay})</span>
              </button>
            );
          })}
        </div>

        {/* Search & Tuition Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm môn học thêm, giáo viên, hoặc địa điểm..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
              Học phí:
            </span>
            <button
              onClick={() => setTuitionFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                tuitionFilter === 'all'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setTuitionFilter('paid')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                tuitionFilter === 'paid'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              Đã đóng ({paidCount})
            </button>
            <button
              onClick={() => setTuitionFilter('unpaid')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                tuitionFilter === 'unpaid'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
              }`}
            >
              Chưa đóng ({unpaidCount})
            </button>
          </div>
        </div>
      </div>

      {/* Main Classes Grid */}
      {filteredClasses.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Không tìm thấy lớp học thêm nào
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {searchQuery || selectedDayFilter !== 'all' || tuitionFilter !== 'all'
              ? 'Thử đổi bộ lọc hoặc xóa từ khóa tìm kiếm để xem tất cả lớp học thêm.'
              : 'Bạn chưa thêm lớp học thêm nào. Bấm nút bên dưới để thêm lớp học đầu tiên!'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Lớp Học Thêm</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map((item) => {
            const isToday = item.daysOfWeek.includes(currentDay);
            const isPaid = item.tuitionStatus === 'paid';

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={`relative rounded-2xl bg-white dark:bg-slate-900 border transition-all hover:shadow-md flex flex-col justify-between overflow-hidden ${
                  isToday
                    ? 'border-indigo-300 dark:border-indigo-700/80 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Accent Top Strip */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: item.color || '#6366f1' }}
                />

                <div className="p-4 sm:p-5 space-y-4 flex-1">
                  {/* Header: Title + Days & Badges */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {item.subject}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                          <User className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="font-semibold">{item.teacher}</span>
                          {item.phone && (
                            <>
                              <span>·</span>
                              <a
                                href={`tel:${item.phone}`}
                                className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-0.5"
                                title="Gọi điện thoại cho thầy/cô"
                              >
                                <Phone className="w-3 h-3" />
                                <span>{item.phone}</span>
                              </a>
                            </>
                          )}
                        </div>
                      </div>

                      {isToday && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] border border-emerald-200 dark:border-emerald-800 shrink-0">
                          Hôm nay
                        </span>
                      )}
                    </div>

                    {/* Days of Week Badges */}
                    <div className="flex items-center gap-1 mt-3">
                      {ALL_DAYS.map((d) => {
                        const active = item.daysOfWeek.includes(d.key);
                        const isCurrent = d.key === currentDay;
                        return (
                          <span
                            key={d.key}
                            className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all ${
                              active
                                ? isCurrent
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                            }`}
                            title={`${d.fullLabel}: ${active ? 'Có học' : 'Nghỉ'}`}
                          >
                            {d.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Class Details: Time & Location */}
                  <div className="space-y-2 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="font-mono font-semibold tabular-nums">
                        {item.startTime} - {item.endTime}
                      </span>
                      <span className="text-slate-400 text-[11px]">(Ca chiều / tối)</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    {item.tuitionFee && (
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                          <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="font-medium">{item.tuitionFee}</span>
                        </div>

                        <button
                          onClick={() => handleToggleTuitionStatus(item)}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                            isPaid
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                          }`}
                          title="Bấm để đổi trạng thái đóng học phí"
                        >
                          {isPaid ? '✓ Đã đóng' : '⚠️ Chưa đóng'}
                        </button>
                      </div>
                    )}

                    {item.notes && (
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Ghi chú:</span> {item.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls: Attendance check-in + Edit + Delete */}
                <div className="p-3 bg-slate-50/70 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  {isToday ? (
                    <button
                      onClick={() => handleToggleTodayAttendance(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        item.isCompletedToday
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
                      }`}
                    >
                      {item.isCompletedToday ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Đã học xong hôm nay</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5 text-slate-400" />
                          <span>Điểm danh hôm nay</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 pl-1">
                      {item.daysOfWeek.map((k) => ALL_DAYS.find((d) => d.key === k)?.label).join(' · ')}
                    </span>
                  )}

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Sửa thông tin lớp học thêm"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Bạn có chắc chắn muốn xóa lớp học thêm "${item.subject}" không?`)) {
                          onDeleteExtraClass(item.id);
                          onShowToast('Đã xóa lớp học thêm', item.subject, 'info');
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Xóa lớp học thêm này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal: Thêm hoặc Sửa Lớp Học Thêm */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {editingItem ? 'Sửa Lớp Học Thêm' : 'Thêm Lớp Học Thêm Mới'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Điền chi tiết môn học, giờ học và lịch trong tuần
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                {/* Môn học */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Tên môn / Khóa học thêm: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    placeholder="Ví dụ: Toán 10 Nâng Cao & Luyện Đề"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Giáo viên & SĐT */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Thầy / Cô phụ trách:
                    </label>
                    <input
                      type="text"
                      value={formTeacher}
                      onChange={(e) => setFormTeacher(e.target.value)}
                      placeholder="Ví dụ: Thầy Dương (THPT Vĩnh Thạnh)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Số điện thoại liên hệ:
                    </label>
                    <input
                      type="text"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="Ví dụ: 0912 345 678"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Địa điểm học */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Địa điểm học:
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Ví dụ: Trung tâm BDVH Vĩnh Thạnh (Phòng 202) hoặc Online"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Chọn các ngày trong tuần */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Các ngày học trong tuần:
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {ALL_DAYS.map((d) => {
                      const isSelected = formDays.includes(d.key);
                      return (
                        <button
                          key={d.key}
                          type="button"
                          onClick={() => handleToggleDaySelection(d.key)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {d.fullLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Giờ bắt đầu & Giờ kết thúc */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Giờ bắt đầu:
                    </label>
                    <input
                      type="time"
                      required
                      value={formStartTime}
                      onChange={(e) => setFormStartTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Giờ kết thúc:
                    </label>
                    <input
                      type="time"
                      required
                      value={formEndTime}
                      onChange={(e) => setFormEndTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>

                {/* Học phí & Tình trạng */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Mức học phí:
                    </label>
                    <input
                      type="text"
                      value={formTuitionFee}
                      onChange={(e) => setFormTuitionFee(e.target.value)}
                      placeholder="Ví dụ: 500.000đ / tháng"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Tình trạng đóng tiền:
                    </label>
                    <select
                      value={formTuitionStatus}
                      onChange={(e) => setFormTuitionStatus(e.target.value as 'paid' | 'unpaid')}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="paid">✓ Đã đóng học phí</option>
                      <option value="unpaid">⚠️ Chưa đóng học phí</option>
                    </select>
                  </div>
                </div>

                {/* Màu sắc nhận diện */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Màu sắc nhận diện thẻ:
                  </label>
                  <div className="flex items-center gap-2">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormColor(c)}
                        className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                          formColor === c ? 'scale-125 ring-2 ring-offset-2 ring-indigo-500' : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Ghi chú */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Ghi chú / Dặn dò bài tập:
                  </label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Ví dụ: Làm bài tập chuyên đề số 3, chuẩn bị vở ghi và máy tính Casio..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Hủy bỏ
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all cursor-pointer shadow-xs"
                  >
                    {editingItem ? 'Lưu Thay Đổi' : 'Thêm Lớp Học'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
