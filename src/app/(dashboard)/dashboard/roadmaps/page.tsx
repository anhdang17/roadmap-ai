"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, BookOpen, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  createdAt: string;
}

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const res = await fetch("/api/roadmaps");
      if (res.ok) {
        const data = await res.json();
        setRoadmaps(data.roadmaps || []);
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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Lộ trình của tôi</h1>
          <p className="text-sm text-text-muted">
            Tất cả roadmap bạn đã tạo và đang theo dõi.
          </p>
        </div>
        <Link href="/generate">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Tạo mới
          </Button>
        </Link>
      </motion.div>

      {roadmaps.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card variant="elevated" className="p-10 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-2xl bg-accent/10">
                <BookOpen className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  Chưa có lộ trình nào
                </h3>
                <p className="text-sm text-text-muted mb-4">
                  Tạo roadmap đầu tiên để bắt đầu hành trình học tập.
                </p>
              </div>
              <Link href="/generate">
                <Button>
                  <Plus className="h-4 w-4" />
                  Tạo roadmap đầu tiên
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmaps.map((roadmap, i) => (
            <motion.div
              key={roadmap.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={`/roadmap/${roadmap.id}`}>
                <Card
                  variant="elevated"
                  className="p-5 hover:border-accent/30 transition-all cursor-pointer group h-full"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                      {roadmap.category}
                    </span>
                    <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-accent transition-colors shrink-0" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-1 group-hover:text-accent transition-colors">
                    {roadmap.title}
                  </h3>
                  <p className="text-xs text-text-muted mb-4 line-clamp-2">
                    {roadmap.description}
                  </p>
                  <div className="space-y-1.5 mt-auto">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted">Tiến độ</span>
                      <span className="text-text-secondary font-medium">{roadmap.progress}%</span>
                    </div>
                    <Progress value={roadmap.progress} size="sm" />
                  </div>
                  <p className="text-xs text-text-muted mt-3">
                    Tạo ngày {new Date(roadmap.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
