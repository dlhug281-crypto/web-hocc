import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Paperclip,
  Download,
  Eye,
  FileText,
  UploadCloud,
  FileSpreadsheet,
  Image as ImageIcon,
  FolderOpen
} from 'lucide-react';
import { HomeworkTask, TaskAttachment } from '../types/personalSchedule';
import { TaskAttachmentModal, formatBytes, getFileCategory } from './TaskAttachmentModal';

interface TasksDeadlinesViewProps {
  tasks: HomeworkTask[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenAddTask: () => void;
  onAddAttachments: (taskId: string, attachments: TaskAttachment[]) => void;
  onRemoveAttachment: (taskId: string, attachmentId: string) => void;
}

export const TasksDeadlinesView: React.FC<TasksDeadlinesViewProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onOpenAddTask,
  onAddAttachments,
  onRemoveAttachment
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<HomeworkTask | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);
  const [quickUploadTaskId, setQuickUploadTaskId] = useState<string | null>(null);
  const quickFileInputRef = useRef<HTMLInputElement>(null);

  const filteredTasks = tasks.filter((t) => {
    const matchStatus =
      filter === 'all' ? true : filter === 'completed' ? t.isDone : !t.isDone;
    const matchPriority =
      priorityFilter === 'all' ? true : t.priority === priorityFilter;
    return matchStatus && matchPriority;
  });

  const pendingCount = tasks.filter((t) => !t.isDone).length;
  const completedCount = tasks.filter((t) => t.isDone).length;
  const totalAttachments = tasks.reduce((acc, t) => acc + (t.attachments?.length || 0), 0);

  // Quick file upload handler for a specific task
  const handleQuickUpload = async (taskId: string, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const maxFileSize = 15 * 1024 * 1024;
    const newAttachments: TaskAttachment[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > maxFileSize) {
        alert(`File "${file.name}" quá lớn (>15MB). Vui lòng chọn file nhỏ hơn.`);
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
        console.error('Lỗi khi xử lý file:', e);
      }
    }

    if (newAttachments.length > 0) {
      onAddAttachments(taskId, newAttachments);
    }
  };

  const triggerTaskFileInput = (taskId: string) => {
    setQuickUploadTaskId(taskId);
    if (quickFileInputRef.current) {
      quickFileInputRef.current.value = '';
      quickFileInputRef.current.click();
    }
  };

  // Sync modal task with latest state if open
  const activeModalTask = selectedTaskForModal
    ? tasks.find((t) => t.id === selectedTaskForModal.id) || selectedTaskForModal
    : null;

  return (
    <div className="space-y-6">
      {/* Hidden file input for fast in-card upload */}
      <input
        ref={quickFileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.doc,.pptx,.ppt,.xlsx,.xls,.png,.jpg,.jpeg,.webp,.txt"
        className="hidden"
        onChange={(e) => {
          if (quickUploadTaskId) {
            handleQuickUpload(quickUploadTaskId, e.target.files);
            setQuickUploadTaskId(null);
          }
        }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Sổ Bài Tập, Deadline & Đề Cương Ôn Tập</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quản lý nhiệm vụ học tập, bài kiểm tra 15p - 1 tiết và gắn trực tiếp file đề cương PDF, Word, Ảnh đề thi vào từng bài tập.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {totalAttachments > 0 && (
            <div className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 shadow-2xs">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>{totalAttachments} file đề cương</span>
            </div>
          )}

          <button
            onClick={onOpenAddTask}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Bài Tập Mới</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Quick Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status segmented controls */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 w-fit">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Tất cả ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'pending'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Cần làm ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'completed'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Đã xong ({completedCount})
          </button>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Mức độ ưu tiên:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Tất cả mức độ</option>
            <option value="high">Khẩn cấp (High)</option>
            <option value="medium">Trung bình (Medium)</option>
            <option value="low">Thong thả (Low)</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3.5">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Không có bài tập nào trong danh mục này!
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Bạn đã hoàn thành tốt các nhiệm vụ hoặc chưa thêm bài tập mới.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredTasks.map((task) => {
              const priorityColor =
                task.priority === 'high'
                  ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900'
                  : task.priority === 'medium'
                  ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900'
                  : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900';

              const priorityLabel =
                task.priority === 'high'
                  ? 'Khẩn cấp'
                  : task.priority === 'medium'
                  ? 'Quan trọng'
                  : 'Bình thường';

              const isDraggingThis = dragOverTaskId === task.id;
              const attachments = task.attachments || [];

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverTaskId(task.id);
                  }}
                  onDragLeave={() => setDragOverTaskId(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverTaskId(null);
                    handleQuickUpload(task.id, e.dataTransfer.files);
                  }}
                  className={`p-4 rounded-2xl border transition-all ${
                    isDraggingThis
                      ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 scale-[1.01] shadow-md'
                      : task.isDone
                      ? 'border-slate-200/60 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/40 opacity-75'
                      : 'border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      {/* Checkbox toggle */}
                      <button
                        onClick={() => onToggleTask(task.id)}
                        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                          task.isDone
                            ? 'bg-emerald-500 text-white'
                            : 'border-2 border-slate-300 dark:border-slate-700 hover:border-emerald-500'
                        }`}
                        aria-label="Đánh dấu bài tập"
                      >
                        {task.isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>

                      <div className="min-w-0 flex-1">
                        {/* Meta tags */}
                        <div className="flex flex-wrap items-center gap-2 text-xs mb-1">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">
                            {task.subject}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">·</span>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${priorityColor}`}>
                            {priorityLabel}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">·</span>
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Hạn nộp: {task.dueDate}
                          </span>
                        </div>

                        {/* Task Title */}
                        <h4
                          className={`text-sm font-semibold text-slate-900 dark:text-white leading-relaxed ${
                            task.isDone ? 'line-through text-slate-400 dark:text-slate-500' : ''
                          }`}
                        >
                          {task.title}
                        </h4>

                        {/* Task Notes */}
                        {task.notes && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                            📌 {task.notes}
                          </p>
                        )}

                        {/* Syllabus & Attachments Section */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                              <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Đề cương & Tài liệu đính kèm:</span>
                              {attachments.length > 0 && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                                  {attachments.length}
                                </span>
                              )}
                            </div>

                            {/* Button to attach files */}
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => triggerTaskFileInput(task.id)}
                                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer"
                                title="Chọn file đề cương trên máy tính hoặc điện thoại"
                              >
                                <UploadCloud className="w-3.5 h-3.5" />
                                <span>+ Đính kèm đề cương</span>
                              </button>

                              {attachments.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => setSelectedTaskForModal(task)}
                                  className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline cursor-pointer"
                                >
                                  Quản lý ({attachments.length})
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Render file pills if any */}
                          {attachments.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {attachments.map((file) => {
                                const cat = getFileCategory(file.name, file.type);
                                const Icon = cat.icon;

                                return (
                                  <div
                                    key={file.id}
                                    className="group flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-lg text-xs bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all max-w-full"
                                  >
                                    <div className={`p-1 rounded text-[10px] font-bold ${cat.color}`}>
                                      <Icon className="w-3 h-3" />
                                    </div>

                                    <span
                                      className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[150px] sm:max-w-[220px]"
                                      title={file.name}
                                    >
                                      {file.name}
                                    </span>

                                    <span className="text-[10px] text-slate-400 font-mono">
                                      ({formatBytes(file.size)})
                                    </span>

                                    {/* Action icons */}
                                    <div className="flex items-center gap-0.5 ml-1">
                                      <button
                                        type="button"
                                        onClick={() => setSelectedTaskForModal(task)}
                                        className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                        title="Xem đề cương"
                                      >
                                        <Eye className="w-3 h-3" />
                                      </button>

                                      <a
                                        href={file.dataUrl}
                                        download={file.name}
                                        className="p-1 rounded text-slate-400 hover:text-emerald-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                        title="Tải về"
                                      >
                                        <Download className="w-3 h-3" />
                                      </a>

                                      <button
                                        type="button"
                                        onClick={() => onRemoveAttachment(task.id, file.id)}
                                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                                        title="Gỡ đề cương"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">
                              Chưa có file đề cương. Kéo thả file PDF / Word đề bài vào đây hoặc bấm nút "+ Đính kèm đề cương" ở trên.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Delete Task */}
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 mt-0.5"
                      title="Xóa bài tập"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Task Attachment Modal */}
      {activeModalTask && (
        <TaskAttachmentModal
          isOpen={!!selectedTaskForModal}
          task={activeModalTask}
          onClose={() => setSelectedTaskForModal(null)}
          onAddAttachments={onAddAttachments}
          onRemoveAttachment={onRemoveAttachment}
        />
      )}
    </div>
  );
};
