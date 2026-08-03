import { OrderCard, type OrderSummary } from "@/components/commerce/order-card";

const ORDERS: OrderSummary[] = [
  { id: "48213", placedAt: "Today, 10:42 AM", itemCount: 6, total: 412, status: "out_for_delivery" },
  { id: "48190", placedAt: "Yesterday, 6:15 PM", itemCount: 3, total: 189, status: "delivered" },
  { id: "48072", placedAt: "Jul 28, 2026", itemCount: 8, total: 651, status: "delivered" },
  { id: "47998", placedAt: "Jul 24, 2026", itemCount: 2, total: 98, status: "cancelled" },
];

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Your orders</h1>
        <p className="text-sm text-text-secondary">Track and manage your recent purchases.</p>
      </div>
      <div className="flex flex-col gap-3">
        {ORDERS.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
