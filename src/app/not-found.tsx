"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-text-primary mb-4">404</h1>
      <p className="text-lg text-text-secondary mb-8">
        Trang bạn đang tìm không tồn tại.
      </p>
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button>
            <Home className="h-4 w-4" />
            Về trang chủ
          </Button>
        </Link>
        <Button variant="secondary" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
      </div>
    </div>
  );
}
