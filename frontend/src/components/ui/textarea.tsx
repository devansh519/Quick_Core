import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      aria-invalid={error || undefined}
      className={cn(
        "flex min-h-20 w-full rounded-[var(--radius-md)] border bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/45 disabled:cursor-not-allowed disabled:opacity-50",
        error ? "border-error" : "border-border-default focus-visible:border-brand-signal",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
