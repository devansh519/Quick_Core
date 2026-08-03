import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfidenceValue } from "@/components/ai/confidence-value";
import { Sparkles } from "lucide-react";

export function ETACard({ status, etaMinutes, confidence }: { status: string; etaMinutes: number; confidence: number }) {
  return (
    <Card className="flex items-center justify-between gap-4 p-4">
      <div>
        <Badge variant="insight" className="mb-2">
          {status}
        </Badge>
        <p className="text-xs text-text-secondary">Estimated arrival</p>
        <p className="mt-0.5 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-insight-amber" aria-hidden="true" />
          <ConfidenceValue className="text-lg">~{etaMinutes} min</ConfidenceValue>
          <span className="text-xs text-text-muted">({confidence}% confidence)</span>
        </p>
      </div>
    </Card>
  );
}
