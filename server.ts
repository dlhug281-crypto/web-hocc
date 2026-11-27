import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PRIMARY_PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Folder lưu trữ database tài khoản bền vững trên máy chủ
const DATA_DIR = path.join(__dirname, 'server_data');
const DB_FILE = path.join(DATA_DIR, 'accounts_db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface UserAccount {
  id: string;
  username: string;
  password: string; // Plain/hashed PIN or password
  name: string;
  syncCode: string;
  createdAt: string;
  updatedAt: string;
  data: {
    slots: any[];
    subjects: any[];
    tasks: any[];
    profile: any;
  };
}

let dbCache: Record<string, UserAccount> = {};

const BACKUP_DB_FILE = path.join(__dirname, 'src', 'data', 'accounts_backup.json');

function loadDb() {
  dbCache = {};

  // 1. Nạp từ file backup trong mã nguồn (bảo toàn vĩnh viễn qua mọi đợt deploy/cập nhật phiên bản)
  try {
    if (fs.existsSync(BACKUP_DB_FILE)) {
      const backupData = JSON.parse(fs.readFileSync(BACKUP_DB_FILE, 'utf-8'));
      if (backupData && typeof backupData === 'object') {
        Object.assign(dbCache, backupData);
      }
    }
  } catch (e) {
    console.warn('Could not read backup DB file:', e);
  }

  // 2. Nạp tiếp từ server_data/accounts_db.json (nếu có cập nhật mới hơn)
  try {
    if (fs.existsSync(DB_FILE)) {
      const serverData = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      if (serverData && typeof serverData === 'object') {
        Object.assign(dbCache, serverData);
      }
    }
  } catch (e) {
    console.warn('Could not read server data file:', e);
  }

  // 3. Đảm bảo tài khoản mẫu ABCD (abcdf) luôn tồn tại
  if (!dbCache['abcdf']) {
    dbCache['abcdf'] = {
      id: 'acc_seed_abcdf',
      username: 'abcdf',
      password: '123',
      name: 'ABCD',
      syncCode: 'ABC10A',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: {
        slots: [],
        subjects: [],
        tasks: [],
        profile: {
          name: 'ABCD',
          schoolName: 'Trường THPT Vĩnh Thạnh',
          className: 'Lớp 10A1 · Buổi Sáng',
          targetGoal: 'Học kỳ I (2026 - 2027) · Tuần 9'
        }
      }
    };
  }

  saveDb();
}

function saveDb() {
  try {
    const dataStr = JSON.stringify(dbCache, null, 2);
    // Lưu vào thư mục server_data
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, dataStr, 'utf-8');

    // Đồng thời lưu vào src/data/accounts_backup.json để không bao giờ mất qua các phiên bản
    const backupDir = path.dirname(BACKUP_DB_FILE);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    fs.writeFileSync(BACKUP_DB_FILE, dataStr, 'utf-8');
  } catch (e) {
    console.error('Error saving DB:', e);
  }
}

loadDb();

function generateSyncCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ================= API ROUTES =================

// 1. Đăng ký tài khoản mới
app.post('/api/auth/register', (req, res) => {
  const { username, password, name, initialData } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập tên đăng nhập và mật khẩu/mã PIN' });
  }

  const cleanUsername = String(username).trim().toLowerCase();
  if (dbCache[cleanUsername]) {
    return res.status(400).json({ error: 'Tên đăng nhập này đã tồn tại. Vui lòng chọn tên khác hoặc Đăng nhập.' });
  }

  const account: UserAccount = {
    id: `acc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    username: cleanUsername,
    password: String(password).trim(),
    name: name ? String(name).trim() : 'Đặng Lê Hùng',
    syncCode: generateSyncCode(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      slots: initialData?.slots || [],
      subjects: initialData?.subjects || [],
      tasks: initialData?.tasks || [],
      profile: initialData?.profile || {
        name: name || 'Đặng Lê Hùng',
        schoolName: 'Trường THPT Vĩnh Thạnh',
        className: 'Lớp 10A1 · Buổi Sáng',
        targetGoal: 'Học kỳ I (2026 - 2027) · Tuần 9'
      }
    }
  };

  dbCache[cleanUsername] = account;
  saveDb();

  res.json({
    success: true,
    user: {
      id: account.id,
      username: account.username,
      name: account.name,
      syncCode: account.syncCode
    },
    data: account.data
  });
});

// 2. Đăng nhập bằng Tên đăng nhập & Mật khẩu (kèm tính năng Tự Phục Hồi vĩnh viễn)
app.post('/api/auth/login', (req, res) => {
  const { username, password, clientAccount } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu' });
  }

  const cleanUsername = String(username).trim().toLowerCase();
  const inputPwd = String(password).trim();

  // Nạp lại dữ liệu nếu chưa thấy tài khoản trong cache bộ nhớ
  if (!dbCache[cleanUsername]) {
    loadDb();
  }

  // Tự động phục hồi tài khoản từ Client Vault nếu máy chủ vừa khởi động lại hoặc nâng cấp phiên bản
  if (!dbCache[cleanUsername] && clientAccount && clientAccount.username) {
    const cUser = String(clientAccount.username).trim().toLowerCase();
    if (cUser === cleanUsername && clientAccount.password === inputPwd) {
      dbCache[cleanUsername] = {
        id: clientAccount.id || `acc_${Date.now()}_vault`,
        username: cleanUsername,
        password: inputPwd,
        name: clientAccount.name || 'ABCD',
        syncCode: clientAccount.syncCode || generateSyncCode(),
        createdAt: clientAccount.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: clientAccount.data || { slots: [], subjects: [], tasks: [], profile: {} }
      };
      saveDb();
    }
  }

  const account = dbCache[cleanUsername];

  // Kiểm tra mật khẩu (hỗ trợ các mật khẩu phổ biến cho tài khoản mẫu abcdf)
  const isMatch = account && (
    account.password === inputPwd ||
    (cleanUsername === 'abcdf' && ['123', '123456', 'abcdf', 'ABCD'].includes(inputPwd))
  );

  if (!account || !isMatch) {
    return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu/mã PIN không chính xác' });
  }

  res.json({
    success: true,
    user: {
      id: account.id,
      username: account.username,
      name: account.name,
      syncCode: account.syncCode
    },
    data: account.data
  });
});

// 2.1 API đồng bộ bảo lưu tài khoản (Auto-Rehydrate từ thiết bị khách lên máy chủ)
app.post('/api/auth/rehydrate', (req, res) => {
  const { accounts } = req.body;
  let restored = 0;
  if (Array.isArray(accounts)) {
    accounts.forEach((acc: any) => {
      if (acc && acc.username && acc.password) {
        const u = String(acc.username).trim().toLowerCase();
        if (!dbCache[u]) {
          dbCache[u] = {
            id: acc.id || `acc_restored_${Date.now()}`,
            username: u,
            password: String(acc.password).trim(),
            name: acc.name ? String(acc.name).trim() : 'ABCD',
            syncCode: acc.syncCode || generateSyncCode(),
            createdAt: acc.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            data: acc.data || { slots: [], subjects: [], tasks: [], profile: {} }
          };
          restored++;
        }
      }
    });
    if (restored > 0) {
      saveDb();
    }
  }
  res.json({ success: true, restored, total: Object.keys(dbCache).length });
});

// 2.2 API lấy danh sách tài khoản gợi ý cho lớp 10A1
app.get('/api/auth/suggested-accounts', (req, res) => {
  loadDb();
  const list = Object.values(dbCache).map((acc) => ({
    username: acc.username,
    name: acc.name,
    syncCode: acc.syncCode
  }));
  res.json({ success: true, accounts: list });
});

// 3. Đăng nhập / Đồng bộ nhanh bằng Mã Đồng Bộ 6 ký tự (Quick Sync Code giữa điện thoại và máy tính)
app.post('/api/auth/sync-code', (req, res) => {
  const { syncCode } = req.body;
  if (!syncCode) {
    return res.status(400).json({ error: 'Vui lòng cung cấp mã đồng bộ' });
  }

  const cleanCode = String(syncCode).trim().toUpperCase();
  const account = Object.values(dbCache).find((acc) => acc.syncCode === cleanCode);

  if (!account) {
    return res.status(404).json({ error: 'Không tìm thấy tài khoản với mã đồng bộ này. Vui lòng kiểm tra lại.' });
  }

  res.json({
    success: true,
    user: {
      id: account.id,
      username: account.username,
      name: account.name,
      syncCode: account.syncCode
    },
    data: account.data
  });
});

// 4. Đồng bộ lưu dữ liệu khi có thay đổi từ máy tính hoặc điện thoại
app.put('/api/user/sync', (req, res) => {
  const { username, data } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Thiếu thông tin tài khoản' });
  }

  const cleanUsername = String(username).trim().toLowerCase();
  const account = dbCache[cleanUsername];

  if (!account) {
    return res.status(404).json({ error: 'Tài khoản không tồn tại trên hệ thống' });
  }

  account.data = {
    slots: Array.isArray(data?.slots) ? data.slots : account.data.slots,
    subjects: Array.isArray(data?.subjects) ? data.subjects : account.data.subjects,
    tasks: Array.isArray(data?.tasks) ? data.tasks : account.data.tasks,
    profile: data?.profile || account.data.profile
  };
  account.updatedAt = new Date().toISOString();

  saveDb();

  res.json({
    success: true,
    updatedAt: account.updatedAt
  });
});

// ================= RATE LIMITER (CHỐNG SPAM & TRÀN DỮ LIỆU) =================
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

function checkRateLimit(key: string, maxRequests: number, windowMs: number): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (record.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  record.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

// 5. Lấy dữ liệu mới nhất của tài khoản
app.get('/api/user/data', (req, res) => {
  const username = String(req.query.username || '').trim().toLowerCase();
  const account = dbCache[username];
  if (!account) {
    return res.status(404).json({ error: 'Tài khoản không tồn tại' });
  }
  res.json({
    success: true,
    data: account.data,
    updatedAt: account.updatedAt
  });
});

// 6. AI Assistant Endpoint (Tích hợp OpenAI / Gemini kèm Rate Limit chống spam)
app.post('/api/ai/chat', async (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'client';
  const rateLimitKey = `ai_${String(clientIp).split(',')[0].trim()}`;
  
  // Rate limit: Tối đa 12 câu hỏi / 1 phút để chống spam và tràn dữ liệu
  const limitCheck = checkRateLimit(rateLimitKey, 12, 60 * 1000);
  if (!limitCheck.allowed) {
    return res.status(429).json({
      error: `Bạn đang gửi câu hỏi quá nhanh. Vui lòng chờ ${limitCheck.retryAfterSeconds} giây trước khi gửi câu hỏi tiếp theo để tránh tràn dữ liệu hệ thống.`
    });
  }

  const { message, history, context, openAiKey } = req.body;
  if (!message || !String(message).trim()) {
    return res.status(400).json({ error: 'Nội dung câu hỏi không được để trống.' });
  }

  const promptText = String(message).trim();
  const apiKey = openAiKey || process.env.OPENAI_API_KEY;

  // Nếu có OpenAI API Key, gọi trực tiếp OpenAI API
  if (apiKey && String(apiKey).startsWith('sk-')) {
    try {
      const messages = [
        {
          role: 'system',
          content: 'Bạn là Trợ lý Học tập AI thông minh cho học sinh Lớp 10A1 Trường THPT Vĩnh Thạnh. Bạn hỗ trợ giải bài tập, tóm tắt lý thuyết Toán, Lý, Hóa, Văn, Anh 10, lập thời gian biểu ôn thi và giải đáp thắc mắc ngắn gọn, dễ hiểu, thân thiện, dùng tiếng Việt chuẩn mực.'
        },
        ...(Array.isArray(history) ? history.slice(-6) : []),
        { role: 'user', content: promptText }
      ];

      const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      const openAiData = await openAiRes.json();
      if (!openAiRes.ok || !openAiData.choices?.[0]?.message?.content) {
        throw new Error(openAiData.error?.message || 'Lỗi khi gọi OpenAI API.');
      }

      return res.json({
        success: true,
        provider: 'OpenAI GPT-4o-mini',
        reply: openAiData.choices[0].message.content
      });
    } catch (err: any) {
      console.warn('OpenAI call failed, falling back to Gemini/system assistant:', err.message);
    }
  }

  // Thử dùng Google Gemini nếu có key trong process.env
  if (process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Bạn là Trợ lý Học tập AI cho học sinh Lớp 10A1 THPT Vĩnh Thạnh. Trả lời câu hỏi sau một cách dễ hiểu, có tâm và chính xác: ${promptText}`
      });

      if (response.text) {
        return res.json({
          success: true,
          provider: 'Gemini 3.8 Flash',
          reply: response.text
        });
      }
    } catch (err: any) {
      console.warn('Gemini call failed:', err.message);
    }
  }

  // Chế độ Trợ lý Học tập Tích hợp sẵn (Built-in High School Academic Engine)
  const lower = promptText.toLowerCase();
  let smartReply = '';

  if (lower.includes('toán') || lower.includes('phương trình') || lower.includes('hàm số') || lower.includes('vecto')) {
    smartReply = `📐 **[Góc Học Tập Môn Toán 10 - THPT Vĩnh Thạnh]**\n\nĐối với câu hỏi của bạn: "${promptText}"\n\n💡 **Phương pháp giải kiến nghị:**\n1. Xác định tập xác định và điều kiện có nghiệm của bài toán.\n2. Áp dụng định lý hoặc công thức biến đổi cơ bản (đối với Vectơ: quy tắc 3 điểm, hình bình hành, tích vô hướng; đối với Bất đẳng thức/Tam thức bậc hai: xét dấu $\\Delta$).\n3. Trình bày rõ ràng từng bước suy luận logic để không bị trừ điểm trình bày kiểm tra trên lớp.\n\n*Nếu bạn có OpenAI API Key, hãy nhập vào mục Cài đặt AI để trợ lý giải chi tiết từng bước cho bài toán này nhé!*`;
  } else if (lower.includes('lý') || lower.includes('vật lý') || lower.includes('chuyển động') || lower.includes('lực') || lower.includes('newton')) {
    smartReply = `⚡ **[Góc Học Tập Môn Vật Lý 10]**\n\nĐối với câu hỏi: "${promptText}"\n\n💡 **Cốt lõi lý thuyết:**\n- Luôn vẽ hình biểu diễn các vectơ lực tác dụng lên vật.\n- Nhớ các công thức động học: $v = v_0 + at$, $d = v_0t + \\frac{1}{2}at^2$, $v^2 - v_0^2 = 2ad$.\n- Áp dụng 3 định luật Newton: $\\vec{F}_{hl} = m\\vec{a}$.\n\nChúc bạn học tập hiệu quả môn Vật lý!`;
  } else if (lower.includes('hóa') || lower.includes('nguyên tử') || lower.includes('bảng tuần hoàn') || lower.includes('oxi hóa')) {
    smartReply = `🧪 **[Góc Học Tập Môn Hóa Học 10]**\n\nĐối với câu hỏi: "${promptText}"\n\n💡 **Mẹo ghi nhớ:**\n- Cấu hình electron nguyên tử: $1s^2 2s^2 2p^6 3s^2 3p^6...$\n- Phản ứng oxi hóa - khử: "Khử cho - O nhận", số oxi hóa tăng là chất khử, số oxi hóa giảm là chất oxi hóa.`;
  } else if (lower.includes('thời khóa biểu') || lower.includes('lịch') || lower.includes('hôm nay') || lower.includes('tuần 9')) {
    smartReply = `📅 **[Lịch Học & Kế Hoạch Tuần 9 Lớp 10A1]**\n\n- Thời khóa biểu Lớp 10A1 học vào **buổi sáng** (từ Tiết 1 đến Tiết 5).\n- Các môn học chính: Toán, Vật lý, Hóa học, Ngữ văn, Lịch sử, Địa lý, Tiếng Anh, Tin học, GDQP&AN, Thể dục, HĐTN-HN.\n- Hãy sử dụng tính năng **Học Tập Trung (Pomodoro)** trên web kết hợp danh sách **Bài Tập & Deadline** để ôn luyện tốt nhất!`;
  } else {
    smartReply = `✨ **[Trợ Lý AI Học Tập 10A1]**\n\nChào bạn! Tôi đã nhận được câu hỏi: "${promptText}".\n\n💡 **Gợi ý học tập:**\n- Chia nhỏ nội dung cần học thành từng phần 25 phút (kỹ thuật Pomodoro).\n- Sau mỗi tiết học, dành 5 phút xem lại vở ghi để tăng khả năng ghi nhớ dài hạn.\n- Bạn có thể dán API Key của OpenAI trong ô cài đặt để trò chuyện chuyên sâu với mô hình GPT-4o-mini mạnh mẽ nhất!`;
  }

  return res.json({
    success: true,
    provider: 'EduSchedule Assistant (Sẵn Sàng)',
    reply: smartReply
  });
});

// 7. YouTube Music Link Validator (Kèm Rate Limit chống spam tràn dữ liệu)
app.post('/api/music/validate', (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'client';
  const rateLimitKey = `music_${String(clientIp).split(',')[0].trim()}`;

  // Rate limit: Tối đa 8 lần đổi link YouTube / 1 phút
  const limitCheck = checkRateLimit(rateLimitKey, 8, 60 * 1000);
  if (!limitCheck.allowed) {
    return res.status(429).json({
      error: `Bạn thao tác quá nhanh. Vui lòng đợi ${limitCheck.retryAfterSeconds} giây trước khi đổi bài hát tiếp theo để tránh tràn dữ liệu.`
    });
  }

  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Vui lòng cung cấp link YouTube hợp lệ.' });
  }

  const cleanUrl = url.trim();

  // Trích xuất YouTube Video ID từ nhiều định dạng URL khác nhau
  let videoId = '';

  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|music\.youtube\.com\/watch\?v=)([^"&?\/\s]{11})/;
  const match = cleanUrl.match(regExp);

  if (match && match[1]) {
    videoId = match[1];
  }

  // Kiểm tra nếu là danh sách phát Playlist
  const listMatch = cleanUrl.match(/[?&]list=([^#\&\?]+)/);
  const playlistId = listMatch ? listMatch[1] : null;

  if (!videoId && !playlistId) {
    return res.status(400).json({
      error: 'Link YouTube không đúng định dạng. Ví dụ hợp lệ: https://www.youtube.com/watch?v=jfKfPfyJRdk hoặc https://youtu.be/...'
    });
  }

  res.json({
    success: true,
    videoId: videoId || null,
    playlistId: playlistId || null,
    embedUrl: videoId
      ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1`
      : `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&autoplay=1`
  });
});

let activeCloudflareUrl = 'https://americans-floppy-wins-photos.trycloudflare.com';
let activeLocaltunnelUrl = 'https://tkb10a1vinhthanh.loca.lt';

// Hàm đọc URL Cloudflare trực tiếp từ file log nếu có
function getLatestCloudflareUrl(): string {
  try {
    if (fs.existsSync('/tmp/cloudflared.log')) {
      const content = fs.readFileSync('/tmp/cloudflared.log', 'utf-8');
      const match = content.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
      if (match && match[0]) {
        activeCloudflareUrl = match[0];
      }
    }
  } catch (e) {}
  return activeCloudflareUrl;
}

function autoStartTunnels() {
  try {
    getLatestCloudflareUrl();
    const { spawn } = require('child_process');
    const localBin = path.join(__dirname, 'bin', 'cloudflared');
    const binPath = fs.existsSync(localBin) ? localBin : (fs.existsSync('/tmp/cloudflared') ? '/tmp/cloudflared' : 'cloudflared');
    const cf = spawn(binPath, ['tunnel', '--protocol', 'http2', '--url', 'http://localhost:3000']);
    cf.stderr.on('data', (d: Buffer) => {
      const match = d.toString().match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
      if (match && match[0]) {
        activeCloudflareUrl = match[0];
        console.log(`[Cloudflare Tunnel Active]: ${activeCloudflareUrl}`);
      }
    });

    const lt = spawn('npx', ['--yes', 'localtunnel', '--port', '3000', '--subdomain', 'tkb10a1vinhthanh']);
    lt.stdout.on('data', (d: Buffer) => {
      const match = d.toString().match(/https:\/\/[a-zA-Z0-9-]+\.loca\.lt/);
      if (match && match[0]) {
        activeLocaltunnelUrl = match[0];
        console.log(`[Localtunnel Active]: ${activeLocaltunnelUrl}`);
      }
    });
  } catch (e) {
    console.warn('Auto tunnel notice:', e);
  }
}

autoStartTunnels();

// ================= VITE MIDDLEWARES =================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  // Health check endpoint for Cloud Run and uptime monitors
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Active links API endpoint (cung cấp link đang chạy trực tiếp 100%)
  app.get('/api/active-links', (req, res) => {
    res.json({
      success: true,
      cloudflareUrl: activeCloudflareUrl,
      localtunnelUrl: activeLocaltunnelUrl
    });
  });

  // Short link API endpoint (cung cấp link ngắn cho học sinh lớp 10A1)
  app.get('/api/short-link', (req, res) => {
    res.json({
      success: true,
      cloudflareUrl: activeCloudflareUrl,
      localtunnelUrl: activeLocaltunnelUrl
    });
  });

  // Cloudflare Tunnel direct endpoint
  app.get('/api/cloudflare-url', (req, res) => {
    res.json({
      success: true,
      provider: 'Cloudflare Tunnel (trycloudflare.com)',
      url: activeCloudflareUrl
    });
  });

  // Download full project source zip (dành cho người dùng mở trong Visual Studio Code)
  app.get('/api/download-project', (req, res) => {
    const zipPath = path.join(__dirname, 'public', 'eduschedule-10a1-vinhthanh.zip');
    if (fs.existsSync(zipPath)) {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="eduschedule-10a1-vinhthanh-vscode.zip"');
      return res.sendFile(zipPath);
    }
    res.status(404).json({ error: 'File zip chưa được tạo' });
  });

  app.get('/api/download-source', (req, res) => {
    res.redirect('/api/download-project');
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Phục vụ thư mục dist khi chạy production
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        const indexPath = path.join(distPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).send('Application files not found. Please compile.');
        }
      });
    } else {
      console.warn('dist/ folder not found. Fallback to Vite server.');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa'
      });
      app.use(vite.middlewares);
    }
  }

  // Luôn lắng nghe trên PORT 3000 (bắt buộc cho Dev Server & iFrame của AI Studio)
  app.listen(PRIMARY_PORT, '0.0.0.0', () => {
    console.log(`EduSchedule full-stack server running on http://0.0.0.0:${PRIMARY_PORT}`);
  });

  // Đồng thời lắng nghe trên process.env.PORT (nếu Cloud Run phân bổ cổng khác như 8080)
  const envPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 0;
  if (envPort && envPort !== PRIMARY_PORT) {
    try {
      app.listen(envPort, '0.0.0.0', () => {
        console.log(`EduSchedule server also listening on http://0.0.0.0:${envPort}`);
      });
    } catch (err) {
      console.warn('Could not bind secondary port:', err);
    }
  }
}

startServer();
export default app;
