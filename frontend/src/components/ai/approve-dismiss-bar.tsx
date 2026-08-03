"use client";
import * as React from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ApproveDismissBarProps {
  /** What is being decided, used in the confirmation toast. */
  subject: string;
  onApprove?: () => void;
  onDismiss?: () => void;
  approveLabel?: string;
  dismissLabel?: string;
}

/**
 * The universal AI-decision control. Every AI feature in QuickCore that
 * proposes an operational action reuses this exact component — no feature
 * may invent its own accept/reject pattern (frozen product invariant).
 *
 * Approve uses Signal Blue: approving converts a prediction into a real,
 * deterministic backend action. Dismiss uses ghost styling.
 */
export function ApproveDismissBar({
  subject,
  onApprove,
  onDismiss,
  approveLabel = "Approve",
  dismissLabel = "Dismiss",
}: ApproveDismissBarProps) {
  const handleApprove = () => {
    onApprove?.();
    toast.success(`Approved: ${subject}`);
  };
  const handleDismiss = () => {
    onDismiss?.();
    toast(`Dismissed: ${subject}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="primary" size="sm" onClick={handleApprove}>
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
        {approveLabel}
      </Button>
      <Button variant="ghost" size="sm" onClick={handleDismiss}>
        <X className="h-3.5 w-3.5" aria-hidden="true" />
        {dismissLabel}
      </Button>
    </div>
  );
}
