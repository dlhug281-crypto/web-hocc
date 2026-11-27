import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, SkipForward, Sparkles, Volume2, VolumeX, CheckCircle, Coffee, Brain } from 'lucide-react';
import { StudyMusicPlayer } from './StudyMusicPlayer';

interface PomodoroFocusTimerProps {
  onSessionCompleted?: () => void;
  onShowToast?: (title: string, desc?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const PomodoroFocusTimer: React.FC<PomodoroFocusTimerProps> = ({ onSessionCompleted, onShowToast }) => {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eduschedule_pomodoro_sessions');
      if (saved) return Number(saved) || 0;
    }
    return 0;
  });

  useEffect(() => {
    try {
      localStorage.setItem('eduschedule_pomodoro_sessions', String(completedSessions));
    } catch (e) {}
  }, [completedSessions]);

  const totalTime = mode === 'work' ? 25 * 60 : 5 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Synthesized gentle bell tone via Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.4); // A5

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      // AudioContext fallback
    }
  };

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      playChime();
      if (mode === 'work') {
        setCompletedSessions((prev) => prev + 1);
        if (onSessionCompleted) onSessionCompleted();
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const toggleRun = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setMode('break');
      setTimeLeft(5 * 60);
    } else {
      setMode('work');
      setTimeLeft(25 * 60);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="max-w-xl mx-auto space-y-6 text-center">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Đồng Hồ Tập Trung Ôn Bài (Pomodoro)</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Kỹ thuật chia nhỏ thời gian: 25 phút tập trung tối đa + 5 phút nghỉ giải lao.
        </p>
      </div>

      {/* Main Timer Display Card */}
      <div className="p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-lg relative overflow-hidden flex flex-col items-center">
        
        {/* Mode Selector Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-8">
          <button
            onClick={() => {
              setIsRunning(false);
              setMode('work');
              setTimeLeft(25 * 60);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              mode === 'work'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Tập trung (25 phút)</span>
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setMode('break');
              setTimeLeft(5 * 60);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              mode === 'break'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Nghỉ ngắn (5 phút)</span>
          </button>
        </div>

        {/* Circular SVG Timer Progress */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Animated Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className={mode === 'work' ? 'stroke-indigo-600 dark:stroke-indigo-500' : 'stroke-emerald-500'}
              strokeWidth="6"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (276.46 * progress) / 100}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>

          {/* Time text centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
              {formattedTime}
            </span>
            <span className="text-xs font-medium text-slate-400 mt-2">
              {mode === 'work' ? 'Đang tập trung giải bài' : 'Thư giãn mắt & uống nước'}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleReset}
            className="p-3 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đặt lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleRun}
            className={`px-8 py-3.5 rounded-full font-bold text-sm text-white shadow-md flex items-center gap-2 cursor-pointer transition-transform active:scale-95 ${
              mode === 'work'
                ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Bắt đầu học</span>
              </>
            )}
          </button>

          <button
            onClick={handleSkip}
            className="p-3 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Bỏ qua phiên này"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Sound toggle & completed counter */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 w-full flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Đã hoàn thành: <strong className="text-slate-800 dark:text-slate-200 font-mono">{completedSessions}</strong> phiên ({completedSessions * 25} phút)</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-500" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Chuông: Bật' : 'Chuông: Tắt'}</span>
          </button>
        </div>
      </div>

      {/* Trình Phát Nhạc YouTube Tích Hợp Đổi Link Kèm Rate Limit Chống Spam */}
      <StudyMusicPlayer onShowToast={onShowToast || (() => {})} />
    </div>
  );
};
