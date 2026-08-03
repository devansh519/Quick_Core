import { MapPin } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Deliveries"
      description="Oversee all deliveries in flight."
      icon={MapPin}
      emptyTitle="No active deliveries"
      emptyDescription="Deliveries will appear here once orders are out for delivery."
    />
  );
}
