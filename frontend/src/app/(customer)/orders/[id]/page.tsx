import { use } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { OrderTimeline } from "@/components/commerce/order-timeline";
import { PriceDisplay } from "@/components/commerce/price-display";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb segments={[{ label: "Orders", href: "/orders" }, { label: `#${id}` }]} />
      <h1 className="text-xl font-semibold text-text-primary">Order #{id}</h1>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Delivery status</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderTimeline
              steps={[
                { label: "Order placed", timestamp: "10:42 AM", complete: true },
                { label: "Confirmed", timestamp: "10:43 AM", complete: true },
                { label: "Preparing", timestamp: "10:45 AM", complete: true },
                { label: "Out for delivery", timestamp: "10:52 AM", predictedEta: "8 min", complete: false, current: true },
                { label: "Delivered", complete: false },
              ]}
            />
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Amul Toned Milk × 2</span>
              <PriceDisplay amount={64} size="sm" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Robusta Bananas × 1</span>
              <PriceDisplay amount={49} size="sm" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Lay's Classic Salted × 3</span>
              <PriceDisplay amount={60} size="sm" />
            </div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between">
              <span className="font-medium text-text-primary">Total</span>
              <PriceDisplay amount={188} size="md" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
