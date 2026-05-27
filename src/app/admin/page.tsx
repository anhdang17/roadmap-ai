"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  TrendingUp,
  Users,
  BookOpen,
  BarChart3,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Stats {
  totalUsers: number;
  totalRoadmaps: number;
  totalCompletions: number;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalRoadmaps: 0,
    totalCompletions: 0,
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || { totalUsers: 0, totalRoadmaps: 0, totalCompletions: 0 });
        setRecentUsers(data.recentUsers || []);
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
        <h1 className="text-2xl font-bold text-text-primary mb-1">Bảng quản trị</h1>
        <p className="text-sm text-text-muted">
          Quản lý người dùng và xem thống kê hệ thống.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Tổng người dùng",
            value: stats.totalUsers,
            icon: Users,
            color: "text-violet-400",
            bg: "bg-violet-500/10",
          },
          {
            label: "Tổng Roadmap",
            value: stats.totalRoadmaps,
            icon: BookOpen,
            color: "text-accent-light",
            bg: "bg-accent/10",
          },
          {
            label: "Tổng hoàn thành",
            value: stats.totalCompletions,
            icon: TrendingUp,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-text-primary mb-4">Người dùng gần đây</h2>
        {recentUsers.length === 0 ? (
          <Card variant="elevated" className="p-6 text-center">
            <Users className="h-8 w-8 text-text-muted mx-auto mb-2" />
            <p className="text-sm text-text-muted">Chưa có người dùng nào.</p>
          </Card>
        ) : (
          <Card variant="elevated" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Tên</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Vai trò</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Ngày tham gia</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user, index) => (
                    <tr key={user.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 text-sm text-text-primary font-medium">{user.name || "—"}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{user.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "ADMIN"
                            ? "bg-violet-500/10 text-violet-400"
                            : "bg-elevated text-text-secondary"
                        }`}>
                          {user.role === "ADMIN" ? "Quản trị" : "Người dùng"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(user.createdAt).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
