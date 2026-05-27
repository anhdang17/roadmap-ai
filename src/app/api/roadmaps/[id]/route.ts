import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/db";
import { roadmaps } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await getAuthUser();

    const [roadmap] = await db
      .select()
      .from(roadmaps)
      .where(eq(roadmaps.id, params.id))
      .limit(1);

    if (!roadmap) {
      return NextResponse.json({ error: "Không tìm thấy lộ trình." }, { status: 404 });
    }

    return NextResponse.json({ roadmap });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Bạn cần đăng nhập." }, { status: 401 });
    }
    console.error("Get roadmap error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi khi lấy lộ trình." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();

    const [existing] = await db
      .select()
      .from(roadmaps)
      .where(eq(roadmaps.id, params.id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Không tìm thấy lộ trình." }, { status: 404 });
    }

    if (existing.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Bạn không có quyền xóa lộ trình này." }, { status: 403 });
    }

    await db.delete(roadmaps).where(eq(roadmaps.id, params.id));

    return NextResponse.json({ message: "Đã xóa lộ trình thành công." });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Bạn cần đăng nhập." }, { status: 401 });
    }
    console.error("Delete roadmap error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi khi xóa lộ trình." }, { status: 500 });
  }
}
