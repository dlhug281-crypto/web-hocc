import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Upload, ShieldCheck, Database, FileJson, CheckCircle2, AlertCircle } from 'lucide-react';
import { ScheduleSlot, SubjectItem, HomeworkTask, UserProfile, ExtraClassItem } from '../types/personalSchedule';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  slots: ScheduleSlot[];
  subjects: SubjectItem[];
  tasks: HomeworkTask[];
  extraClasses?: ExtraClassItem[];
  profile: UserProfile;
  onRestore: (data: { slots?: ScheduleSlot[]; subjects?: SubjectItem[]; tasks?: HomeworkTask[]; extraClasses?: ExtraClassItem[]; profile?: UserProfile }) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose,
  slots,
  subjects,
  tasks,
  extraClasses,
  profile,
  onRestore,
  onShowToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Xuất file JSON sao lưu
  const handleExportBackup = () => {
    try {
      const backupData = {
        version: '1.1',
        exportedAt: new Date().toISOString(),
        author: 'Đặng Lê Hùng',
        profile,
        slots,
        subjects,
        tasks,
        extraClasses,
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `eduschedule-10a1-saoluu-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      onShowToast('Đã tải file sao lưu!', 'Lưu file này để khôi phục bất cứ khi nào bạn muốn.', 'success');
    } catch (e) {
      onShowToast('Lỗi khi xuất file sao lưu', undefined, 'warning');
    }
  };

  // Nhập file JSON khôi phục
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Dữ liệu file không hợp lệ');
        }

        onRestore({
          slots: Array.isArray(parsed.slots) ? parsed.slots : undefined,
          subjects: Array.isArray(parsed.subjects) ? parsed.subjects : undefined,
          tasks: Array.isArray(parsed.tasks) ? parsed.tasks : undefined,
          extraClasses: Array.isArray(parsed.extraClasses) ? parsed.extraClasses : undefined,
          profile: parsed.profile && typeof parsed.profile === 'object' ? parsed.profile : undefined,
        });

        onShowToast('Khôi phục thành công!', 'Dữ liệu thời khóa biểu và bài tập đã được nạp lại.', 'success');
        onClose();
      } catch (err) {
        onShowToast('Không thể đọc file', 'Vui lòng chọn đúng file sao lưu .json của EduSchedule', 'warning');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 z-10 p-6 sm:p-7 space-y-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Sao Lưu & Khôi Phục Dữ Liệu</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Xuất hoặc nhập tệp .json chứa thời khóa biểu và bài tập của bạn
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Actions: Export & Import */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Export Button */}
            <button
              onClick={handleExportBackup}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all text-left space-y-2 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                  Tải file sao lưu (.json)
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Lưu trữ 1 bản dự phòng trên máy tính hoặc gửi qua Google Drive
                </p>
              </div>
            </button>

            {/* Import Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all text-left space-y-2 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                  Khôi phục từ file (.json)
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Nhập file sao lưu khi đổi sang điện thoại hoặc máy tính mới
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
