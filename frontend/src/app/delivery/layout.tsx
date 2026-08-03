import { ProfileMenu } from "@/components/layout/profile-menu";
import { NotificationCenter } from "@/components/layout/notification-center";
import { Sparkles } from "lucide-react";

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-bg-canvas">
      <header className="flex h-14 items-center justify-between border-b border-border-default px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-brand-signal text-white">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </div>
          <span className="text-sm font-semibold text-text-primary">QuickCore Delivery</span>
        </div>
        <div className="flex items-center gap-1">
          <NotificationCenter />
          <ProfileMenu />
        </div>
      </header>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
