import { CreditCard } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Payments"
      description="Financial reconciliation view."
      icon={CreditCard}
      emptyTitle="No transactions yet"
      emptyDescription="Payment records will appear here as orders are placed."
    />
  );
}
