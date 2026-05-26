import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { UserRole } from "@/types";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export type AuthUser = {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  image: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const database = db();

  const existing = await database
    .select()
    .from(users)
    .where(eq(users.clerkId, userId))
    .get();

  if (existing) {
    return {
      id: existing.id,
      clerkId: existing.clerkId,
      name: existing.name,
      email: existing.email,
      image: existing.image || "",
      role: existing.role as UserRole,
      createdAt: new Date(existing.createdAt),
      updatedAt: new Date(existing.updatedAt),
    };
  }

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress || "";
  const isAdmin =
    ADMIN_EMAILS.includes(email.toLowerCase()) ||
    clerkUser.publicMetadata?.role === "ADMIN";

  const now = new Date();

  const newUser = await database
    .insert(users)
    .values({
      clerkId: userId,
      name:
        clerkUser.fullName ||
        clerkUser.firstName ||
        clerkUser.username ||
        "User",
      email,
      image: clerkUser.imageUrl || "",
      role: isAdmin ? "ADMIN" : "USER",
      createdAt: now,
      updatedAt: now,
    })
    .returning()
    .get();

  return {
    id: newUser.id,
    clerkId: newUser.clerkId,
    name: newUser.name,
    email: newUser.email,
    image: newUser.image || "",
    role: newUser.role as UserRole,
    createdAt: new Date(newUser.createdAt),
    updatedAt: new Date(newUser.updatedAt),
  };
}

export async function getAuthUser(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
