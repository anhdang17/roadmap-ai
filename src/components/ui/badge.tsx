import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-accent/10 text-accent-light",
        secondary:
          "border-transparent bg-elevated text-text-secondary",
        success:
          "border-transparent bg-emerald-500/10 text-emerald-400",
        warning:
          "border-transparent bg-amber-500/10 text-amber-400",
        error:
          "border-transparent bg-red-500/10 text-red-400",
        outline:
          "border-border text-text-secondary",
        admin:
          "border-transparent bg-violet-500/10 text-violet-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
