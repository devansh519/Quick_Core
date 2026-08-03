"use client";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AddressCard, type Address } from "@/components/commerce/address-card";
import { PriceDisplay } from "@/components/commerce/price-display";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ADDRESSES: Address[] = [
  { id: "a1", label: "Home", line: "B-402, Cherry Residency, Dadri, UP 203207", isDefault: true },
  { id: "a2", label: "Work", line: "3rd Floor, Tech Park, Sector 62, Noida, UP" },
];

export default function CheckoutPage() {
  const router = useRouter();

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Checkout</h1>
          <p className="text-sm text-text-secondary">Confirm your delivery address and payment method.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Delivery address</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {ADDRESSES.map((a) => (
              <AddressCard key={a.id} address={a} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment method</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary">Cash on delivery &mdash; UPI and card payments coming soon.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Order summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Subtotal</span>
            <PriceDisplay amount={191} size="sm" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Delivery fee</span>
            <PriceDisplay amount={15} size="sm" />
          </div>
          <Separator className="my-2" />
          <div className="flex items-center justify-between">
            <span className="font-medium text-text-primary">Total</span>
            <PriceDisplay amount={206} size="md" />
          </div>
          <Button
            className="mt-3 w-full"
            onClick={() => {
              toast.success("Order placed");
              router.push("/orders/48213");
            }}
          >
            Place order
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
