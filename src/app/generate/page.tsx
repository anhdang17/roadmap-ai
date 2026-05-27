"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Loader2,
  Sparkles,
  Zap,
  ArrowRight,
  Clock,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Science",
  "Machine Learning",
  "Mobile Developer",
  "DevOps",
  "Cloud Computing",
  "Cybersecurity",
  "UI/UX Design",
  "Product Management",
  "Marketing",
  "Kế toán",
  "Tiếng Anh",
  "Khác",
];

function GenerateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn } = useAuth();

  const [goal, setGoal] = useState(searchParams.get("goal") || "");
  const [category, setCategory] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const g = searchParams.get("goal");
    if (g) setGoal(g);
  }, [searchParams]);

  const handleGenerate = async () => {
    if (!goal.trim() || !category) {
      setError("Vui lòng nhập mục tiêu và chọn danh mục.");
      return;
    }

    setGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goal.trim(), category }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Đã xảy ra lỗi. Vui lòng thử lại.");
        return;
      }

      router.push(`/roadmap/${data.roadmap.id}`);
    } catch {
      setError("Đã xảy ra lỗi mạng. Vui lòng thử lại.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-accent-light text-sm font-medium">Được hỗ trợ bởi Gemini AI</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Tạo lộ trình học tập
          </h1>
          <p className="text-text-secondary text-base">
            Mô tả mục tiêu học tập và AI sẽ tạo lộ trình cá nhân cho bạn.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card variant="elevated" className="p-6 sm:p-8">
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">
                  Mục tiêu học tập *
                </label>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Ví dụ: Tôi muốn học Frontend Developer trong 3 tháng..."
                  rows={4}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 resize-none transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">
                  Danh mục *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCategories(!showCategories)}
                    className="w-full flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-sm text-left transition-all hover:border-accent/30 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    <span className={category ? "text-text-primary" : "text-text-muted"}>
                      {category || "Chọn danh mục"}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-text-muted transition-transform ${showCategories ? "rotate-180" : ""}`} />
                  </button>

                  {showCategories && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-surface shadow-xl max-h-60 overflow-y-auto">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setCategory(cat);
                            setShowCategories(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-elevated transition-colors ${
                            category === cat ? "text-accent bg-accent/5" : "text-text-primary"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <p className="text-sm text-error bg-error/10 border border-error/20 rounded-lg px-4 py-3">
                  {error}
                </p>
              )}

              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={generating || !goal.trim() || !category}
                className="w-full"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Đang tạo lộ trình...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Tạo lộ trình với AI
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-1 text-xs text-text-muted">
                <Clock className="h-3 w-3" />
                Thường mất khoảng 10-30 giây để tạo
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      }
    >
      <GenerateForm />
    </Suspense>
  );
}
