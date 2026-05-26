"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  TrendingUp,
  Flame,
  CheckCircle2,
  ArrowRight,
  Plus,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import type { IRoadmap } from "@/types";

interface DashboardStats {
  totalRoadmaps: number;
  totalTasksCompleted: number;
  avgCompletion: number;
  streakDays: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentRoadmaps, setRecentRoadmaps] = useState<IRoadmap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setStats(data.data?.stats || {
          totalRoadmaps: 0,
          totalTasksCompleted: 0,
          avgCompletion: 0,
          streakDays: 0,
        });
        setRecentRoadmaps(data.data?.recentRoadmaps || []);
      } catch {
        setStats({
          totalRoadmaps: 0,
          totalTasksCompleted: 0,
          avgCompletion: 0,
          streakDays: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      label: "Roadmaps",
      value: stats?.totalRoadmaps ?? "—",
      icon: BookOpen,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      label: "Tasks Completed",
      value: stats?.totalTasksCompleted ?? "—",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Avg. Completion",
      value: stats?.avgCompletion != null ? `${stats.avgCompletion}%` : "—",
      icon: TrendingUp,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Streak Days",
      value: stats?.streakDays ?? "—",
      icon: Flame,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary mt-1">Theo dõi hành trình học tập của bạn</p>
        </div>
        <Button onClick={() => router.push("/")} className="shadow-lg shadow-accent/20">
          <Plus className="h-4 w-4" /> New Roadmap
        </Button>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} variant="elevated" className="p-5">
                <Skeleton className="h-10 w-10 rounded-xl mb-3" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-4 w-20" />
              </Card>
            ))
          : statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Card variant="elevated" className="p-5 hover:border-accent/20 transition-all">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${card.bg} mb-3`}>
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                    <div className="text-2xl font-bold text-text-primary mb-0.5">{card.value}</div>
                    <div className="text-xs text-text-muted font-medium">{card.label}</div>
                  </Card>
                </motion.div>
              );
            })}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Recent Roadmaps</h2>
          <a href="/dashboard/roadmaps" className="text-sm text-accent hover:text-accent-light transition-colors flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} variant="elevated" className="p-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              </Card>
            ))}
          </div>
        ) : recentRoadmaps.length === 0 ? (
          <Card variant="elevated" className="p-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 mb-4">
              <Sparkles className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-base font-semibold text-text-primary mb-2">Chưa có roadmap nào</h3>
            <p className="text-sm text-text-secondary mb-6 max-w-xs mx-auto">
              Bắt đầu tạo roadmap đầu tiên để theo dõi tiến độ học tập của bạn.
            </p>
            <Button onClick={() => router.push("/")} size="sm">
              <Plus className="h-4 w-4" /> Tạo roadmap đầu tiên
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentRoadmaps.slice(0, 5).map((roadmap, i) => (
              <motion.div key={roadmap.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                <a href={`/roadmap/${roadmap.id}`}>
                  <Card variant="elevated" className="p-4 hover:border-accent/30 transition-all group">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen className="h-4 w-4 text-accent shrink-0" />
                          <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-accent transition-colors">
                            {roadmap.title}
                          </h3>
                        </div>
                        <p className="text-xs text-text-muted truncate mb-2">{roadmap.goal}</p>
                        <div className="flex items-center gap-3 text-xs text-text-muted">
                          <span>{roadmap.content?.months?.length || 0} months</span>
                          <span>·</span>
                          <span>{formatRelativeTime(roadmap.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Progress value={0} size="sm" className="w-20" />
                        <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-accent transition-colors" />
                      </div>
                    </div>
                  </Card>
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card variant="glass" className="p-5 cursor-pointer hover:border-accent/30 transition-all group" onClick={() => router.push("/")}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Generate Roadmap</p>
                <p className="text-xs text-text-muted">Tạo roadmap mới với AI</p>
              </div>
            </div>
          </Card>
          <a href="/dashboard/progress">
            <Card variant="glass" className="p-5 cursor-pointer hover:border-accent/30 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">View Progress</p>
                  <p className="text-xs text-text-muted">Xem chi tiết tiến độ</p>
                </div>
              </div>
            </Card>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
