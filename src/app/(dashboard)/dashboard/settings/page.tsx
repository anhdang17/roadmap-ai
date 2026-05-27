"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { User, Save, Loader2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!user || !name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (res.ok) {
        await user.update({ firstName: name.trim() });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-text-primary mb-1">Cài đặt</h1>
        <p className="text-sm text-text-muted">
          Quản lý thông tin tài khoản của bạn.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card variant="elevated" className="p-6 max-w-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-accent/10">
              <User className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Thông tin cá nhân</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">
                Họ và tên
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={user?.fullName || user?.firstName || ""}
                className="max-w-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">
                Email
              </label>
              <Input
                value={user?.emailAddresses[0]?.emailAddress || ""}
                disabled
                className="max-w-md opacity-60 cursor-not-allowed"
              />
              <p className="text-xs text-text-muted mt-1">Email không thể thay đổi.</p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">
                Vai trò
              </label>
              <Input
                value={user?.publicMetadata?.role === "ADMIN" ? "Quản trị viên" : "Người dùng"}
                disabled
                className="max-w-md opacity-60 cursor-not-allowed"
              />
            </div>

            <div className="pt-2">
              <Button onClick={handleSave} disabled={saving || !name.trim()}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : saved ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? "Đang lưu..." : saved ? "Đã lưu!" : "Lưu thay đổi"}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
