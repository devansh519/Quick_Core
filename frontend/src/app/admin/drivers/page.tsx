import { Truck } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Drivers"
      description="Manage delivery partner roster."
      icon={Truck}
      emptyTitle="No drivers yet"
      emptyDescription="Add a driver to start assigning deliveries."
    />
  );
}
