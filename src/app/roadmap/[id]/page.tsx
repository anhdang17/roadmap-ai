"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Calendar,
  Target,
  Code2,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getDifficultyColor, formatDate } from "@/lib/utils";
import type { IRoadmap } from "@/types";

function RoadmapContent({ roadmap }: { roadmap: IRoadmap }) {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [expandedMonths, setExpandedMonths] = useState<Set<number>>(new Set([0]));
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch(`/api/progress?roadmapId=${roadmap.id}`);
        if (res.ok) {
          const data = await res.json();
          setCompletedTasks(data.data?.completedTasks || []);
        }
      } catch {
        // fail silently
      }
    };
    fetchProgress();
  }, [roadmap.id]);

  const toggleMonth = (month: number) => {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(month)) {
        next.delete(month);
      } else {
        next.add(month);
      }
      return next;
    });
  };

  const toggleTask = async (taskId: string, currentCompleted: boolean) => {
    setLoadingTasks(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roadmapId: roadmap.id,
          taskId,
          completed: !currentCompleted,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCompletedTasks(data.data?.completedTasks || []);
      toast.success(!currentCompleted ? "Task completed!" : "Task unchecked");
    } catch {
      toast.error("Failed to update task");
    } finally {
      setLoadingTasks(false);
    }
  };

  const allTaskIds = roadmap.content?.months?.flatMap((m) => m.tasks.map((t) => t.id)) || [];
  const completedCount = completedTasks.filter((id) => allTaskIds.includes(id)).length;
  const totalCount = allTaskIds.length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/roadmaps">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" /> Back to Roadmaps
          </Button>
        </Link>
        <Badge variant={completionPercent === 100 ? "success" : "default"}>{completionPercent}% complete</Badge>
      </div>

      <Card variant="elevated" className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">Overall Progress</span>
          <span className="text-sm text-text-muted">{completedCount} / {totalCount} tasks</span>
        </div>
        <Progress
          value={completionPercent}
          size="md"
          color={completionPercent === 100 ? "success" : "accent"}
        />
      </Card>

      <div className="space-y-4">
        {roadmap.content?.months?.map((month, idx) => {
          const isExpanded = expandedMonths.has(idx);
          const monthTasks = month.tasks || [];
          const monthCompleted = monthTasks.filter((t) => completedTasks.includes(t.id)).length;

          return (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
              <Card variant="elevated" className="overflow-hidden">
                <button
                  onClick={() => toggleMonth(idx)}
                  className="w-full flex items-center gap-4 p-5 hover:bg-elevated/30 transition-colors text-left"
                >
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border-2 ${
                      monthCompleted === monthTasks.length && monthTasks.length > 0
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-accent/10 border-accent/30 text-accent"
                    }`}>
                      {monthCompleted === monthTasks.length && monthTasks.length > 0 ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (month.month || idx + 1)}
                    </div>
                    {idx < (roadmap.content?.months?.length || 0) - 1 && (
                      <div className="w-px flex-1 h-6 bg-border" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-text-primary">{month.title}</h3>
                      {monthCompleted > 0 && (
                        <span className="text-xs text-text-muted">{monthCompleted}/{monthTasks.length}</span>
                      )}
                    </div>
                    {month.description && (
                      <p className="text-sm text-text-secondary line-clamp-1">{month.description}</p>
                    )}
                    {month.skills && month.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {month.skills.slice(0, 5).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-[10px]">{skill}</Badge>
                        ))}
                        {month.skills.length > 5 && (
                          <Badge variant="secondary" className="text-[10px]">+{month.skills.length - 5}</Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-text-muted" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-text-muted" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-border/50">
                    {monthTasks.length > 0 && (
                      <div className="pt-4">
                        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Tasks</h4>
                        <div className="space-y-2">
                          {monthTasks.map((task) => {
                            const isCompleted = completedTasks.includes(task.id);
                            return (
                              <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg bg-elevated/30 hover:bg-elevated/50 transition-colors group">
                                <button
                                  onClick={() => toggleTask(task.id, isCompleted)}
                                  disabled={loadingTasks}
                                  className="mt-0.5 shrink-0"
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-text-muted group-hover:text-accent transition-colors" />
                                  )}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm ${isCompleted ? "text-text-muted line-through" : "text-text-primary"}`}>
                                    {task.title}
                                  </p>
                                  {task.description && (
                                    <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{task.description}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {month.projects && month.projects.length > 0 && (
                      <div className="pt-4">
                        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Projects this month</h4>
                        <div className="space-y-3">
                          {month.projects.map((project) => (
                            <div key={project.id} className="p-4 rounded-lg bg-accent/5 border border-accent/15">
                              <div className="flex items-start gap-3">
                                <Code2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-medium text-text-primary">{project.title}</p>
                                    <Badge className={`text-[10px] ${getDifficultyColor(project.difficulty)}`}>{project.difficulty}</Badge>
                                  </div>
                                  <p className="text-xs text-text-secondary">{project.description}</p>
                                  {project.skills && project.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {project.skills.map((s) => (
                                        <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {roadmap.content?.projects && roadmap.content.projects.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card variant="glass" className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-semibold text-text-primary">Capstone Projects</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roadmap.content.projects.map((project) => (
                <div key={project.id} className="p-4 rounded-xl bg-elevated border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-semibold text-text-primary">{project.title}</p>
                    <Badge className={`text-[10px] ${getDifficultyColor(project.difficulty)}`}>{project.difficulty}</Badge>
                  </div>
                  <p className="text-xs text-text-secondary mb-3">{project.description}</p>
                  {project.skills && project.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.skills.map((s) => (
                        <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

export default function RoadmapPage() {
  const params = useParams();
  const id = params.id as string;
  const [roadmap, setRoadmap] = useState<IRoadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetch(`/api/roadmaps/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Roadmap not found");
          throw new Error("Failed to load roadmap");
        }
        const data = await res.json();
        setRoadmap(data.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRoadmap();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-20 w-full rounded-xl" />
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-text-secondary mb-4">{error || "Roadmap not found"}</p>
        <Link href="/dashboard/roadmaps">
          <Button variant="secondary" size="sm">Back to Roadmaps</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="max-w-4xl mx-auto mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="default">{roadmap.duration || `${roadmap.content?.months?.length} months`}</Badge>
            <Badge variant="secondary">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(roadmap.createdAt)}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">{roadmap.title}</h1>
          <p className="text-text-secondary">{roadmap.goal}</p>
          {roadmap.description && (
            <p className="text-sm text-text-muted mt-2">{roadmap.description}</p>
          )}
        </motion.div>
      </div>

      <RoadmapContent roadmap={roadmap} />
    </div>
  );
}
