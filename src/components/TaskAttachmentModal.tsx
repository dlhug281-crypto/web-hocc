import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  Download,
  Trash2,
  Eye,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  FolderOpen,
  Maximize2
} from 'lucide-react';
import { HomeworkTask, TaskAttachment } from '../types/personalSchedule';

interface TaskAttachmentModalProps {
  isOpen: boolean;
  task: HomeworkTask | null;
  onClose: () => void;
  onAddAttachments: (taskId: string, attachments: TaskAttachment[]) => void;
  onRemoveAttachment: (taskId: string, attachmentId: string) => void;
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getFileCategory(name: string, type: string) {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (ext === 'pdf' || type.includes('pdf')) {
    return {
      type: 'pdf',
      label: 'PDF',
      color: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      icon: FileText
    };
  }
  if (['doc', 'docx'].includes(ext) || type.includes('word') || type.includes('officedocument.wordprocessingml')) {
    return {
      type: 'word',
      label: 'DOCX',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800',
      icon: FileText
    };
  }
  if (['xls', 'xlsx'].includes(ext) || type.includes('excel') || type.includes('spreadsheetml')) {
    return {
      type: 'excel',
      label: 'XLSX',
      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      icon: FileSpreadsheet
    };
  }
  if (['ppt', 'pptx'].includes(ext) || type.includes('powerpoint') || type.includes('presentationml')) {
    return {
      type: 'powerpoint',
      label: 'PPTX',
      color: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-300 dark:border-orange-800',
      icon: FileText
    };
  }
  if (['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'].includes(ext) || type.startsWith('image/')) {
    return {
      type: 'image',
      label: 'ẢNH',
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800',
      icon: ImageIcon
    };
  }
  return {
    type: 'generic',
    label: ext.toUpperCase() || 'FILE',
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    icon: FileText
  };
}

export const TaskAttachmentModal: React.FC<TaskAttachmentModalProps> = ({
  isOpen,
  task,
  onClose,
  onAddAttachments,
  onRemoveAttachment
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<TaskAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !task) return null;

  const attachments = task.attachments || [];

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setIsProcessing(true);
    setErrorMessage(null);

    const maxFileSize = 15 * 1024 * 1024; // 15MB
    const newAttachments: TaskAttachment[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      if (file.size > maxFileSize) {
        setErrorMessage(`File "${file.name}" vượt quá giới hạn 15MB. Vui lòng nén file hoặc chọn tài liệu nhẹ hơn.`);
        setIsProcessing(false);
        return;
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
      } catch (err: any) {
        setErrorMessage(`Lỗi tải file "${file.name}": ${err.message}`);
      }
    }

    if (newAttachments.length > 0) {
      onAddAttachments(task.id, newAttachments);
    }
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 my-6 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {task.subject}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Hạn nộp: {task.dueDate}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                Đính Kèm Đề Cương & Tài Liệu Bài Tập
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {task.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {/* Upload Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 scale-[0.99]'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:border-indigo-400 dark:hover:border-indigo-500'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.pptx,.ppt,.xlsx,.xls,.png,.jpg,.jpeg,.webp,.txt"
                className="hidden"
                onChange={(e) => handleFilesSelected(e.target.files)}
              />

              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                  <Upload className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Kéo & thả file đề cương vào đây, hoặc <span className="text-indigo-600 dark:text-indigo-400 underline">bấm để chọn file</span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Hỗ trợ file PDF, Word (.docx, .doc), PowerPoint, Excel, Hình ảnh đề thi, Text (Tối đa 15MB/file)
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Loading Indicator */}
            {isProcessing && (
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center gap-2 text-xs text-indigo-700 dark:text-indigo-300">
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0" />
                <span>Đang xử lý và đính kèm file đề cương vào bài tập...</span>
              </div>
            )}

            {/* Attached Files List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <FolderOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Danh Sách Đề Cương Đã Gắn ({attachments.length})</span>
                </h4>
                {attachments.length > 0 && (
                  <span className="text-xs text-slate-400">
                    Tự động đồng bộ lên tài khoản máy chủ
                  </span>
                )}
              </div>

              {attachments.length === 0 ? (
                <div className="p-6 text-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs text-slate-400">
                  Chưa có file đề cương hoặc tài liệu nào được đính kèm cho bài tập này.
                </div>
              ) : (
                <div className="space-y-2">
                  {attachments.map((file) => {
                    const category = getFileCategory(file.name, file.type);
                    const IconComponent = category.icon;

                    return (
                      <div
                        key={file.id}
                        className="p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${category.color}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs sm:max-w-md" title={file.name}>
                              {file.name}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span className="font-mono">{formatBytes(file.size)}</span>
                              <span>·</span>
                              <span>{new Date(file.uploadedAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Preview button for PDF and Images */}
                          {(category.type === 'pdf' || category.type === 'image' || category.type === 'generic') && (
                            <button
                              onClick={() => setPreviewAttachment(file)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
                              title="Xem trực tiếp đề cương"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}

                          {/* Direct Download */}
                          <a
                            href={file.dataUrl}
                            download={file.name}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                            title="Tải về máy tính / điện thoại"
                          >
                            <Download className="w-4 h-4" />
                          </a>

                          {/* Remove button */}
                          <button
                            onClick={() => onRemoveAttachment(task.id, file.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                            title="Xóa file đề cương này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-opacity cursor-pointer"
            >
              Hoàn Tất
            </button>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Preview Modal */}
      {previewAttachment && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                <FileCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  {previewAttachment.name}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ({formatBytes(previewAttachment.size)})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewAttachment.dataUrl}
                  download={previewAttachment.name}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải Về</span>
                </a>
                <button
                  onClick={() => setPreviewAttachment(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-auto p-4">
              {previewAttachment.type.includes('pdf') || previewAttachment.name.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={previewAttachment.dataUrl}
                  className="w-full h-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white"
                  title={previewAttachment.name}
                />
              ) : previewAttachment.type.startsWith('image/') || /\.(png|jpg|jpeg|webp|gif)$/i.test(previewAttachment.name) ? (
                <img
                  src={previewAttachment.dataUrl}
                  alt={previewAttachment.name}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
              ) : (
                <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md">
                  <FileText className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    File tài liệu: {previewAttachment.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Định dạng này tối ưu nhất khi tải về để mở bằng phần mềm Microsoft Word, Excel hoặc ứng dụng xem tài liệu.
                  </p>
                  <a
                    href={previewAttachment.dataUrl}
                    download={previewAttachment.name}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải về mở ngay</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
