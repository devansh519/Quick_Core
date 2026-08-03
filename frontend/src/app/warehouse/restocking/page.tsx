import { Boxes } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Restocking"
      description="Review and action restock alerts."
      icon={Boxes}
      emptyTitle="No restocking alerts"
      emptyDescription="You're fully stocked \u2014 nothing needs attention right now."
    />
  );
}
