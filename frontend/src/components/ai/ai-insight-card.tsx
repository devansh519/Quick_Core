import * as React from "react";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ConfidenceIndicator } from "@/components/ai/confidence-indicator";
import { cn } from "@/lib/utils";

interface AIInsightCardProps {
  title: string;
  description: string;
  confidence: number;
  /** If provided, renders the Approve/Dismiss action bar below. Omit for purely informational (Operational Insight) cards. */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Base card for any AI-sourced observation. insight-amber-soft wash + sparkle
 * label distinguish it at a glance from deterministic dashboard cards.
 */
export function AIInsightCard({ title, description, confidence, actions, className }: AIInsightCardProps) {
  return (
    <Card className={cn("border-insight-amber/25 bg-insight-amber-soft/40 p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-insight-amber-soft">
            <Sparkles className="h-3.5 w-3.5 text-insight-amber" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{title}</p>
            <p className="mt-0.5 text-sm text-text-secondary">{description}</p>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <ConfidenceIndicator confidence={confidence} size="sm" />
      </div>
      {actions && <div className="mt-3 border-t border-insight-amber/15 pt-3">{actions}</div>}
    </Card>
  );
}
