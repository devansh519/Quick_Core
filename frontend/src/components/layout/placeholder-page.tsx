import { type LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export function PlaceholderPage({
  title,
  description,
  icon,
  emptyTitle,
  emptyDescription,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
      <EmptyState icon={icon} title={emptyTitle} description={emptyDescription} />
    </div>
  );
}
