"use client";
import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { PriceDisplay } from "@/components/commerce/price-display";
import { toast } from "sonner";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  unit: string;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group relative flex flex-col gap-2 p-3 transition-colors hover:border-border-strong">
      <Link href={`/products/${product.id}`} className="flex flex-col gap-2">
        <div className="flex aspect-square items-center justify-center rounded-[var(--radius-md)] bg-bg-canvas">
          <Package className="h-8 w-8 text-text-muted" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs text-text-muted">{product.category}</p>
          <p className="text-sm font-medium text-text-primary line-clamp-2">{product.name}</p>
          <p className="text-xs text-text-muted">{product.unit}</p>
        </div>
      </Link>
      <div className="flex items-center justify-between">
        <PriceDisplay amount={product.price} originalAmount={product.originalPrice} size="sm" />
        <IconButton
          aria-label={`Add ${product.name} to cart`}
          size="sm"
          variant="secondary"
          onClick={() => toast.success(`Added ${product.name} to cart`)}
        >
          <Plus className="h-4 w-4" />
        </IconButton>
      </div>
    </Card>
  );
}
