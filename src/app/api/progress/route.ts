import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/db";
import { progress } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  try {
    const user = await getAuthUser();

    const [userProgress] = await db
      .select()
      .from(progress)
      .where(eq(progress.userId, user.id))
      .limit(1);

    return NextResponse.json({
      progress: userProgress || { completedTasks: [], streak: 0 },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Bạn cần đăng nhập." }, { status: 401 });
    }
    console.error("Get progress error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi khi lấy tiến độ." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    const { action, roadmapId, taskId, taskTitle, roadmapTitle } = await req.json();

    if (!roadmapId || !taskId) {
      return NextResponse.json({ error: "Thiếu thông tin bài tập." }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(progress)
      .where(eq(progress.userId, user.id))
      .limit(1);

    let completedTasks = existing?.completedTasks || [];

    if (action === "add") {
      if (!completedTasks.find((t: { taskId: string }) => t.taskId === taskId && t.roadmapId === roadmapId)) {
        completedTasks.push({
          taskId,
          taskTitle: taskTitle || taskId,
          roadmapId,
          roadmapTitle: roadmapTitle || "",
          completedAt: new Date().toISOString(),
        });
      }
    } else if (action === "remove") {
      completedTasks = completedTasks.filter(
        (t: { taskId: string; roadmapId: string }) =>
          !(t.taskId === taskId && t.roadmapId === roadmapId)
      );
    } else {
      return NextResponse.json({ error: "Hành động không hợp lệ." }, { status: 400 });
    }

    const today = new Date().toISOString().split("T")[0];
    const streak = existing?.lastActiveDate === today
      ? existing.streak
      : (existing?.lastActiveDate
          ? new Date(today).getTime() - new Date(existing.lastActiveDate).getTime() <= 86400000
            ? existing.streak + 1
            : 1
          : 1);

    if (existing) {
      await db
        .update(progress)
        .set({ completedTasks, streak, lastActiveDate: today })
        .where(eq(progress.id, existing.id));
    } else {
      await db.insert(progress).values({
        userId: user.id,
        completedTasks,
        streak,
        lastActiveDate: today,
      });
    }

    return NextResponse.json({ success: true, completedTasks });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Bạn cần đăng nhập." }, { status: 401 });
    }
    console.error("Update progress error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi khi cập nhật tiến độ." }, { status: 500 });
  }
}
