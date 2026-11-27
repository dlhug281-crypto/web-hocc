import React, { useState, useEffect } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, Sparkles, AlertCircle, ExternalLink, RefreshCw, Youtube } from 'lucide-react';

interface MusicPreset {
  id: string;
  name: string;
  category: string;
  url: string;
  videoId: string;
}

const PRESET_TRACKS: MusicPreset[] = [
  {
    id: 'lofi',
    name: 'Lofi Girl · Học Bài & Thư Giãn',
    category: 'Lofi Beats',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    videoId: 'jfKfPfyJRdk',
  },
  {
    id: 'piano',
    name: 'Piano Cổ Điển Nhẹ Nhàng',
    category: 'Instrumental',
    url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY',
    videoId: '4xDzrJKXOOY',
  },
  {
    id: 'rain',
    name: 'Tiếng Mưa Rào Ban Đêm Êm Dịu',
    category: 'Tiếng Mưa',
    url: 'https://www.youtube.com/watch?v=mPZkdNFkNps',
    videoId: 'mPZkdNFkNps',
  },
  {
    id: 'alpha',
    name: 'Sóng Não Alpha Tăng Tập Trung',
    category: 'Focus Wave',
    url: 'https://www.youtube.com/watch?v=WPni755-Krg',
    videoId: 'WPni755-Krg',
  },
];

interface StudyMusicPlayerProps {
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const StudyMusicPlayer: React.FC<StudyMusicPlayerProps> = ({ onShowToast }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicPreset>(PRESET_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Rate Limiter Cooldown (Client-side 5s countdown để chống spam)
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Xử lý đổi link YouTube kèm Rate Limiter
  const handleChangeTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputUrl.trim()) return;

    if (cooldownSeconds > 0) {
      setErrorMessage(`Vui lòng chờ ${cooldownSeconds}s trước khi đổi link tiếp theo để chống spam và tràn dữ liệu.`);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/music/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Link YouTube không hợp lệ.');
      }

      // Kích hoạt cooldown 5 giây
      setCooldownSeconds(5);

      const newTrack: MusicPreset = {
        id: `custom_${Date.now()}`,
        name: 'Nhạc Tự Chọn Từ YouTube',
        category: 'Tùy Chỉnh',
        url: inputUrl.trim(),
        videoId: data.videoId || 'jfKfPfyJRdk',
      };

      setCurrentTrack(newTrack);
      setIsPlaying(true);
      setInputUrl('');
      onShowToast('Đã đổi nhạc YouTube!', 'Bắt đầu phát nhạc học tập.', 'success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể tải link này.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: MusicPreset) => {
    if (cooldownSeconds > 0 && currentTrack.id !== preset.id) {
      onShowToast('Chống spam', `Vui lòng đợi ${cooldownSeconds}s nữa trước khi đổi bài tiếp theo.`, 'info');
      return;
    }
    setCurrentTrack(preset);
    setIsPlaying(true);
    setCooldownSeconds(4);
    onShowToast('Đang phát:', preset.name, 'success');
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <Youtube className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Nhạc Học Tập YouTube (Study Beats)</span>
              {cooldownSeconds > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-mono">
                  Chống spam: {cooldownSeconds}s
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dán link YouTube bất kỳ để đổi nhạc nền tập trung khi làm bài
            </p>
          </div>
        </div>

        {/* Play / Pause Toggle Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
            isPlaying
              ? 'bg-rose-600 hover:bg-rose-500 text-white'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? 'Tạm Dừng' : 'Phát Nhạc'}</span>
        </button>
      </div>

      {/* Input URL Form with Anti-Spam Rate Limit Cooldown */}
      <form onSubmit={handleChangeTrack} className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Dán link YouTube (VD: https://www.youtube.com/watch?v=...)"
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <button
            type="submit"
            disabled={isLoading || cooldownSeconds > 0 || !inputUrl.trim()}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shrink-0 shadow-xs"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Music className="w-3.5 h-3.5" />}
            <span>{cooldownSeconds > 0 ? `Chờ ${cooldownSeconds}s` : 'Đổi Nhạc'}</span>
          </button>
        </div>

        {errorMessage && (
          <p className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>{errorMessage}</span>
          </p>
        )}
      </form>

      {/* Presets List */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          Danh mục nhạc có sẵn:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESET_TRACKS.map((preset) => {
            const isCurrent = currentTrack.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                  isCurrent
                    ? 'border-rose-500/80 bg-rose-50/50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold shadow-2xs'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="truncate pr-2">
                  <span className="text-[10px] text-slate-400 block font-normal">{preset.category}</span>
                  <span className="truncate">{preset.name}</span>
                </div>
                {isCurrent && isPlaying ? (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0"></span>
                ) : (
                  <Play className="w-3 h-3 opacity-40 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hidden/Active YouTube Embed Frame */}
      {isPlaying && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="rounded-xl overflow-hidden bg-black aspect-video max-h-48 w-full border border-slate-200 dark:border-slate-800">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${currentTrack.videoId}?autoplay=1&enablejsapi=1`}
              title="YouTube Study Music Player"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};
