import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { generateRoadmap } from "@/lib/gemini";
import { db } from "@/db";
import { roadmaps } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    const { goal, category } = await req.json();

    if (!goal?.trim()) {
      return NextResponse.json({ error: "Vui lòng nhập mục tiêu học tập." }, { status: 400 });
    }

    if (!category?.trim()) {
      return NextResponse.json({ error: "Vui lòng chọn danh mục." }, { status: 400 });
    }

    const roadmapContent = await generateRoadmap(goal.trim(), category.trim());

    const [newRoadmap] = await db
      .insert(roadmaps)
      .values({
        userId: user.id,
        title: roadmapContent.title,
        description: roadmapContent.description,
        category: roadmapContent.category,
        content: roadmapContent,
        goal: goal.trim(),
        generatedBy: "gemini-2.0-flash",
      })
      .returning();

    return NextResponse.json({ roadmap: newRoadmap }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Bạn cần đăng nhập để thực hiện chức năng này." }, { status: 401 });
    }
    console.error("Generate roadmap error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi khi tạo lộ trình. Vui lòng thử lại." }, { status: 500 });
  }
}
