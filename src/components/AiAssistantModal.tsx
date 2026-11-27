import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Bot,
  Send,
  Sparkles,
  Key,
  RefreshCw,
  BookOpen,
  Calculator,
  Atom,
  Clock,
  Check,
  Copy,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  provider?: string;
  timestamp: string;
}

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Chào bạn! Mình là Trợ lý AI Học tập Lớp 10A1 (THPT Vĩnh Thạnh). Bạn có thể hỏi mình giải thích bài tập Toán, Lý, Hóa, lập kế hoạch ôn thi tuần 9 hoặc cách phân bổ thời gian học hiệu quả!',
      provider: 'EduSchedule AI',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [openAiKey, setOpenAiKey] = useState(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('user_openai_key')) || '';
  });
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  if (!isOpen) return null;

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user_openai_key', openAiKey.trim());
    onShowToast('Đã lưu cấu hình OpenAI API!', undefined, 'success');
    setShowKeyInput(false);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputPrompt;
    if (!textToSend.trim() || loading) return;

    if (cooldown > 0) {
      onShowToast('Chống spam', `Vui lòng đợi ${cooldown}s trước khi gửi tiếp để tránh tràn dữ liệu.`, 'warning');
      return;
    }

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-5).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: historyPayload,
          openAiKey: openAiKey.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setCooldown(10);
        throw new Error(data.error || 'Rate limit exceeded. Vui lòng thử lại sau giây lát.');
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không nhận được phản hồi từ AI.');
      }

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: data.reply,
        provider: data.provider || 'AI Assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setCooldown(3); // 3s cooldown anti-spam
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'ai',
        text: `⚠️ ${err.message || 'Lỗi kết nối. Vui lòng thử lại sau.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const QUICK_PROMPTS = [
    { label: '📐 Ôn tập Toán 10', text: 'Tóm tắt các công thức quan trọng về Vectơ và Bất đẳng thức Toán 10' },
    { label: '⚡ Công thức Vật Lý 10', text: 'Nhắc lại các công thức chuyển động biến đổi đều và 3 định luật Newton Vật Lý 10' },
    { label: '🧪 Mẹo học Hóa 10', text: 'Mẹo nhớ nhanh cấu hình electron và quy tắc cân bằng phản ứng oxi hóa khử Hóa 10' },
    { label: '⏰ Lập lịch học tuần 9', text: 'Gợi ý cách phân bổ thời gian học buổi tối cho học sinh 10A1 học sáng ở THPT Vĩnh Thạnh' },
  ];

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
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 z-10 h-[88vh] max-h-[720px]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Trợ Lý Học Tập AI (OpenAI & Gemini)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">
                    Lớp 10A1
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Hỏi đáp bài tập, ôn thi, nhắc kiến thức và có giới hạn rate limit chống spam
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1"
                title="Cài đặt OpenAI API Key"
              >
                <Key className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px] font-semibold">Cài đặt API</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Optional OpenAI API Key Setting Drawer */}
          {showKeyInput && (
            <form onSubmit={handleSaveKey} className="p-3.5 bg-indigo-50/80 dark:bg-indigo-950/60 border-b border-indigo-100 dark:border-indigo-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Tích hợp OpenAI API Key cá nhân (Tùy chọn):</span>
                </span>
                <span className="text-[10px] text-slate-500">Mô hình GPT-4o-mini</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={openAiKey}
                  onChange={(e) => setOpenAiKey(e.target.value)}
                  placeholder="Dán khóa sk-..."
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Lưu Khóa
                </button>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                💡 Nếu không nhập, trợ lý vẫn hoạt động với cơ chế gia sư học tập THPT Vĩnh Thạnh tích hợp sẵn!
              </p>
            </form>
          )}

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-slate-400">
                  {msg.provider && <span>{msg.provider} · </span>}
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                <span>Trợ lý AI đang suy nghĩ câu trả lời...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Strip */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
            <span className="text-slate-400 font-semibold shrink-0">Gợi ý:</span>
            {QUICK_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.text)}
                disabled={loading || cooldown > 0}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-slate-700 dark:text-slate-300 shrink-0 font-medium cursor-pointer transition-colors disabled:opacity-50"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Box with Cooldown Protection */}
          <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={
                  cooldown > 0
                    ? `Vui lòng chờ ${cooldown}s (chống spam tràn dữ liệu)...`
                    : 'Đặt câu hỏi về bài tập, thời khóa biểu, ôn thi 10A1...'
                }
                disabled={loading || cooldown > 0}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || cooldown > 0 || !inputPrompt.trim()}
                className="p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50 shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">{cooldown > 0 ? `${cooldown}s` : 'Gửi'}</span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
