"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.fullName || user?.firstName) {
      setName(user.fullName || user.firstName || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error();
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">Quản lý thông tin cá nhân</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card variant="elevated" className="p-6">
          <h2 className="text-base font-semibold text-text-primary mb-4">Profile Information</h2>

          {!isLoaded ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-elevated animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-elevated rounded animate-pulse" />
                  <div className="h-3 w-48 bg-elevated rounded animate-pulse" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar
                  src={user?.imageUrl}
                  fallback={user?.fullName || user?.firstName || "U"}
                  size="xl"
                />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {user?.fullName || user?.firstName}
                  </p>
                  <p className="text-xs text-text-muted">
                    {user?.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Role
                </label>
                <div>
                  <Badge variant={user?.publicMetadata?.role === "ADMIN" ? "admin" : "default"}>
                    {user?.publicMetadata?.role === "ADMIN" ? "Admin" : "User"}
                  </Badge>
                </div>
              </div>

              <Separator />

              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
