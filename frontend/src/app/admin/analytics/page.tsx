import { BarChart3 } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Analytics"
      description="Business performance overview."
      icon={BarChart3}
      emptyTitle="Not enough data yet"
      emptyDescription="Analytics appear once orders start coming in."
    />
  );
}
