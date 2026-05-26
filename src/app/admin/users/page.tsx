"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import type { User } from "@/db/schema";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = async (pageNum: number = 1, searchQuery: string = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: "10",
        ...(searchQuery && { search: searchQuery }),
      });
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUsers(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, search);
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchUsers(1, search);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">User Management</h1>
        <p className="text-text-secondary mt-1">Quản lý tất cả người dùng</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by name or email..."
            className="w-full h-10 pl-9 pr-4 rounded-lg bg-surface/50 border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50"
          />
        </div>
        <Button variant="secondary" onClick={handleSearch}>Search</Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card variant="elevated" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3">User</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Email</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3 hidden md:table-cell">Joined</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                          <Skeleton className="h-4 w-28" />
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell"><Skeleton className="h-4 w-36" /></td>
                      <td className="px-5 py-3.5"><Skeleton className="h-5 w-12 rounded-full" /></td>
                      <td className="px-5 py-3.5 hidden md:table-cell"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-5 py-3.5"><Skeleton className="h-7 w-7 rounded-lg" /></td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-text-muted">No users found</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-border/50 hover:bg-elevated/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar src={user.image} fallback={user.name} size="sm" />
                          <span className="font-medium text-text-primary whitespace-nowrap">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-text-secondary hidden sm:table-cell">{user.email}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={user.role === "ADMIN" ? "admin" : "default"}>{user.role}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-text-muted whitespace-nowrap hidden md:table-cell">{formatDate(user.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={deletingId === user.id}
                          className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                        >
                          {deletingId === user.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-border">
              <p className="text-xs text-text-muted">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="icon-sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
