import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (authUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Bạn không có quyền truy cập trang này." }, { status: 403 });
    }

    const allUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));

    return NextResponse.json({ users: allUsers });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Bạn cần đăng nhập." }, { status: 401 });
    }
    console.error("Admin users error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi." }, { status: 500 });
  }
}
