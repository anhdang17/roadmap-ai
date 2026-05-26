"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  TrendingUp,
  Brain,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  totalUsers: number;
  totalRoadmaps: number;
  activeUsers: number;
  aiRequestsToday: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setStats(data.data || { totalUsers: 0, totalRoadmaps: 0, activeUsers: 0, aiRequestsToday: 0 });
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? "—",
      icon: Users,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      label: "Total Roadmaps",
      value: stats?.totalRoadmaps ?? "—",
      icon: BookOpen,
      color: "text-accent-light",
      bg: "bg-accent/10",
    },
    {
      label: "Active Users (7d)",
      value: stats?.activeUsers ?? "—",
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "AI Requests Today",
      value: stats?.aiRequestsToday ?? "—",
      icon: Brain,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
          Admin Dashboard
        </h1>
        <p className="text-text-secondary mt-1">
          Tổng quan hệ thống GoalPlan AI
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <Card key={i} variant="elevated" className="p-5">
                <Skeleton className="h-10 w-10 rounded-xl mb-3" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </Card>
            ))
          : cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card variant="elevated" className="p-5 hover:border-accent/20 transition-all">
                    <div
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${card.bg} mb-3`}
                    >
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                    <div className="text-2xl font-bold text-text-primary mb-0.5">
                      {card.value}
                    </div>
                    <div className="text-xs text-text-muted font-medium">
                      {card.label}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
      </div>

      {/* Quick links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="/admin/users">
            <Card
              variant="glass"
              className="p-5 hover:border-violet-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-violet-400" />
                <span className="text-sm font-medium text-text-primary">Manage Users</span>
              </div>
            </Card>
          </a>
          <a href="/admin/analytics">
            <Card
              variant="glass"
              className="p-5 hover:border-violet-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-accent-light" />
                <span className="text-sm font-medium text-text-primary">View Analytics</span>
              </div>
            </Card>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
