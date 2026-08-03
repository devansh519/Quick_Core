import * as React from "react";
import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-border-default px-6 py-16 text-center">
      <AlertOctagon className="h-6 w-6 text-error" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-semibold text-text-primary">{title}</p>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
      {onRetry && (
        <Button size="sm" variant="secondary" onClick={onRetry} className="mt-2">
          Retry
        </Button>
      )}
    </div>
  );
}
