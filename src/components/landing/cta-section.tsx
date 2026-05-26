"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleStart = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      router.push("/sign-up");
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-accent-light text-sm font-medium">100% Free</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">
            Sẵn sàng bắt đầu
            <br />
            <span className="text-gradient">hành trình học tập?</span>
          </h2>

          <p className="text-text-secondary text-base sm:text-lg max-w-xl mx-auto mb-10">
            Tạo roadmap cá nhân hóa đầu tiên của bạn trong 30 giây. Miễn phí,
            không cần credit card.
          </p>

          <Button
            size="xl"
            onClick={handleStart}
            className="shadow-xl shadow-accent/20 group"
          >
            {isSignedIn ? "Go to Dashboard" : "Start for Free"}
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="mt-4 text-sm text-text-muted">
            {isSignedIn
              ? "Quay lại dashboard để tiếp tục học tập"
              : "Đăng ký miễn phí · Không giới hạn roadmap"}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
