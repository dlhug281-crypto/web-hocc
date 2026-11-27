/**
 * Hướng dẫn & Cấu trúc kiến trúc Prisma tích hợp nhiều cơ sở dữ liệu chồng lên 1 dự án
 * (Prisma Multi-Database & Multi-Schema Architecture)
 */

export interface DatabaseConnectionInfo {
  name: string;
  type: string;
  purpose: string;
  schemaSample: string;
  clientExample: string;
}

export const PRISMA_MULTI_DB_PATTERNS: DatabaseConnectionInfo[] = [
  {
    name: 'Mô Hình 1: Multiple Prisma Clients (Nhiều Database Độc Lập Chồng Lên Nhau)',
    type: 'Multi-Client Architecture',
    purpose: 'Khi dự án kết nối đồng thời 2 hoặc nhiều cơ sở dữ liệu riêng biệt (Ví dụ: DB 1 lưu Tài Khoản/Người Dùng, DB 2 lưu Thời Khóa Biểu/Dữ Liệu Lớp Học, DB 3 lưu Log/Analytics).',
    schemaSample: `// File: prisma/auth.prisma
datasource dbAuth {
  provider = "postgresql"
  url      = env("AUTH_DATABASE_URL")
}

generator clientAuth {
  provider = "prisma-client-js"
  output   = "./generated/client-auth"
}

model User {
  id        String   @id @default(uuid())
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
}

// File: prisma/schedule.prisma
datasource dbSchedule {
  provider = "postgresql"
  url      = env("SCHEDULE_DATABASE_URL")
}

generator clientSchedule {
  provider = "prisma-client-js"
  output   = "./generated/client-schedule"
}

model ScheduleSlot {
  id        String   @id @default(cuid())
  userId    String
  day       String
  period    Int
  subject   String
  room      String?
}`,
    clientExample: `// Cách gọi trong code TypeScript:
import { PrismaClient as AuthClient } from './prisma/generated/client-auth';
import { PrismaClient as ScheduleClient } from './prisma/generated/client-schedule';

export const authDb = new AuthClient({
  datasources: { dbAuth: { url: process.env.AUTH_DATABASE_URL } }
});

export const scheduleDb = new ScheduleClient({
  datasources: { dbSchedule: { url: process.env.SCHEDULE_DATABASE_URL } }
});

// Sử dụng đồng thời:
async function getUserTimetable(userId: string) {
  const user = await authDb.user.findUnique({ where: { id: userId } });
  const slots = await scheduleDb.scheduleSlot.findMany({ where: { userId } });
  return { user, slots };
}`,
  },
  {
    name: 'Mô Hình 2: Multi-Schema (Nhiều Schema trong Cùng 1 PostgreSQL Database)',
    type: 'PostgreSQL Multi-Schema',
    purpose: 'Phân vùng dữ liệu thành nhiều schema độc lập (ví dụ: auth, school, pomodoro) trong cùng một cơ sở dữ liệu PostgreSQL duy nhất, tiết kiệm chi phí máy chủ.',
    schemaSample: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["auth", "school", "analytics"]
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}

model Account {
  id       String @id @default(uuid())
  username String @unique
  @@schema("auth")
}

model TimetableSlot {
  id      String @id @default(cuid())
  subject String
  @@schema("school")
}`,
    clientExample: `import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Truy vấn các bảng thuộc schema khác nhau hoàn toàn trong sáng:
const account = await prisma.account.findFirst();
const slot = await prisma.timetableSlot.findMany();`,
  },
];
