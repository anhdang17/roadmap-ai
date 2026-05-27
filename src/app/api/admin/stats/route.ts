import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/db";
import { users, roadmaps } from "@/db/schema";
import { sql, desc } from "drizzle-orm";

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (authUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Bạn không có quyền truy cập trang này." }, { status: 403 });
    }

    const [totalUsers] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    const [totalRoadmaps] = await db
      .select({ count: sql<number>`count(*)` })
      .from(roadmaps);

    const recentUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(10);

    const stats = {
      totalUsers: totalUsers?.count || 0,
      totalRoadmaps: totalRoadmaps?.count || 0,
      totalCompletions: 0,
    };

    return NextResponse.json({ stats, recentUsers });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Bạn cần đăng nhập." }, { status: 401 });
    }
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi khi lấy thống kê." }, { status: 500 });
  }
}
