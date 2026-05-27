"use client";

import { motion } from "framer-motion";
import { Search, Wand2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Nhập mục tiêu học tập",
    description:
      "Cho chúng tôi biết bạn muốn học gì — frontend, tiếng Anh, kế toán, hay bất kỳ kỹ năng nào.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    number: "02",
    icon: Wand2,
    title: "AI tạo lộ trình cá nhân",
    description:
      "Gemini AI phân tích mục tiêu và tạo roadmap chi tiết với timeline, bài tập và dự án thực hành.",
    color: "text-accent-light",
    bg: "bg-accent/10 border-accent/20",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Theo dõi & hoàn thành",
    description:
      "Đánh dấu bài tập đã hoàn thành, xem tiến độ, duy trì streak học tập và đạt mục tiêu.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <span className="text-accent-light text-sm font-medium">Cách hoạt động</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
            3 bước đơn giản để{" "}
            <span className="text-gradient">bắt đầu</span>
          </h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-xl mx-auto">
            Không phức tạp. Chỉ cần nhập mục tiêu, AI sẽ lo phần còn lại.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute top-16 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-gradient-to-r from-violet-500/30 via-accent/30 to-emerald-500/30" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.15,
                    ease: "easeOut",
                  }}
                  className="relative"
                >
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={cn(
                        "relative z-10 flex items-center justify-center w-14 h-14 rounded-2xl border mb-6",
                        step.bg
                      )}
                    >
                      <Icon className={cn("h-6 w-6", step.color)} />
                    </div>

                    <div className="mb-2">
                      <span className="text-5xl font-black text-elevated leading-none select-none">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-text-primary mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
