import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types";

const config: Record<OrderStatus, { label: string; variant: "info" | "signal" | "warning" | "insight" | "success" | "error" }> = {
  placed: { label: "Placed", variant: "info" },
  confirmed: { label: "Confirmed", variant: "signal" },
  preparing: { label: "Preparing", variant: "warning" },
  out_for_delivery: { label: "Out for delivery", variant: "insight" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "error" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}
