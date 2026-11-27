/**
 * Quản lý lưu trữ bền vững lâu dài (Dual Persistence: LocalStorage + IndexedDB + StorageManager persist)
 * Đảm bảo dữ liệu thời khóa biểu và ghi chú không bao giờ bị xóa ngay cả khi không vào web trong thời gian dài.
 */

const DB_NAME = 'EduScheduleDB_v1';
const STORE_NAME = 'permanent_storage';

function openIndexedDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

/**
 * Lưu dữ liệu đồng thời vào IndexedDB để làm bản sao lưu vĩnh viễn
 */
export async function saveToIndexedDB(key: string, value: any): Promise<void> {
  try {
    const db = await openIndexedDB();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(value, key);
  } catch (e) {
    // Silent fallback
  }
}

/**
 * Đọc dữ liệu từ IndexedDB dự phòng
 */
export async function getFromIndexedDB<T = any>(key: string): Promise<T | null> {
  try {
    const db = await openIndexedDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

/**
 * Yêu cầu trình duyệt khóa dữ liệu vào chế độ lưu trữ vĩnh viễn (không bao giờ tự giải phóng)
 */
export async function requestPermanentStorage(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    if (navigator.storage && navigator.storage.persist) {
      const isPersisted = await navigator.storage.persist();
      return isPersisted;
    }
  } catch (e) {}
  return false;
}

export interface SavedVaultAccount {
  username: string;
  password?: string;
  name: string;
  syncCode?: string;
  savedAt: string;
}

const VAULT_KEY = 'eduschedule_accounts_vault_permanent';

// Danh sách tài khoản mặc định được bảo lưu vĩnh viễn qua mọi phiên bản
export const DEFAULT_VAULT_ACCOUNTS: SavedVaultAccount[] = [
  {
    username: 'abcdf',
    password: '123',
    name: 'ABCD',
    syncCode: 'ABC10A',
    savedAt: '2026-11-01T00:00:00.000Z'
  },
  {
    username: 'dang_le_hung',
    password: '123',
    name: 'Đặng Lê Hùng',
    syncCode: 'DLH10A',
    savedAt: '2026-11-01T00:00:00.000Z'
  }
];

export async function getAccountsVault(): Promise<SavedVaultAccount[]> {
  try {
    let list: SavedVaultAccount[] = [];
    if (typeof window !== 'undefined') {
      const fromLocal = localStorage.getItem(VAULT_KEY);
      if (fromLocal) {
        try {
          const parsed = JSON.parse(fromLocal);
          if (Array.isArray(parsed)) list = parsed;
        } catch (e) {}
      }
    }
    if (!list || list.length === 0) {
      const fromIdb = await getFromIndexedDB<SavedVaultAccount[]>(VAULT_KEY);
      if (fromIdb && Array.isArray(fromIdb) && fromIdb.length > 0) {
        list = fromIdb;
      }
    }

    // Đảm bảo các tài khoản mẫu luôn có mặt
    DEFAULT_VAULT_ACCOUNTS.forEach((def) => {
      if (!list.some((a) => a.username.toLowerCase() === def.username.toLowerCase())) {
        list.push(def);
      }
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(VAULT_KEY, JSON.stringify(list));
    }
    return list;
  } catch (e) {
    return DEFAULT_VAULT_ACCOUNTS;
  }
}

export async function saveAccountToVault(account: SavedVaultAccount): Promise<void> {
  try {
    const list = await getAccountsVault();
    const cleanUser = account.username.trim().toLowerCase();
    const existingIndex = list.findIndex((a) => a.username.toLowerCase() === cleanUser);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...account, username: cleanUser };
    } else {
      list.unshift({ ...account, username: cleanUser });
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(VAULT_KEY, JSON.stringify(list));
    }
    await saveToIndexedDB(VAULT_KEY, list);
  } catch (e) {
    // Silent
  }
}

