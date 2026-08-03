import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  timestamp: string;
  unread?: boolean;
}

export function NotificationCard({ item }: { item: NotificationItem }) {
  const Icon = item.icon;
  return (
    <div className={cn("flex gap-3 rounded-[var(--radius-md)] p-3 transition-colors hover:bg-bg-surface", item.unread && "bg-brand-signal/5")}>
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-bg-canvas">
        <Icon className="h-4 w-4 text-text-secondary" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <p className={cn("text-sm", item.unread ? "font-semibold text-text-primary" : "font-medium text-text-primary")}>{item.title}</p>
        <p className="text-xs text-text-secondary">{item.description}</p>
        <p className="mt-0.5 text-xs text-text-muted">{item.timestamp}</p>
      </div>
      {item.unread && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-signal" aria-hidden="true" />}
    </div>
  );
}
