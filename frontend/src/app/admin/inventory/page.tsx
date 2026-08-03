import { ClipboardList } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Inventory"
      description="Cross-warehouse stock visibility."
      icon={ClipboardList}
      emptyTitle="No inventory records yet"
      emptyDescription="Inventory will appear here once warehouses report stock."
    />
  );
}
