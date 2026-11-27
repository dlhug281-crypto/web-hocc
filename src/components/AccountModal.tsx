import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Smartphone,
  Laptop,
  LogOut,
  RefreshCw,
  UserPlus,
  LogIn
} from 'lucide-react';
import { AuthUser, SyncDataPayload } from '../types/auth';
import {
  getAccountsVault,
  saveAccountToVault,
  SavedVaultAccount
} from '../utils/persistentStorage';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onLoginSuccess: (user: AuthUser, serverData?: SyncDataPayload) => void;
  onLogout: () => void;
  onManualSync: () => Promise<void>;
  isSyncing: boolean;
  currentData: SyncDataPayload;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  onManualSync,
  isSyncing,
  currentData,
  onShowToast,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [rememberForever, setRememberForever] = useState(true);

  // Két lưu trữ tài khoản vĩnh viễn trên thiết bị này
  const [vaultAccounts, setVaultAccounts] = useState<SavedVaultAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Nạp danh sách tài khoản đã nhớ từ IndexedDB & LocalStorage
  useEffect(() => {
    if (isOpen) {
      getAccountsVault().then((list) => {
        setVaultAccounts(list);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Xử lý Đăng Nhập
  const handleLogin = async (e?: React.FormEvent, overrideUser?: string, overridePwd?: string) => {
    if (e) e.preventDefault();
    const targetUser = (overrideUser || username).trim();
    const targetPwd = (overridePwd || password).trim();

    if (!targetUser || !targetPwd) {
      setErrorMessage('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);

    // Tìm trong két lưu trữ trên máy xem có dữ liệu dự phòng không
    const matchedVaultAcc = vaultAccounts.find(
      (a) => a.username.toLowerCase() === targetUser.toLowerCase()
    );

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: targetUser,
          password: targetPwd,
          clientAccount: matchedVaultAcc || undefined
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
      }

      // Lưu vào két bảo lưu vĩnh viễn trên máy này
      await saveAccountToVault({
        username: data.user.username,
        password: rememberForever ? targetPwd : (matchedVaultAcc?.password || targetPwd),
        name: data.user.name,
        syncCode: data.user.syncCode,
        savedAt: new Date().toISOString()
      });

      onLoginSuccess(data.user, data.data);
      onShowToast('Đăng nhập thành công!', `Chào mừng ${data.user.name}. Tài khoản được ghi nhớ vĩnh viễn.`, 'success');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };


  // Xử lý Đăng Ký Tài Khoản Mới
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPwd = password.trim();
    const cleanName = displayName.trim() || 'ABCD';

    if (!cleanUser || !cleanPwd) {
      setErrorMessage('Vui lòng nhập tên đăng nhập và mật khẩu.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUser,
          password: cleanPwd,
          name: cleanName,
          initialData: currentData,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Đăng ký tài khoản thất bại.');
      }

      // Lưu vào két lưu trữ vĩnh viễn (IndexedDB + LocalStorage) ngay lập tức
      await saveAccountToVault({
        username: data.user.username,
        password: cleanPwd,
        name: data.user.name,
        syncCode: data.user.syncCode,
        savedAt: new Date().toISOString()
      });

      onLoginSuccess(data.user, data.data);
      onShowToast(
        'Tạo tài khoản thành công!',
        `Tài khoản @${data.user.username} đã được lưu mãi mãi để đăng nhập trên mọi phiên bản.`,
        'success'
      );
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể tạo tài khoản.');
    } finally {
      setLoading(false);
    }
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
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 z-10 p-6 sm:p-7 space-y-4 max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Tài Khoản Cá Nhân
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Đăng nhập để đồng bộ thời khóa biểu và bài tập của bạn
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

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
              {errorMessage}
            </div>
          )}

          {/* ================= VIEW 1: ĐÃ ĐĂNG NHẬP ================= */}
          {currentUser ? (
            <div className="space-y-4">
              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-blue-50/80 dark:from-indigo-950/50 dark:to-blue-950/50 border border-indigo-200/80 dark:border-indigo-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-base shadow-xs">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {currentUser.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono font-bold">
                        @{currentUser.username}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Đang hoạt động</span>
                  </span>
                </div>

                <div className="pt-2 border-t border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Laptop className="w-4 h-4 text-indigo-500" />
                      <span>Máy tính</span>
                      <span>⟷</span>
                      <Smartphone className="w-4 h-4 text-emerald-500" />
                      <span>Điện thoại</span>
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Tự động lưu & đồng bộ
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions: Sync now & Logout */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  onClick={onManualSync}
                  disabled={isSyncing}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Đang lưu...' : 'Đồng bộ ngay'}</span>
                </button>

                <button
                  onClick={onLogout}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          ) : (
            /* ================= VIEW 2: CHƯA ĐĂNG NHẬP ================= */
            <div className="space-y-4">
              
              {/* Segmented Mode Picker (Chỉ 2 Tab: Đăng Nhập & Đăng Ký) */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                <button
                  onClick={() => { setAuthMode('login'); setErrorMessage(null); }}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Đăng Nhập
                </button>
                <button
                  onClick={() => { setAuthMode('register'); setErrorMessage(null); }}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Đăng Ký
                </button>
              </div>

              {/* Form 1: Đăng Nhập */}
              {authMode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-3.5 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Tên đăng nhập:
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ví dụ: abcdf"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Mật khẩu:
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu (ví dụ: 123)..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <input
                      type="checkbox"
                      id="rememberForever"
                      checked={rememberForever}
                      onChange={(e) => setRememberForever(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="rememberForever" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{loading ? 'Đang kiểm tra...' : 'Đăng Nhập'}</span>
                  </button>
                </form>
              )}

              {/* Form 2: Đăng Ký */}
              {authMode === 'register' && (
                <form onSubmit={handleRegister} className="space-y-3.5 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Họ và tên của bạn:
                    </label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Ví dụ: ABCD"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Tên đăng nhập (viết liền không dấu):
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ví dụ: abcdf"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Tạo mật khẩu:
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mật khẩu dễ nhớ (ví dụ: 123)..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{loading ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản'}</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
