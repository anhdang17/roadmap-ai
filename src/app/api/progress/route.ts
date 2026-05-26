import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/db";
import { progress, roadmaps } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { UpdateProgressSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    const { searchParams } = new URL(req.url);
    const roadmapId = searchParams.get("roadmapId");

    const database = db();

    if (roadmapId) {
      const record = await database
        .select()
        .from(progress)
        .where(
          and(
            eq(progress.userId, authUser.id),
            eq(progress.roadmapId, roadmapId)
          )
        )
        .get();

      return NextResponse.json({ data: record || null });
    }

    const allProgress = await database
      .select()
      .from(progress)
      .where(eq(progress.userId, authUser.id))
      .all();

    const progressWithRoadmap = await Promise.all(
      allProgress.map(async (p) => {
        const roadmap = await database
          .select()
          .from(roadmaps)
          .where(eq(roadmaps.id, p.roadmapId))
          .get();

        const allTaskIds =
          roadmap?.content?.months?.flatMap((m) => m.tasks.map((t) => t.id)) || [];
        const completedCount = p.completedTasks?.length || 0;
        const totalCount = allTaskIds.length;
        const completionPercent =
          totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return {
          ...p,
          roadmap: roadmap || null,
          completionPercent,
        };
      })
    );

    return NextResponse.json({ data: progressWithRoadmap });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get progress error:", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    const body = await req.json();
    const parsed = UpdateProgressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { roadmapId, taskId, completed } = parsed.data;
    const database = db();

    const roadmap = await database
      .select()
      .from(roadmaps)
      .where(eq(roadmaps.id, roadmapId))
      .get();

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }
    if (roadmap.userId !== authUser.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existing = await database
      .select()
      .from(progress)
      .where(
        and(
          eq(progress.userId, authUser.id),
          eq(progress.roadmapId, roadmapId)
        )
      )
      .get();

    let updated;
    if (existing) {
      const currentTasks = existing.completedTasks || [];
      const newTasks = completed
        ? [...new Set([...currentTasks, taskId])]
        : currentTasks.filter((t) => t !== taskId);

      updated = await database
        .update(progress)
        .set({ completedTasks: newTasks, updatedAt: new Date() })
        .where(eq(progress.id, existing.id))
        .returning()
        .get();
    } else {
      updated = await database
        .insert(progress)
        .values({
          userId: authUser.id,
          roadmapId,
          completedTasks: completed ? [taskId] : [],
        })
        .returning()
        .get();
    }

    return NextResponse.json({
      data: updated,
      message: completed ? "Task completed" : "Task unchecked",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update progress error:", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
