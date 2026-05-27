"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  const [goal, setGoal] = useState("");
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleGenerate = () => {
    if (!goal.trim()) return;
    if (isSignedIn) {
      router.push(`/generate?goal=${encodeURIComponent(goal.trim())}`);
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "-3s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "-1.5s" }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-100" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-sm">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-accent-light font-medium">Được hỗ trợ bởi Gemini AI</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-text-primary leading-tight tracking-tight mb-6"
        >
          Lộ trình học
          <br />
          <span className="text-gradient">cá nhân hóa</span>
          <br />
          bằng AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Nhập mục tiêu học tập và AI sẽ tạo lộ trình cá nhân cho bạn.
          <br className="hidden sm:block" />
          Theo dõi tiến độ, hoàn thành bài tập, xây dựng dự án thực tế.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="Ví dụ: Tôi muốn học Frontend Developer"
                className="h-12 text-base bg-surface/80 border-border/80 focus:border-accent/50 shadow-xl shadow-black/20"
              />
            </div>
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={!goal.trim()}
              className="h-12 px-6 text-base shadow-lg shadow-accent/20"
            >
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Tạo roadmap</span>
              <span className="sm:hidden">Tạo</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-3 text-xs text-text-muted">
            Miễn phí · Không cần thẻ tín dụng · Tạo roadmap trong 30 giây
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-xs text-text-muted">Ví dụ:</span>
          {[
            "Frontend Developer",
            "Data Analyst",
            "Tiếng Anh giao tiếp",
            "UX/UI Designer",
            "Kế toán",
          ].map((example) => (
            <button
              key={example}
              onClick={() => setGoal(example)}
              className="px-3 py-1 rounded-full text-xs bg-elevated border border-border text-text-secondary hover:text-text-primary hover:border-accent/30 transition-all cursor-pointer"
            >
              {example}
            </button>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted"
      >
        <span className="text-xs">Cuộn xuống</span>
        <div className="w-5 h-8 rounded-full border border-border flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-accent animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}
