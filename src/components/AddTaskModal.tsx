import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckSquare, Plus, Calendar, AlertCircle, Paperclip, UploadCloud, Trash2 } from 'lucide-react';
import { HomeworkTask, TaskPriority, SubjectItem, TaskAttachment } from '../types/personalSchedule';
import { formatBytes, getFileCategory } from './TaskAttachmentModal';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: HomeworkTask) => void;
  subjects: SubjectItem[];
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  subjects,
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(subjects[0]?.name || 'Toán');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [isReadingFiles, setIsReadingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setIsReadingFiles(true);
    const maxFileSize = 15 * 1024 * 1024;
    const newAttachments: TaskAttachment[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > maxFileSize) {
        alert(`File "${file.name}" quá lớn (>15MB). Vui lòng chọn file nhẹ hơn.`);
        continue;
      }
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Lỗi khi đọc file'));
          reader.readAsDataURL(file);
        });

        newAttachments.push({
          id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          dataUrl,
          uploadedAt: new Date().toISOString()
        });
      } catch (e) {
        console.error('Lỗi khi đọc file:', e);
      }
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
    setIsReadingFiles(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveAttachment = (attId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: `task-${Date.now()}`,
      title: title.trim(),
      subject: subject.trim(),
      dueDate,
      priority,
      isDone: false,
      notes: notes.trim(),
      attachments: attachments.length > 0 ? attachments : undefined
    });

    setTitle('');
    setNotes('');
    setAttachments([]);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 my-8 max-h-[92vh] flex flex-col"
        >
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Thêm Bài Tập & Đề Cương Mới
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Nhắc nhở thời hạn nộp bài, kiểm tra và đính kèm file đề cương ôn thi.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Tên Bài Tập Hoặc Nội Dung Cần Ôn *
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Đề cương ôn thi Giữa kỳ I / Bài tập 1-5 trang 42..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Thuộc Môn Học
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                  <option value="Khác">Môn khác</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Hạn Hoàn Thành (Deadline)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Mức Độ Ưu Tiên
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'high', label: 'Khẩn cấp', color: 'border-rose-400 text-rose-600' },
                  { key: 'medium', label: 'Quan trọng', color: 'border-amber-400 text-amber-600' },
                  { key: 'low', label: 'Bình thường', color: 'border-blue-400 text-blue-600' },
                ].map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setPriority(p.key as TaskPriority)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      priority === p.key
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Ghi Chú Chi Tiết
              </label>
              <textarea
                rows={2}
                placeholder="Ghi chú công thức cần nhớ, số trang hoặc dặn dò của giáo viên..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* File Attachment Section */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Đính Kèm File Đề Cương / Tài Liệu (Tùy chọn)</span>
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Chọn file từ máy</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.pptx,.ppt,.xlsx,.xls,.png,.jpg,.jpeg,.webp,.txt"
                className="hidden"
                onChange={(e) => handleFilesSelected(e.target.files)}
              />

              {attachments.length > 0 ? (
                <div className="space-y-1.5 mt-2">
                  {attachments.map((file) => {
                    const cat = getFileCategory(file.name, file.type);
                    const Icon = cat.icon;
                    return (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className={`p-1 rounded text-[10px] font-bold ${cat.color}`}>
                            <Icon className="w-3 h-3" />
                          </span>
                          <span className="truncate max-w-[200px]" title={file.name}>
                            {file.name}
                          </span>
                          <span className="text-slate-400 font-mono text-[10px]">
                            ({formatBytes(file.size)})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(file.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center cursor-pointer hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-800/30"
                >
                  <p className="text-xs text-slate-500">
                    Bấm để đính kèm file PDF, Word, Ảnh đề thi (hoặc đính kèm sau khi tạo)
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isReadingFiles}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer disabled:opacity-50"
              >
                {isReadingFiles ? 'Đang đọc file...' : 'Thêm Vào Danh Sách'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
