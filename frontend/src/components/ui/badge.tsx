import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        neutral: "bg-bg-canvas text-text-secondary border border-border-default",
        success: "bg-success/12 text-success",
        warning: "bg-warning/12 text-warning",
        error: "bg-error/12 text-error",
        info: "bg-info/12 text-info",
        insight: "bg-insight-amber-soft text-insight-amber",
        signal: "bg-brand-signal/12 text-brand-signal",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
