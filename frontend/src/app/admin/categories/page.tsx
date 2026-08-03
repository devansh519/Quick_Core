import { LayoutGrid } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Categories"
      description="Manage product taxonomy."
      icon={LayoutGrid}
      emptyTitle="No categories yet"
      emptyDescription="Add a category to start organizing your catalog."
    />
  );
}
