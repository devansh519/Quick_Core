import * as React from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/** Compact inline tag for space-constrained contexts (e.g. table cells). */
export function PredictionBadge({ label }: { label: string }) {
  return (
    <Badge variant="insight">
      <Sparkles className="h-3 w-3" aria-hidden="true" />
      {label}
    </Badge>
  );
}
