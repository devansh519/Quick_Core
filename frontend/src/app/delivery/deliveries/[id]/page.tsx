"use client";
import { use } from "react";
import Link from "next/link";
import { MapPin, Phone, Navigation, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeliveryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <Link href="/delivery/dashboard" className="inline-flex w-fit items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to deliveries
      </Link>

      <h1 className="text-lg font-semibold text-text-primary">Order #{id}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Delivery address</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="flex items-start gap-2 text-sm text-text-primary">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" /> B-402, Cherry Residency, Dadri, UP 203207
          </p>
          <p className="text-xs text-text-secondary">Notes: Leave with security guard if not home.</p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="flex-1">
              <Navigation className="h-3.5 w-3.5" /> Start navigation
            </Button>
            <Button variant="secondary" size="sm">
              <Phone className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items (6)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm text-text-secondary">
          <p>Amul Toned Milk × 2</p>
          <p>Robusta Bananas × 1</p>
          <p>Lay&apos;s Classic Salted × 3</p>
        </CardContent>
      </Card>

      <Button
        size="lg"
        className="w-full"
        onClick={() => {
          toast.success(`Order #${id} marked as delivered`);
          router.push("/delivery/dashboard");
        }}
      >
        Mark as delivered
      </Button>
    </div>
  );
}
