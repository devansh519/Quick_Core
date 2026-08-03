import { Settings } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="System Settings"
      description="Platform configuration."
      icon={Settings}
      emptyTitle="Nothing to configure yet"
      emptyDescription="Platform settings will appear here."
    />
  );
}
