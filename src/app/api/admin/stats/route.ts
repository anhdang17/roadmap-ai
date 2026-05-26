import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/db";
import { users, roadmaps } from "@/db/schema";
import { count } from "drizzle-orm";

export async function GET() {
  try {
    const authUser = await getAuthUser();

    if (authUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const database = db();

    const [totalUsersResult, totalRoadmapsResult, recentRoadmaps] = await Promise.all([
      database.select({ count: count() }).from(users).get(),
      database.select({ count: count() }).from(roadmaps).get(),
      database.select().from(roadmaps).limit(100).all(),
    ]);

    const totalUsers = totalUsersResult?.count ?? 0;
    const totalRoadmaps = totalRoadmapsResult?.count ?? 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const aiRequestsToday = recentRoadmaps.filter(
      (r) => new Date(r.createdAt) >= today
    ).length;

    const categoryMap = new Map<string, number>();
    for (const r of recentRoadmaps) {
      const cat = (r.goal || "").slice(0, 20).toLowerCase();
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
    }
    const roadmapsByCategory = Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const userGrowth = monthNames.map((month, i) => ({
      month,
      users: Math.round((totalUsers * (i + 1)) / 6),
    }));

    return NextResponse.json({
      data: {
        totalUsers,
        totalRoadmaps,
        activeUsers: totalUsers,
        aiRequestsToday,
        roadmapsByCategory,
        userGrowth,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
