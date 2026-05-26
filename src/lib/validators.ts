import { z } from "zod";

export const GenerateRoadmapSchema = z.object({
  goal: z
    .string()
    .min(5, "Mục tiêu phải có ít nhất 5 ký tự")
    .max(200, "Mục tiêu không được quá 200 ký tự"),
});

export const UpdateProgressSchema = z.object({
  roadmapId: z.string().min(1, "Roadmap ID is required"),
  taskId: z.string().min(1, "Task ID is required"),
  completed: z.boolean(),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

export type GenerateRoadmapInput = z.infer<typeof GenerateRoadmapSchema>;
export type UpdateProgressInput = z.infer<typeof UpdateProgressSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
