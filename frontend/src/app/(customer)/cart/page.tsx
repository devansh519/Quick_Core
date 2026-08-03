"use client";
import { useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { CartItem, type CartLineItem } from "@/components/commerce/cart-item";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PriceDisplay } from "@/components/commerce/price-display";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

const INITIAL_ITEMS: CartLineItem[] = [
  { id: "p1", name: "Amul Toned Milk", unit: "500 ml pouch", price: 32, quantity: 2 },
  { id: "p3", name: "Robusta Bananas", unit: "1 dozen", price: 49, quantity: 1 },
  { id: "p4", name: "Lay's Classic Salted", unit: "52 g pack", price: 20, quantity: 3 },
];

export default function CartPage() {
  const [items, setItems] = useState(INITIAL_ITEMS);

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };
  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = subtotal > 0 ? 15 : 0;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        description="Add items from categories to get started."
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_320px]">
      <div>
        <h1 className="mb-4 text-xl font-semibold text-text-primary">Your cart</h1>
        <Card className="divide-y divide-border-default p-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} onQuantityChange={updateQuantity} onRemove={removeItem} />
          ))}
        </Card>
      </div>
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Order summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Subtotal</span>
            <PriceDisplay amount={subtotal} size="sm" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Delivery fee</span>
            <PriceDisplay amount={deliveryFee} size="sm" />
          </div>
          <Separator className="my-2" />
          <div className="flex items-center justify-between">
            <span className="font-medium text-text-primary">Total</span>
            <PriceDisplay amount={total} size="md" />
          </div>
          <Link href="/checkout">
            <Button className="mt-3 w-full">Proceed to checkout</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
