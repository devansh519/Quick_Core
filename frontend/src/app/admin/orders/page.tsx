"use client";
import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/commerce/order-status-badge";
import { PriceDisplay } from "@/components/commerce/price-display";
import { Pagination } from "@/components/ui/pagination";
import type { OrderStatus } from "@/types";

interface OrderRow {
  id: string;
  customer: string;
  placedAt: string;
  items: number;
  total: number;
  status: OrderStatus;
}

const ORDERS: OrderRow[] = [
  { id: "48213", customer: "Ananya Rao", placedAt: "10:42 AM", items: 6, total: 412, status: "out_for_delivery" },
  { id: "48212", customer: "Rohan Mehta", placedAt: "10:38 AM", items: 3, total: 189, status: "preparing" },
  { id: "48211", customer: "Priya Nair", placedAt: "10:31 AM", items: 9, total: 745, status: "confirmed" },
  { id: "48210", customer: "Vikram Singh", placedAt: "10:20 AM", items: 2, total: 98, status: "delivered" },
  { id: "48209", customer: "Sneha Kapoor", placedAt: "10:05 AM", items: 5, total: 320, status: "cancelled" },
];

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Orders</h1>
        <p className="text-sm text-text-secondary">Full order oversight across the platform.</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Placed</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ORDERS.map((o) => (
            <TableRow key={o.id}>
              <TableCell className="font-mono text-xs">#{o.id}</TableCell>
              <TableCell className="font-medium">{o.customer}</TableCell>
              <TableCell className="text-text-secondary">{o.placedAt}</TableCell>
              <TableCell className="font-mono tabular-nums text-text-secondary">{o.items}</TableCell>
              <TableCell className="text-right"><PriceDisplay amount={o.total} size="sm" /></TableCell>
              <TableCell><OrderStatusBadge status={o.status} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination page={page} totalPages={12} onPageChange={setPage} totalItems={287} pageSize={25} />
    </div>
  );
}
