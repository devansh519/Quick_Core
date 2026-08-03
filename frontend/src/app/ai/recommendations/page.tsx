import { ClipboardList } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Recommendation Center"
      description="All pending AI recommendations in one place."
      icon={ClipboardList}
      emptyTitle="No pending recommendations"
      emptyDescription="AI recommendations awaiting approval will appear here."
    />
  );
}
