import * as React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfidenceIndicatorProps {
  /** 0-100 */
  confidence: number;
  size?: "sm" | "md";
  className?: string;
}

/**
 * The atomic building block of the Confidence Edge system.
 * Insight Amber only — never used for deterministic/backend values.
 */
export function ConfidenceIndicator({ confidence, size = "md", className }: ConfidenceIndicatorProps) {
  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <Sparkles className={cn("text-insight-amber", size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} aria-hidden="true" />
      <div className={cn("relative overflow-hidden rounded-[var(--radius-pill)] bg-insight-amber-soft", size === "sm" ? "h-1 w-10" : "h-1.5 w-14")}>
        <div
          className="h-full rounded-[var(--radius-pill)] bg-insight-amber transition-[width] duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, confidence))}%` }}
        />
      </div>
      <span className="text-xs font-medium text-insight-amber tabular-nums">{confidence}%</span>
    </div>
  );
}
