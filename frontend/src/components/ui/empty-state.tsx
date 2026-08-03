import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-border-default px-6 py-16 text-center">
      <Icon className="h-6 w-6 text-text-muted" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-semibold text-text-primary">{title}</p>
        {description && <p className="text-sm text-text-secondary">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
