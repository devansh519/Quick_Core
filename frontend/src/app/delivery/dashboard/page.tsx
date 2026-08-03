import Link from "next/link";
import { MapPin, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PredictionBadge } from "@/components/ai/prediction-badge";

interface DeliveryRow {
  id: string;
  address: string;
  items: number;
  distance: string;
}

const DELIVERIES: DeliveryRow[] = [
  { id: "48213", address: "B-402, Cherry Residency, Dadri", items: 6, distance: "1.2 km" },
  { id: "48215", address: "House 12, Rose Enclave, Dadri", items: 2, distance: "1.8 km" },
  { id: "48219", address: "Flat 8B, Lotus Towers, Dadri", items: 4, distance: "2.4 km" },
];

export default function DeliveryDashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold text-text-primary">Today&apos;s deliveries</h1>
        <p className="text-sm text-text-secondary">{DELIVERIES.length} assigned &mdash; ordered by urgency</p>
      </div>

      <Card className="border-insight-amber/25 bg-insight-amber-soft/40 p-3">
        <p className="text-xs font-medium text-insight-amber">Suggested route order</p>
        <p className="mt-0.5 text-xs text-text-secondary">Reordered for shortest total travel time. You can always deliver in the order shown below instead.</p>
        <div className="mt-2"><PredictionBadge label="AI-suggested route" /></div>
      </Card>

      <div className="flex flex-col gap-2">
        {DELIVERIES.map((d, i) => (
          <Link key={d.id} href={`/delivery/deliveries/${d.id}`}>
            <Card className="flex items-center gap-3 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-signal/10 text-sm font-semibold text-brand-signal">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">Order #{d.id}</p>
                <p className="flex items-center gap-1 text-xs text-text-secondary">
                  <MapPin className="h-3 w-3" /> {d.address}
                </p>
              </div>
              <div className="text-right">
                <Badge variant="neutral"><Package className="h-3 w-3" /> {d.items}</Badge>
                <p className="mt-1 text-xs text-text-muted">{d.distance}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
