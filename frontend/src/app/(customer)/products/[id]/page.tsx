"use client";
import { use, useState } from "react";
import { Package, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/commerce/price-display";
import { InventoryBadge } from "@/components/commerce/inventory-badge";
import { QuantitySelector } from "@/components/commerce/quantity-selector";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { toast } from "sonner";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb
        segments={[
          { label: "Home", href: "/" },
          { label: "Dairy & Eggs", href: "/categories" },
          { label: "Product" },
        ]}
      />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-[var(--radius-lg)] border border-border-default bg-bg-surface">
          <Package className="h-16 w-16 text-text-muted" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs text-text-muted">Dairy & Eggs</p>
            <h1 className="text-xl font-semibold text-text-primary">Amul Toned Milk (SKU: {id})</h1>
            <p className="flex items-center gap-1 text-sm text-text-secondary">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" /> 4.6 &middot; 2,340 ratings
            </p>
          </div>
          <PriceDisplay amount={32} size="lg" />
          <InventoryBadge status="healthy" />
          <p className="text-sm text-text-secondary">
            Fresh toned milk, pasteurized and homogenized. Sourced daily from local dairy cooperatives and
            delivered chilled.
          </p>
          <div className="flex items-center gap-3">
            <QuantitySelector quantity={quantity} onChange={setQuantity} />
            <Button onClick={() => toast.success(`Added ${quantity} to cart`)}>Add to cart</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
