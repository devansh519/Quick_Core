import { Gauge } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Inventory Health"
      description="Predicted stock depletion across warehouses."
      icon={Gauge}
      emptyTitle="This insight isn't available yet"
      emptyDescription="Inventory health forecasts will appear here once connected."
    />
  );
}
