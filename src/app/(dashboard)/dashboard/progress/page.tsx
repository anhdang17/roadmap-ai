"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CompletedTask {
  taskId: string;
  taskTitle: string;
  roadmapId: string;
  roadmapTitle: string;
  completedAt: string;
}

interface ProgressData {
  completedTasks: CompletedTask[];
  streak: number;
}

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<ProgressData>({
    completedTasks: [],
    streak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await fetch("/api/progress");
      if (res.ok) {
        const data = await res.json();
        setProgressData(data.progress || { completedTasks: [], streak: 0 });
      }
    } catch {
      // handle silently
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  const completed = progressData.completedTasks || [];
  const streak = progressData.streak || 0;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-text-primary mb-1">Tiến độ học tập</h1>
        <p className="text-sm text-text-muted">
          Theo dõi tất cả bài tập và dự án đã hoàn thành của bạn.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card variant="elevated" className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{completed.length}</p>
                <p className="text-xs text-text-muted">Bài tập đã hoàn thành</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card variant="elevated" className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10">
                <TrendingUp className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{streak}</p>
                <p className="text-xs text-text-muted">Streak ngày học</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card variant="elevated" className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-500/10">
                <BookOpen className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {new Set(completed.map((t) => t.roadmapId)).size}
                </p>
                <p className="text-xs text-text-muted">Roadmap đã học</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Lịch sử hoàn thành
        </h2>

        {completed.length === 0 ? (
          <Card variant="elevated" className="p-10 text-center">
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-text-muted" />
              <p className="text-sm text-text-muted">
                Chưa có bài tập nào được hoàn thành. Bắt đầu học ngay!
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {completed.map((task, index) => (
              <motion.div
                key={`${task.taskId}-${task.completedAt}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card variant="elevated" className="p-4 flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-emerald-500/10 shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {task.taskTitle}
                    </p>
                    <p className="text-xs text-text-muted truncate">
                      {task.roadmapTitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-text-muted shrink-0">
                    <Calendar className="h-3 w-3" />
                    {new Date(task.completedAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
