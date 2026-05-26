import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/db";
import { users, roadmaps } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { UpdateUserSchema } from "@/lib/validators";

export async function GET() {
  try {
    const authUser = await getAuthUser();
    const database = db();

    const userRoadmaps = await database
      .select()
      .from(roadmaps)
      .where(eq(roadmaps.userId, authUser.id))
      .orderBy(desc(roadmaps.createdAt))
      .limit(5)
      .all();

    return NextResponse.json({
      data: {
        user: authUser,
        stats: {
          totalRoadmaps: userRoadmaps.length,
          totalTasksCompleted: 0,
          avgCompletion: 0,
          streakDays: 0,
        },
        recentRoadmaps: userRoadmaps,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get user error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    const body = await req.json();
    const parsed = UpdateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const database = db();

    const updated = await database
      .update(users)
      .set({ name: parsed.data.name, updatedAt: new Date() })
      .where(eq(users.id, authUser.id))
      .returning()
      .get();

    return NextResponse.json({
      data: updated,
      message: "User updated successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
