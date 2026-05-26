import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/db";
import { roadmaps } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const database = db();

    const [roadmapList, countResult] = await Promise.all([
      database
        .select()
        .from(roadmaps)
        .where(eq(roadmaps.userId, authUser.id))
        .orderBy(desc(roadmaps.createdAt))
        .limit(limit)
        .offset(offset)
        .all(),
      database
        .select({ count: roadmaps.id })
        .from(roadmaps)
        .where(eq(roadmaps.userId, authUser.id))
        .all(),
    ]);

    const total = countResult.length;

    return NextResponse.json({
      data: roadmapList,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get roadmaps error:", error);
    return NextResponse.json({ error: "Failed to fetch roadmaps" }, { status: 500 });
  }
}
