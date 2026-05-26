import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type TaskData, type ProjectData, type GoalData } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(prefix: string = "id"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 60);
}

export function countTotalTasks(
  months: { tasks: TaskData[] }[]
): number {
  return months.reduce((total, month) => total + month.tasks.length, 0);
}

export function calculateProgress(
  completedTasks: string[],
  allTaskIds: string[]
): number {
  if (allTaskIds.length === 0) return 0;
  const completed = allTaskIds.filter((id) => completedTasks.includes(id)).length;
  return Math.round((completed / allTaskIds.length) * 100);
}

export function extractAllTaskIds(
  months: { tasks: TaskData[] }[]
): string[] {
  return months.flatMap((month) => month.tasks.map((task) => task.id));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hôm nay";
  if (diffDays === 1) return "Hôm qua";
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
  return `${Math.floor(diffDays / 365)} năm trước`;
}

export function getDifficultyColor(
  difficulty: "Beginner" | "Intermediate" | "Advanced"
): string {
  switch (difficulty) {
    case "Beginner":
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    case "Intermediate":
      return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    case "Advanced":
      return "text-red-400 bg-red-400/10 border-red-400/20";
    default:
      return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
  }
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
