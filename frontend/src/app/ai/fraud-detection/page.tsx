import { ShieldAlert } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Fraud Detection"
      description="Review flagged orders and transactions."
      icon={ShieldAlert}
      emptyTitle="No fraud flags right now"
      emptyDescription="Flagged orders requiring review will appear here."
    />
  );
}
