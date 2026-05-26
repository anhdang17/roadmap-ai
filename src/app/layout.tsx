export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GoalPlan AI — Your AI Learning Roadmap",
    template: "%s | GoalPlan AI",
  },
  description:
    "Nhập mục tiêu học tập và AI sẽ tạo lộ trình học cá nhân hóa cho bạn.",
  keywords: ["AI learning roadmap", "personalized learning", "learning platform"],
  authors: [{ name: "GoalPlan AI" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://goalplan.ai",
    siteName: "GoalPlan AI",
    title: "GoalPlan AI — Your AI Learning Roadmap",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoalPlan AI — Your AI Learning Roadmap",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="vi" className="dark">
        <body className={cn(inter.variable, jetbrainsMono.variable, "antialiased min-h-screen")}>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--bg-surface)",
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
