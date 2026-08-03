import { Boxes } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function Page() {
  return (
    <PlaceholderPage
      title="Brands"
      description="Manage brand records."
      icon={Boxes}
      emptyTitle="No brands yet"
      emptyDescription="Add a brand to start tagging products."
    />
  );
}
