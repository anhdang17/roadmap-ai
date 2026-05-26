import { type Metadata } from "next";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-md mx-auto">
        {/* 404 */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20 mb-6">
          <Sparkles className="h-10 w-10 text-accent" />
        </div>

        <h1 className="text-5xl font-black text-text-primary mb-3">404</h1>
        <p className="text-xl font-semibold text-text-primary mb-3">
          Page not found
        </p>
        <p className="text-text-secondary mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
