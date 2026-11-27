import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Database, Layers, Check, Copy, Code2, Server, ShieldCheck, Sparkles } from 'lucide-react';
import { PRISMA_MULTI_DB_PATTERNS } from '../db/multiDbArchitecture';

interface PrismaArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const PrismaArchitectureModal: React.FC<PrismaArchitectureModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(id);
      onShowToast('Đã sao chép mã nguồn Prisma!', undefined, 'success');
      setTimeout(() => setCopiedIndex(null), 2500);
    } catch (e) {}
  };

  const currentPattern = PRISMA_MULTI_DB_PATTERNS[activeTab];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 z-10 max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between shrink-0 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Kiến Trúc Prisma: Tích Hợp Nhiều Cơ Sở Dữ Liệu</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cách kết nối và xếp chồng nhiều database độc lập (Auth, Schedule, Logs) trong cùng 1 dự án
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

          {/* Tab Selector */}
          <div className="px-5 pt-3 border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto bg-slate-100/50 dark:bg-slate-950/20">
            {PRISMA_MULTI_DB_PATTERNS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === idx
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                {p.type}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="p-5 overflow-y-auto space-y-4 flex-1">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {currentPattern.name}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentPattern.purpose}
              </p>
            </div>

            {/* Code Block 1: Schema Definition */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>1. Cấu hình schema.prisma:</span>
                </span>
                <button
                  onClick={() => handleCopy(currentPattern.schemaSample, 'schema')}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  {copiedIndex === 'schema' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === 'schema' ? 'Đã Chép' : 'Sao Chép'}</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-2xl bg-slate-950 text-slate-100 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
                {currentPattern.schemaSample}
              </pre>
            </div>

            {/* Code Block 2: TypeScript Client Usage */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-emerald-500" />
                  <span>2. Cách gọi đồng thời trong TypeScript:</span>
                </span>
                <button
                  onClick={() => handleCopy(currentPattern.clientExample, 'client')}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  {copiedIndex === 'client' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === 'client' ? 'Đã Chép' : 'Sao Chép'}</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
                {currentPattern.clientExample}
              </pre>
            </div>
          </div>

          {/* Footer note */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-[11px] text-slate-500 flex items-center justify-between">
            <span>💡 Áp dụng hoàn hảo khi muốn tách database Người dùng và database Thời khóa biểu</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
