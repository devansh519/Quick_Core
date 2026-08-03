import { Timer } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="ETA Prediction"
      description="Delivery time confidence across active orders."
      icon={Timer}
      emptyTitle="This insight isn't available yet"
      emptyDescription="ETA prediction models will appear here once connected."
    />
  );
}
