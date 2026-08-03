import { Check } from "lucide-react";
import { ConfidenceValue } from "@/components/ai/confidence-value";
import { cn } from "@/lib/utils";

interface TimelineStep {
  label: string;
  timestamp?: string;
  /** ETA text, rendered with Confidence Edge since it's predicted, not a fact */
  predictedEta?: string;
  complete: boolean;
  current?: boolean;
}

export function OrderTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="flex flex-col gap-0">
      {steps.map((step, i) => (
        <li key={step.label} className="relative flex gap-3 pb-6 last:pb-0" aria-current={step.current ? "step" : undefined}>
          {i < steps.length - 1 && (
            <span
              className={cn("absolute left-[11px] top-6 h-full w-px", step.complete ? "bg-success" : "bg-border-default")}
              aria-hidden="true"
            />
          )}
          <span
            className={cn(
              "z-10 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2",
              step.complete
                ? "border-success bg-success text-white"
                : step.current
                ? "border-brand-signal bg-bg-surface"
                : "border-border-default bg-bg-surface"
            )}
          >
            {step.complete && <Check className="h-3 w-3" aria-hidden="true" />}
          </span>
          <div className="pt-0.5">
            <p className={cn("text-sm font-medium", step.complete || step.current ? "text-text-primary" : "text-text-muted")}>
              {step.label}
            </p>
            {step.timestamp && <p className="text-xs text-text-secondary">{step.timestamp}</p>}
            {step.predictedEta && (
              <p className="text-xs text-text-secondary">
                ETA (predicted) <ConfidenceValue className="ml-1">{step.predictedEta}</ConfidenceValue>
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
