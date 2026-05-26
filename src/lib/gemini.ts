import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const RoadmapSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(""),
  duration: z.string().default(""),
  months: z.array(
    z.object({
      month: z.number(),
      title: z.string(),
      description: z.string().default(""),
      skills: z.array(z.string()),
      tasks: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string().optional(),
        })
      ),
      projects: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
          skills: z.array(z.string()),
        })
      ),
    })
  ),
  projects: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
      skills: z.array(z.string()),
    })
  ),
  goals: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
    })
  ),
});

export type GeneratedRoadmap = z.infer<typeof RoadmapSchema>;

function generateTaskId(title: string, index: number): string {
  return `${title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")}-${index}`;
}

function generateProjectId(title: string, index: number): string {
  return `project-${title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")}-${index}`;
}

export async function generateRoadmapWithGemini(
  goal: string
): Promise<GeneratedRoadmap> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Bạn là chuyên gia giáo dục và career mentor với 15 năm kinh nghiệm.

Hãy tạo roadmap học chi tiết cho mục tiêu: "${goal}"

Yêu cầu:
- Chia theo tháng (2-6 tháng tùy mục tiêu)
- Mỗi tháng có: tiêu đề, mô tả, danh sách kỹ năng cần học, bài tọa thực hành, dự án nhỏ
- Các dự án tổng kết cuối khóa (2-4 dự án lớn)
- Mục tiêu rõ ràng có thể đo lường được
- Phù hợp với beginner (người mới bắt đầu)
- Timeline thực tế

TRẢ VỀ JSON HỢP LỆ theo format sau, không giải thích gì thêm, không markdown code block, chỉ trả về JSON thuần:

{
  "title": "Tên roadmap (dưới 80 ký tự)",
  "description": "Mô tả ngắn về roadmap này (dưới 200 ký tự)",
  "duration": "VD: 3 tháng",
  "months": [
    {
      "month": 1,
      "title": "Tên tháng (VD: Tháng 1 - Nền tảng)",
      "description": "Mô tả những gì học viên sẽ làm trong tháng này",
      "skills": ["Kỹ năng 1", "Kỹ năng 2"],
      "tasks": [
        { "id": "task-1", "title": "Tên bài tập", "description": "Chi tiết bài tập" }
      ],
      "projects": [
        {
          "id": "project-1",
          "title": "Tên dự án",
          "description": "Mô tả dự án",
          "difficulty": "Beginner",
          "skills": ["Kỹ năng áp dụng"]
        }
      ]
    }
  ],
  "projects": [
    {
      "id": "final-project-1",
      "title": "Dự án cuối khóa 1",
      "description": "Mô tả dự án",
      "difficulty": "Intermediate",
      "skills": ["Tất cả kỹ năng đã học"]
    }
  ],
  "goals": [
    {
      "id": "goal-1",
      "title": "Mục tiêu 1",
      "description": "Mô tả mục tiêu"
    }
  ]
}

QUAN TRỌNG: Trả về CHÍNH XÁC JSON như format trên, không có gì khác.`;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text().trim();

      // Try to extract JSON from response (handle potential markdown code blocks)
      let jsonStr = text;
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }

      // Try to find JSON object in text
      const firstBrace = jsonStr.indexOf("{");
      const lastBrace = jsonStr.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
      }

      const parsed = JSON.parse(jsonStr);
      const validated = RoadmapSchema.parse(parsed);

      // Normalize IDs for all tasks and projects
      const normalizedMonths = validated.months.map((month, mIdx) => ({
        ...month,
        month: mIdx + 1,
        tasks: month.tasks.map((task, tIdx) => ({
          ...task,
          id: task.id || generateTaskId(task.title, tIdx),
        })),
        projects: month.projects.map((proj, pIdx) => ({
          ...proj,
          id: proj.id || generateProjectId(proj.title, pIdx),
        })),
      }));

      const normalizedProjects = validated.projects.map((proj, idx) => ({
        ...proj,
        id: proj.id || generateProjectId(proj.title, idx),
      }));

      const normalizedGoals = validated.goals.map((goal, idx) => ({
        ...goal,
        id: goal.id || `goal-${idx + 1}`,
      }));

      return {
        ...validated,
        months: normalizedMonths,
        projects: normalizedProjects,
        goals: normalizedGoals,
      };
    } catch (error) {
      lastError = error as Error;
      // Wait before retrying with exponential backoff
      if (attempt < 2) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }

  throw (
    lastError ||
    new Error("Failed to generate roadmap after 3 attempts")
  );
}
