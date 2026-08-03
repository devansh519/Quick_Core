"use client";
import { Package, Trash2 } from "lucide-react";
import { QuantitySelector } from "@/components/commerce/quantity-selector";
import { PriceDisplay } from "@/components/commerce/price-display";
import { IconButton } from "@/components/ui/icon-button";

export interface CartLineItem {
  id: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
}

export function CartItem({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartLineItem;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-bg-canvas">
        <Package className="h-5 w-5 text-text-muted" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-text-primary">{item.name}</p>
        <p className="text-xs text-text-muted">{item.unit}</p>
      </div>
      <QuantitySelector quantity={item.quantity} onChange={(q) => onQuantityChange(item.id, q)} />
      <PriceDisplay amount={item.price * item.quantity} size="sm" className="w-20 justify-end" />
      <IconButton aria-label={`Remove ${item.name} from cart`} size="sm" onClick={() => onRemove(item.id)}>
        <Trash2 className="h-4 w-4 text-text-muted" />
      </IconButton>
    </div>
  );
}
