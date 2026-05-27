import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/db";
import { roadmaps } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    await getAuthUser();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const results = await db
      .select()
      .from(roadmaps)
      .orderBy(desc(roadmaps.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ roadmaps: results });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Bạn cần đăng nhập." }, { status: 401 });
    }
    console.error("Get roadmaps error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi khi lấy lộ trình." }, { status: 500 });
  }
}
