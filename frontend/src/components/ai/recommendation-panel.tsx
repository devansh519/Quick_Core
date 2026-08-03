import * as React from "react";
import { AIInsightCard } from "@/components/ai/ai-insight-card";
import { ApproveDismissBar } from "@/components/ai/approve-dismiss-bar";

interface RecommendationPanelProps {
  title: string;
  description: string;
  confidence: number;
  onApprove?: () => void;
  onDismiss?: () => void;
}

/** Pairs an AI Insight Card with the mandatory Approve/Dismiss decision. */
export function RecommendationPanel({ title, description, confidence, onApprove, onDismiss }: RecommendationPanelProps) {
  return (
    <AIInsightCard
      title={title}
      description={description}
      confidence={confidence}
      actions={<ApproveDismissBar subject={title} onApprove={onApprove} onDismiss={onDismiss} />}
    />
  );
}
