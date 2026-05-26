"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function GenerateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const goal = searchParams.get("goal") || "";
  const [status, setStatus] = useState<"idle" | "generating" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    setStatus("generating");
    setError("");

    try {
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goal.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate roadmap");
      }

      setStatus("success");
      setTimeout(() => {
        router.push(`/roadmap/${data.data._id}`);
      }, 1500);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <main className="min-h-screen pt-16 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl">
        {status === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 mb-6">
              <Sparkles className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
              Tạo Roadmap cho bạn
            </h1>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              AI đang sẵn sàng tạo lộ trình học cá nhân hóa cho mục tiêu của bạn.
            </p>

            {goal && (
              <Card variant="elevated" className="p-4 mb-6 text-left">
                <p className="text-xs text-text-muted mb-1">Mục tiêu của bạn</p>
                <p className="text-text-primary font-medium">&ldquo;{goal}&rdquo;</p>
              </Card>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={!goal.trim()}
                className="shadow-lg shadow-accent/20"
              >
                <Sparkles className="h-4 w-4" />
                Bắt đầu tạo roadmap
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Link href="/dashboard">
                <Button variant="secondary" size="lg">
                  Hủy
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {status === "generating" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 mb-6">
              <Loader2 className="h-8 w-8 text-accent animate-spin" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
              AI đang tạo roadmap...
            </h1>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              Gemini AI đang phân tích mục tiêu và thiết kế lộ trình học tập tối ưu cho bạn.
              Thường mất khoảng 5-15 giây.
            </p>

            {/* Loading steps */}
            <div className="space-y-3 max-w-sm mx-auto text-left">
              {[
                "Phân tích mục tiêu học tập...",
                "Nghiên cứu kỹ năng cần thiết...",
                "Thiết kế timeline và dự án...",
                "Hoàn tất roadmap cá nhân hóa...",
              ].map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.5 }}
                  className="flex items-center gap-3 text-sm text-text-secondary"
                >
                  <Loader2 className="h-3.5 w-3.5 text-accent animate-spin shrink-0" />
                  {step}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
              Roadmap đã sẵn sàng!
            </h1>
            <p className="text-text-secondary">
              Đang chuyển đến roadmap của bạn...
            </p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
              <Sparkles className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
              Đã xảy ra lỗi
            </h1>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              {error || "Không thể tạo roadmap. Vui lòng thử lại."}
            </p>
            <Button
              size="lg"
              onClick={() => setStatus("idle")}
              variant="secondary"
            >
              Thử lại
            </Button>
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center pt-16">
          <Loader2 className="h-8 w-8 text-accent animate-spin" />
        </main>
      }
    >
      <GenerateContent />
    </Suspense>
  );
}
