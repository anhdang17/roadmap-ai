import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/db";
import { roadmaps } from "@/db/schema";
import { generateRoadmapWithGemini } from "@/lib/gemini";
import { GenerateRoadmapSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser();

    const body = await req.json();
    const parsed = GenerateRoadmapSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { goal } = parsed.data;

    const generated = await generateRoadmapWithGemini(goal);
    const database = db();

    const newRoadmap = await database
      .insert(roadmaps)
      .values({
        userId: authUser.id,
        goal,
        title: generated.title,
        description: generated.description,
        duration: generated.duration,
        content: {
          months: generated.months,
          projects: generated.projects,
          goals: generated.goals,
        },
      })
      .returning()
      .get();

    return NextResponse.json(
      { data: newRoadmap, message: "Roadmap generated successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Generate roadmap error:", error);
    return NextResponse.json(
      { error: "Failed to generate roadmap. Please try again." },
      { status: 500 }
    );
  }
}
