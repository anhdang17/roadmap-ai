"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "accent" | "success" | "warning" | "error";
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, showLabel = false, size = "md", color = "accent", ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const colorClasses = {
      accent: "bg-accent",
      success: "bg-emerald-400",
      warning: "bg-amber-400",
      error: "bg-red-400",
    };

    const sizeClasses = {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
    };

    return (
      <div className="w-full" ref={ref} {...props}>
        {showLabel && (
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-text-muted">{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          className={cn(
            "w-full rounded-full bg-elevated overflow-hidden",
            sizeClasses[size],
            className
          )}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-out",
              colorClasses[color]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
