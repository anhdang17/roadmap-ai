"use client";

import { motion, type Variants } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Target,
  Layers,
  BarChart3,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI Roadmap Generation",
    description:
      "Nền tảng AI tiên tiến tạo lộ trình học cá nhân hóa dựa trên mục tiêu của bạn.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Theo dõi tiến độ học tập với biểu đồ trực quan và streak ngày học.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Target,
    title: "Personalized Learning",
    description:
      "Mỗi roadmap được thiết kế riêng cho bạn với timeline và mục tiêu rõ ràng.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Layers,
    title: "AI Exercises",
    description:
      "Bài tập thực hành được AI tạo phù hợp với từng giai đoạn học.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: BarChart3,
    title: "Smart Dashboard",
    description:
      "Tổng hợp thống kê học tập, streak, completion rate trong một giao diện.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    icon: Zap,
    title: "Real-world Projects",
    description:
      "Các dự án thực tế giúp bạn áp dụng kiến thức đã học vào thực tế.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <span className="text-accent-light text-sm font-medium">Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Tất cả bạn cần để{" "}
            <span className="text-gradient">học hiệu quả</span>
          </h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
            GoalPlan AI cung cấp mọi thứ bạn cần để biến mục tiêu học tập thành
            hiện thực một cách có hệ thống.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card variant="elevated" className="p-6 h-full group hover:border-accent/30 transition-all duration-300">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bg} mb-4`}
                  >
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
