// ─── User Types ───────────────────────────────────────────────────────────────

export type UserRole = "USER" | "ADMIN";

export interface IUser {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  image: string;
  role: UserRole;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// ─── Roadmap Types ────────────────────────────────────────────────────────────

export interface TaskData {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  skills: string[];
}

export interface GoalData {
  id: string;
  title: string;
  description: string;
  completed?: boolean;
}

export interface MonthData {
  month: number;
  title: string;
  description: string;
  skills: string[];
  tasks: TaskData[];
  projects: ProjectData[];
}

export interface RoadmapContent {
  months: MonthData[];
  projects: ProjectData[];
  goals: GoalData[];
}

export interface IRoadmap {
  id: string;
  userId: string;
  goal: string;
  title: string;
  description: string;
  duration: string;
  content: RoadmapContent;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// ─── Progress Types ──────────────────────────────────────────────────────────

export interface IProgress {
  id: string;
  userId: string;
  roadmapId: string;
  completedTasks: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

// ─── API Types ───────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total?: number;
  page?: number;
  limit?: number;
}

// ─── Admin Types ─────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  totalRoadmaps: number;
  activeUsers: number;
  aiRequestsToday: number;
}

export interface RoadmapCategoryCount {
  category: string;
  count: number;
}

// ─── Generate Request ─────────────────────────────────────────────────────────

export interface GenerateRoadmapRequest {
  goal: string;
}
