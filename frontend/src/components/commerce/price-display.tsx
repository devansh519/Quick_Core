import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PriceDisplay({
  amount,
  originalAmount,
  size = "md",
  className,
}: {
  amount: number;
  originalAmount?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass = size === "lg" ? "text-lg" : size === "sm" ? "text-xs" : "text-sm";
  return (
    <span className={cn("inline-flex items-baseline gap-1.5 font-mono tabular-nums", className)}>
      <span className={cn("font-semibold text-text-primary", sizeClass)}>{formatCurrency(amount)}</span>
      {originalAmount && originalAmount > amount && (
        <span className="text-xs text-text-muted line-through">{formatCurrency(originalAmount)}</span>
      )}
    </span>
  );
}
