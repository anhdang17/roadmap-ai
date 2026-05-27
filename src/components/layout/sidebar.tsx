"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Zap,
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/roadmaps", label: "Lộ trình của tôi", icon: BookOpen },
  { href: "/dashboard/progress", label: "Tiến độ", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Cài đặt", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.publicMetadata?.role === "ADMIN";

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-surface border border-border text-text-primary hover:bg-elevated transition-colors"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Mở sidebar"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-surface border-r border-border flex flex-col",
          !mobileOpen && "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent/10 border border-accent/20">
              <Zap className="h-4 w-4 text-accent" />
            </div>
            <div>
              <span className="font-bold text-text-primary text-base">GoalPlan</span>
              <span className="text-accent font-bold"> AI</span>
            </div>
          </Link>
        </div>

        {isLoaded && user && (
          <div className="px-4 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar
                src={user.imageUrl}
                fallback={user.fullName || user.firstName || "U"}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user.fullName || user.firstName}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {user.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-text-secondary hover:text-text-primary hover:bg-elevated"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-accent" : "text-text-muted group-hover:text-text-primary")} />
                <span className="flex-1">{link.label}</span>
                {isActive && <ChevronRight className="h-3 w-3 text-accent" />}
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <div className="pt-3 pb-1">
                <div className="h-px bg-border mx-2" />
                <p className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Quản trị
                </p>
              </div>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                  pathname.startsWith("/admin")
                    ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                    : "text-text-secondary hover:text-text-primary hover:bg-elevated"
                )}
              >
                <Shield className="h-4 w-4 shrink-0 text-text-muted group-hover:text-text-primary" />
                <span className="flex-1">Bảng quản trị</span>
              </Link>
            </>
          )}
        </nav>

        <div className="px-3 pb-4">
          <SignOutButton signOutOptions={{ redirectUrl: "/" }}>
            <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-error hover:bg-error/10 transition-all duration-200">
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Đăng xuất</span>
            </button>
          </SignOutButton>
        </div>
      </motion.aside>

      <div className="hidden lg:block lg:w-64 shrink-0" />
    </>
  );
}
