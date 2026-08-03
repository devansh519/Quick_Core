import { Truck, Package, Tag, Sparkles } from "lucide-react";
import { NotificationCard, type NotificationItem } from "@/components/commerce/notification-card";

const NOTIFICATIONS: NotificationItem[] = [
  { id: "1", icon: Truck, title: "Order out for delivery", description: "Order #48213 is on its way, arriving in ~8 min", timestamp: "2 min ago", unread: true },
  { id: "2", icon: Package, title: "Order delivered", description: "Order #48190 was delivered successfully", timestamp: "1 hr ago", unread: true },
  { id: "3", icon: Tag, title: "Weekend offer", description: "20% off on dairy products this weekend", timestamp: "Yesterday" },
  { id: "4", icon: Sparkles, title: "New: AI shopping assistant", description: "Ask QuickCore AI to help you plan your next order", timestamp: "3 days ago" },
];

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Notifications</h1>
        <p className="text-sm text-text-secondary">Updates on your orders and offers.</p>
      </div>
      <div className="flex flex-col gap-1">
        {NOTIFICATIONS.map((n) => (
          <NotificationCard key={n.id} item={n} />
        ))}
      </div>
    </div>
  );
}
