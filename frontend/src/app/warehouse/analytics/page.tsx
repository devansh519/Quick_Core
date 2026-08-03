import { BarChart3 } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Warehouse Analytics"
      description="Turnover, stockouts, and transfer volume."
      icon={BarChart3}
      emptyTitle="Not enough data yet"
      emptyDescription="Analytics appear once inventory activity accumulates."
    />
  );
}
