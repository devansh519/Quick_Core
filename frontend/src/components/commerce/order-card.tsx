import Link from "next/link";
import { Card } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/commerce/order-status-badge";
import { PriceDisplay } from "@/components/commerce/price-display";
import type { OrderStatus } from "@/types";

export interface OrderSummary {
  id: string;
  placedAt: string;
  itemCount: number;
  total: number;
  status: OrderStatus;
}

export function OrderCard({ order }: { order: OrderSummary }) {
  return (
    <Link href={`/orders/${order.id}`}>
      <Card className="flex items-center justify-between gap-4 p-4 transition-colors hover:border-border-strong">
        <div>
          <p className="text-sm font-medium text-text-primary">Order #{order.id}</p>
          <p className="text-xs text-text-secondary">{order.placedAt} · {order.itemCount} items</p>
        </div>
        <div className="flex items-center gap-4">
          <PriceDisplay amount={order.total} size="sm" />
          <OrderStatusBadge status={order.status} />
        </div>
      </Card>
    </Link>
  );
}
