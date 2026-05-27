import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const user = await getAuthUser();
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, user.clerkId))
      .limit(1);

    return NextResponse.json({ user: dbUser });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Bạn cần đăng nhập." }, { status: 401 });
    }
    console.error("Get user error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi khi lấy thông tin người dùng." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser();
    const { name } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: "Tên không được để trống." }, { status: 400 });
    }

    const [updated] = await db
      .update(users)
      .set({ name: name.trim() })
      .where(eq(users.clerkId, user.clerkId))
      .returning();

    return NextResponse.json({ user: updated });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Bạn cần đăng nhập." }, { status: 401 });
    }
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi khi cập nhật thông tin." }, { status: 500 });
  }
}
