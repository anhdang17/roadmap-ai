"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

const PIE_COLORS = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#7c3aed", "#6d28d9", "#5b21b6"];

export default function AdminAnalyticsPage() {
  const [roadmapData, setRoadmapData] = useState<{ category: string; count: number }[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<{ month: string; users: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error();
        const data = await res.json();

        // Roadmap categories
        const roadmaps = data.roadmapsByCategory || [];
        setRoadmapData(
          roadmaps.map((r: { _id: string; count: number }) => ({
            category: r._id || "Other",
            count: r.count || 0,
          }))
        );

        // User growth (mock last 6 months)
        const users = data.totalUsers || 0;
        const growth = data.userGrowth || [];
        setUserGrowthData(
          growth.length > 0
            ? growth
            : [
                { month: "Jan", users: Math.round(users * 0.2) },
                { month: "Feb", users: Math.round(users * 0.35) },
                { month: "Mar", users: Math.round(users * 0.5) },
                { month: "Apr", users: Math.round(users * 0.65) },
                { month: "May", users: Math.round(users * 0.8) },
                { month: "Jun", users: users },
              ]
        );
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
          Analytics
        </h1>
        <p className="text-text-secondary mt-1">
          Thống kê và insights hệ thống
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} variant="elevated" className="p-6">
              <Skeleton className="h-5 w-40 mb-4" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="elevated" className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-accent" />
                <h2 className="text-base font-semibold text-text-primary">
                  User Growth
                </h2>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userGrowthData}>
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#71717a", fontSize: 12 }}
                      axisLine={{ stroke: "#3f3f46" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#71717a", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#27272a",
                        border: "1px solid #3f3f46",
                        borderRadius: "8px",
                        color: "#fafafa",
                      }}
                    />
                    <Bar
                      dataKey="users"
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                      opacity={0.9}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Roadmap Categories Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="elevated" className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-violet-400" />
                <h2 className="text-base font-semibold text-text-primary">
                  Roadmap Categories
                </h2>
              </div>
              {roadmapData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roadmapData}
                        dataKey="count"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={50}
                        paddingAngle={2}
                      >
                        {roadmapData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "#27272a",
                          border: "1px solid #3f3f46",
                          borderRadius: "8px",
                          color: "#fafafa",
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "12px", color: "#a1a1aa" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-text-muted text-sm">
                  No roadmap data available yet
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
