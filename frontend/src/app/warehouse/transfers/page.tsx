import { ArrowLeftRight } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Transfers"
      description="Move stock between warehouses."
      icon={ArrowLeftRight}
      emptyTitle="No pending transfers"
      emptyDescription="Initiate a transfer to move stock between warehouses."
    />
  );
}
