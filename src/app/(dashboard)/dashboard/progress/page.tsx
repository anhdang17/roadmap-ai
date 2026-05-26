"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, CheckCircle2, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import type { IRoadmap, IProgress } from "@/types";

interface ProgressData {
  id: string;
  roadmapId: string;
  completedTasks: string[];
  roadmap: IRoadmap | null;
  completionPercent: number;
}

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/progress");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProgressData(data.data || []);
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const avgCompletion =
    progressData.length > 0
      ? Math.round(
          progressData.reduce((sum, p) => sum + p.completionPercent, 0) / progressData.length
        )
      : 0;

  const statCards = [
    {
      label: "Roadmaps đang học",
      value: progressData.length,
      icon: BookOpen,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      label: "Tasks hoàn thành",
      value: progressData.reduce(
        (sum, p) => sum + (p.completedTasks?.length || 0),
        0
      ),
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Completion trung bình",
      value: `${avgCompletion}%`,
      icon: TrendingUp,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Progress</h1>
        <p className="text-text-secondary mt-1">Theo dõi tiến độ học tập của bạn</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4">
        {loading
          ? [1, 2, 3].map((i) => (
              <Card key={i} variant="elevated" className="p-5">
                <Skeleton className="h-10 w-10 rounded-xl mb-3" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </Card>
            ))
          : statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card variant="elevated" className="p-5">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${card.bg} mb-3`}>
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                    <div className="text-2xl font-bold text-text-primary">{card.value}</div>
                    <div className="text-xs text-text-muted">{card.label}</div>
                  </Card>
                </motion.div>
              );
            })}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Chi tiết theo Roadmap</h2>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} variant="elevated" className="p-5">
                <Skeleton className="h-5 w-40 mb-3" />
                <Skeleton className="h-2 w-full rounded-full mb-2" />
                <Skeleton className="h-3 w-20" />
              </Card>
            ))}
          </div>
        ) : progressData.length === 0 ? (
          <Card variant="elevated" className="p-10 text-center">
            <p className="text-sm text-text-secondary">
              Chưa có dữ liệu tiến độ. Bắt đầu học một roadmap để theo dõi.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {progressData.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <a href={`/roadmap/${item.roadmapId}`}>
                  <Card variant="elevated" className="p-5 hover:border-accent/20 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-text-primary">
                        {item.roadmap?.title || "Untitled Roadmap"}
                      </h3>
                      <span className="text-xs font-semibold text-accent">{item.completionPercent}%</span>
                    </div>
                    <Progress
                      value={item.completionPercent}
                      size="sm"
                      color={item.completionPercent === 100 ? "success" : "accent"}
                      className="mb-2"
                    />
                    <p className="text-xs text-text-muted">
                      {item.completedTasks?.length || 0} /{" "}
                      {(item.roadmap?.content?.months?.reduce(
                        (s, m) => s + m.tasks.length,
                        0
                      )) || 0}{" "}
                      tasks hoàn thành
                    </p>
                  </Card>
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
