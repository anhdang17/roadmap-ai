import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ─── Users ─────────────────────────────────────────────────────────────────────

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  clerkId: text("clerk_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  image: text("image").default(""),
  role: text("role", { enum: ["USER", "ADMIN"] })
    .notNull()
    .default("USER"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── Roadmaps ─────────────────────────────────────────────────────────────────

export const roadmaps = sqliteTable("roadmaps", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  goal: text("goal").notNull(),
  title: text("title").notNull(),
  description: text("description").default(""),
  duration: text("duration").default(""),
  content: text("content", { mode: "json" })
    .$type<{
      months: {
        month: number;
        title: string;
        description?: string;
        skills: string[];
        tasks: { id: string; title: string; description?: string }[];
        projects: {
          id: string;
          title: string;
          description?: string;
          difficulty: string;
          skills: string[];
        }[];
      }[];
      projects: {
        id: string;
        title: string;
        description?: string;
        difficulty: string;
        skills: string[];
      }[];
      goals: { id: string; title: string; description?: string }[];
    }>()
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── Progress ─────────────────────────────────────────────────────────────────

export const progress = sqliteTable("progress", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  roadmapId: text("roadmap_id")
    .notNull()
    .references(() => roadmaps.id, { onDelete: "cascade" }),
  completedTasks: text("completed_tasks", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Roadmap = typeof roadmaps.$inferSelect;
export type NewRoadmap = typeof roadmaps.$inferInsert;
export type Progress = typeof progress.$inferSelect;
export type NewProgress = typeof progress.$inferInsert;
