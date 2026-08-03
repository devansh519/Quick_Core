import { type LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
}

export function MetricCard({ label, value, icon: Icon, trend }: MetricCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{label}</p>
        <Icon className="h-4 w-4 text-text-muted" aria-hidden="true" />
      </div>
      <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-text-primary">{value}</p>
      {trend && (
        <p className={cn("mt-1 flex items-center gap-1 text-xs font-medium", trend.positive ? "text-success" : "text-error")}>
          {trend.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trend.value}
        </p>
      )}
    </Card>
  );
}
