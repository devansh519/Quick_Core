import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        aria-invalid={error || undefined}
        className={cn(
          "flex h-10 w-full rounded-[var(--radius-md)] border bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/45 disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-error" : "border-border-default focus-visible:border-brand-signal",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
