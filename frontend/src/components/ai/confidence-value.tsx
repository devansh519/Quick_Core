import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Wraps any AI-predicted value with the Confidence Edge gradient underline.
 * This is the single device used everywhere a predicted (not observed) value
 * renders. Never apply this to deterministic backend facts.
 */
export function ConfidenceValue({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("confidence-edge font-mono text-insight-amber tabular-nums", className)}>
      {children}
    </span>
  );
}
