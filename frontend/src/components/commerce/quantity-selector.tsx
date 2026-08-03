"use client";
import { Minus, Plus } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";

export function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 20,
}: {
  quantity: number;
  onChange: (q: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-[var(--radius-md)] border border-border-default p-0.5">
      <IconButton
        aria-label="Decrease quantity"
        size="sm"
        disabled={quantity <= min}
        onClick={() => onChange(quantity - 1)}
      >
        <Minus className="h-3.5 w-3.5" />
      </IconButton>
      <span className="w-6 text-center font-mono text-sm tabular-nums text-text-primary">{quantity}</span>
      <IconButton
        aria-label="Increase quantity"
        size="sm"
        disabled={quantity >= max}
        onClick={() => onChange(quantity + 1)}
      >
        <Plus className="h-3.5 w-3.5" />
      </IconButton>
    </div>
  );
}
