"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  TrendingUp,
  Zap,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface Stats {
  totalRoadmaps: number;
  completedTasks: number;
  totalTasks: number;
  streak: number;
}

interface RecentRoadmap {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalRoadmaps: 0,
    completedTasks: 0,
    totalTasks: 0,
    streak: 0,
  });
  const [recentRoadmaps, setRecentRoadmaps] = useState<RecentRoadmap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roadmapsRes, progressRes] = await Promise.all([
        fetch("/api/roadmaps"),
        fetch("/api/progress"),
      ]);

      if (roadmapsRes.ok) {
        const data = await roadmapsRes.json();
        setRecentRoadmaps(data.roadmaps?.slice(0, 3) || []);

        const totalTasks = data.roadmaps?.reduce(
          (acc: number, r: { content?: { tasks?: unknown[] } }) =>
            acc + (r.content?.tasks?.length || 0),
          0
        ) || 0;
        setStats((prev) => ({ ...prev, totalRoadmaps: data.roadmaps?.length || 0, totalTasks }));
      }

      if (progressRes.ok) {
        const data = await progressRes.json();
        const completed = data.progress?.completedTasks?.length || 0;
        setStats((prev) => ({
          ...prev,
          completedTasks: completed,
          streak: data.progress?.streak || 0,
        }));
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

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-text-primary mb-1">Dashboard</h1>
        <p className="text-sm text-text-muted">
          Chào mừng bạn quay lại! Theo dõi tiến độ học tập của bạn.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Tổng Roadmap",
            value: stats.totalRoadmaps,
            icon: BookOpen,
            color: "text-violet-400",
            bg: "bg-violet-500/10",
          },
          {
            label: "Bài tập hoàn thành",
            value: stats.completedTasks,
            icon: TrendingUp,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Tổng bài tập",
            value: stats.totalTasks,
            icon: Zap,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
          },
          {
            label: "Streak ngày",
            value: `${stats.streak}d`,
            icon: Zap,
            color: "text-pink-400",
            bg: "bg-pink-500/10",
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card variant="elevated" className="p-5">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                    <p className="text-xs text-text-muted">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {stats.totalRoadmaps > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">Lộ trình gần đây</h2>
            <Link href="/dashboard/roadmaps">
              <Button variant="ghost" size="sm">
                Xem tất cả <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentRoadmaps.map((roadmap, i) => (
              <motion.div
                key={roadmap.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={`/roadmap/${roadmap.id}`}>
                  <Card variant="elevated" className="p-5 hover:border-accent/30 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-accent" />
                        <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                          {roadmap.category}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-text-primary mb-1 group-hover:text-accent transition-colors">
                      {roadmap.title}
                    </h3>
                    <p className="text-xs text-text-muted mb-3 line-clamp-2">
                      {roadmap.description}
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-muted">Tiến độ</span>
                        <span className="text-text-secondary font-medium">{roadmap.progress}%</span>
                      </div>
                      <Progress value={roadmap.progress} size="sm" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {stats.totalRoadmaps === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card variant="elevated" className="p-10 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-2xl bg-accent/10">
                <Zap className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  Bắt đầu hành trình học tập
                </h3>
                <p className="text-sm text-text-muted mb-4 max-w-sm">
                  Tạo roadmap đầu tiên của bạn với AI và bắt đầu theo dõi tiến độ học tập.
                </p>
              </div>
              <Link href="/generate">
                <Button>
                  <Zap className="h-4 w-4" />
                  Tạo roadmap đầu tiên
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
