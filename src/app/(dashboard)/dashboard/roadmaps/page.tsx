"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, BookOpen, ArrowRight, Trash2, Calendar, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import type { IRoadmap } from "@/types";

export default function RoadmapsPage() {
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<IRoadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await fetch("/api/roadmaps");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setRoadmaps(data.data || []);
      } catch {
        toast.error("Không thể tải roadmaps");
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Bạn có chắc muốn xóa roadmap này?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/roadmaps/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setRoadmaps((prev) => prev.filter((r) => r.id !== id));
      toast.success("Đã xóa roadmap");
    } catch {
      toast.error("Không thể xóa roadmap");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">My Roadmaps</h1>
          <p className="text-text-secondary mt-1">Tất cả roadmap bạn đã tạo</p>
        </div>
        <Button onClick={() => router.push("/")} className="shadow-lg shadow-accent/20">
          <Plus className="h-4 w-4" /> New Roadmap
        </Button>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} variant="elevated" className="p-5">
              <Skeleton className="h-5 w-32 mb-3" />
              <Skeleton className="h-4 w-48 mb-4" />
              <Skeleton className="h-2 w-full rounded-full mb-3" />
              <Skeleton className="h-3 w-28" />
            </Card>
          ))}
        </div>
      ) : roadmaps.length === 0 ? (
        <Card variant="elevated" className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 mb-4">
            <BookOpen className="h-7 w-7 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Chưa có roadmap nào</h3>
          <p className="text-sm text-text-secondary mb-6 max-w-xs mx-auto">
            Bắt đầu tạo roadmap đầu tiên để học theo lộ trình có hệ thống.
          </p>
          <Button onClick={() => router.push("/")}>
            <Plus className="h-4 w-4" /> Tạo roadmap đầu tiên
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmaps.map((roadmap, i) => (
            <motion.div
              key={roadmap.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link href={`/roadmap/${roadmap.id}`}>
                <Card
                  variant="elevated"
                  className="p-5 h-full hover:border-accent/30 transition-all group cursor-pointer relative"
                >
                  <button
                    onClick={(e) => handleDelete(roadmap.id, e)}
                    disabled={deletingId === roadmap.id}
                    className="absolute top-3 right-3 p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    {deletingId === roadmap.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-3">
                    <BookOpen className="h-5 w-5 text-accent" />
                  </div>

                  <h3 className="text-sm font-semibold text-text-primary mb-1 pr-6 group-hover:text-accent transition-colors line-clamp-2">
                    {roadmap.title}
                  </h3>
                  <p className="text-xs text-text-muted mb-3 line-clamp-1">{roadmap.goal}</p>

                  <div className="flex items-center gap-1.5 text-xs text-text-muted mb-3">
                    <Calendar className="h-3 w-3" />
                    <span>{roadmap.content?.months?.length || 0} tháng</span>
                    {roadmap.duration && (
                      <>
                        <span>·</span>
                        <span>{roadmap.duration}</span>
                      </>
                    )}
                  </div>

                  <div className="mb-3">
                    <Progress value={0} size="sm" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">{formatDate(roadmap.createdAt)}</span>
                    <div className="flex items-center gap-1 text-xs text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Continue <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
