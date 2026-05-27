"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Circle,
  ChevronDown,
  Target,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  description?: string;
  duration?: string;
}

interface Month {
  id: string;
  month: number;
  title: string;
  description: string;
  skills: string[];
  tasks: Task[];
  projects: unknown[];
}

interface RoadmapContent {
  title: string;
  description: string;
  duration: string;
  months: Month[];
  projects: unknown[];
  goals: unknown[];
}

interface RoadmapDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  content: RoadmapContent;
  progress: number;
  createdAt: string;
}

interface CompletedTask {
  taskId: string;
  completedAt: string;
}

export default function RoadmapDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [roadmap, setRoadmap] = useState<RoadmapDetail | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadmap();
    fetchProgress();
  }, [id]);

  const fetchRoadmap = async () => {
    try {
      const res = await fetch(`/api/roadmaps/${id}`);
      if (res.ok) {
        const data = await res.json();
        setRoadmap(data.roadmap);
        if (data.roadmap?.content?.months?.length) {
          const firstId = data.roadmap.content.months[0]?.id;
          if (firstId) setExpandedMonths(new Set([firstId]));
        }
      } else {
        router.push("/dashboard/roadmaps");
      }
    } catch {
      router.push("/dashboard/roadmaps");
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await fetch("/api/progress");
      if (res.ok) {
        const data = await res.json();
        const completed = (data.progress?.completedTasks || []).filter(
          (t: CompletedTask) => t.roadmapId === id
        );
        setCompletedTasks(new Set(completed.map((t: CompletedTask) => t.taskId)));
      }
    } catch {
      // handle silently
    }
  };

  const toggleTask = async (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    const taskKey = taskId;

    if (newCompleted.has(taskKey)) {
      newCompleted.delete(taskKey);
    } else {
      newCompleted.add(taskKey);
    }
    setCompletedTasks(newCompleted);

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: newCompleted.has(taskKey) ? "add" : "remove",
          roadmapId: id,
          taskId,
          taskTitle: findTaskTitle(taskId, roadmap?.content?.months || []),
          roadmapTitle: roadmap?.title || "",
        }),
      });
      await fetchRoadmap();
    } catch {
      if (newCompleted.has(taskKey)) {
        newCompleted.delete(taskKey);
      } else {
        newCompleted.add(taskKey);
      }
      setCompletedTasks(newCompleted);
    }
  };

  const toggleMonth = (monthId: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(monthId)) {
      newExpanded.delete(monthId);
    } else {
      newExpanded.add(monthId);
    }
    setExpandedMonths(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!roadmap) return null;

  const months = roadmap.content?.months || [];
  const totalTasks = months.reduce((acc, m) => acc + m.tasks.length, 0);
  const completedCount = Array.from(completedTasks).filter((t) =>
    months.some((m) => m.tasks.some((task) => task.id === t))
  ).length;
  const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/dashboard/roadmaps"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại lộ trình
        </Link>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                {roadmap.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
              {roadmap.title}
            </h1>
            <p className="text-sm text-text-secondary max-w-2xl">{roadmap.description}</p>
          </div>
        </div>

        <Card variant="elevated" className="p-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-secondary">Tiến độ hoàn thành</span>
            <span className="text-sm font-bold text-accent">{progress}%</span>
          </div>
          <Progress value={progress} size="md" />
          <p className="text-xs text-text-muted mt-2">
            {completedCount} / {totalTasks} bài tập đã hoàn thành
          </p>
        </Card>
      </motion.div>

      <div className="space-y-3">
        {months.map((month, monthIndex) => {
          const isExpanded = expandedMonths.has(month.id);
          const monthCompleted = month.tasks.filter((t) =>
            completedTasks.has(t.id)
          ).length;
          const monthProgress =
            month.tasks.length > 0
              ? Math.round((monthCompleted / month.tasks.length) * 100)
              : 0;

          return (
            <motion.div
              key={month.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: monthIndex * 0.1 }}
            >
              <Card variant="elevated" className="overflow-hidden">
                <button
                  onClick={() => toggleMonth(month.id)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-elevated/50 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 shrink-0">
                    <Target className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-accent">Tháng {month.month}</span>
                    </div>
                    <h3 className="font-semibold text-text-primary mt-0.5">{month.title}</h3>
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{month.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-text-muted">{monthCompleted}/{month.tasks.length}</p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <div className="w-16 h-1.5 bg-elevated rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all"
                          style={{ width: `${monthProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-text-muted shrink-0 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="border-t border-border">
                    {month.tasks.length > 0 && (
                      <div className="px-4 py-2">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Bài tập</p>
                      </div>
                    )}
                    {month.tasks.map((task) => {
                      const isDone = completedTasks.has(task.id);
                      return (
                        <div
                          key={task.id}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-elevated/50 transition-colors ${
                            isDone ? "opacity-60" : ""
                          }`}
                        >
                          <button onClick={() => toggleTask(task.id)} className="mt-0.5 shrink-0">
                            {isDone ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            ) : (
                              <Circle className="h-5 w-5 text-text-muted hover:text-accent transition-colors" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium ${
                                isDone ? "line-through text-text-muted" : "text-text-primary"
                              }`}
                            >
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-xs text-text-muted mt-0.5">{task.description}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {month.tasks.length === 0 && (
                      <p className="px-4 py-6 text-sm text-text-muted text-center">
                        Không có bài tập nào.
                      </p>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function findTaskTitle(taskId: string, months: Month[]): string {
  for (const month of months) {
    const task = month.tasks.find((t) => t.id === taskId);
    if (task) return task.title;
  }
  return taskId;
}
