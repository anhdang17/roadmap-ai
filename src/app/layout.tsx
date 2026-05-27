import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GoalPlan AI - Lộ trình học tập cá nhân hóa bằng AI",
  description:
    "Tạo lộ trình học tập cá nhân hóa với AI. Theo dõi tiến độ, hoàn thành bài tập, xây dựng dự án thực tế.",
  keywords: ["AI roadmap", "học tập", "lộ trình học", "Gemini AI", "cá nhân hóa"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="vi">
        <body className="antialiased">
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
