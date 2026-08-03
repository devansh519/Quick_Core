import { Badge } from "@/components/ui/badge";
import type { InventoryStatus } from "@/types";

const config: Record<InventoryStatus, { label: string; variant: "success" | "warning" | "error" | "info" }> = {
  healthy: { label: "In stock", variant: "success" },
  low: { label: "Low stock", variant: "warning" },
  critical: { label: "Critical", variant: "error" },
  overstock: { label: "Overstock", variant: "info" },
};

export function InventoryBadge({ status }: { status: InventoryStatus }) {
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}
