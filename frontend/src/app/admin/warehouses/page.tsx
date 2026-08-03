import { Warehouse } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Warehouses"
      description="Oversee all warehouse locations."
      icon={Warehouse}
      emptyTitle="No warehouses yet"
      emptyDescription="Add a warehouse to begin tracking inventory locations."
    />
  );
}
