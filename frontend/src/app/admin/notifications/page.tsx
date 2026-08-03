import { Bell } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Notifications"
      description="System-wide alert history."
      icon={Bell}
      emptyTitle="You're all caught up"
      emptyDescription="New system notifications will show up here."
    />
  );
}
