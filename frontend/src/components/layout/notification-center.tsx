"use client";
import { Bell, Package, Truck, Tag } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { IconButton } from "@/components/ui/icon-button";
import { NotificationCard, type NotificationItem } from "@/components/commerce/notification-card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  { id: "1", icon: Truck, title: "Order out for delivery", description: "Order #48213 is on its way", timestamp: "2 min ago", unread: true },
  { id: "2", icon: Package, title: "Order delivered", description: "Order #48190 was delivered", timestamp: "1 hr ago", unread: true },
  { id: "3", icon: Tag, title: "New offer available", description: "20% off on dairy this weekend", timestamp: "Yesterday" },
];

export function NotificationCenter() {
  const unreadCount = SAMPLE_NOTIFICATIONS.filter((n) => n.unread).length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <IconButton aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}>
            <Bell className="h-4 w-4" />
          </IconButton>
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-error" aria-hidden="true" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-3">
          <p className="text-sm font-semibold text-text-primary">Notifications</p>
        </div>
        <Separator />
        <div className="flex flex-col gap-0.5 p-1.5">
          {SAMPLE_NOTIFICATIONS.map((item) => (
            <NotificationCard key={item.id} item={item} />
          ))}
        </div>
        <Separator />
        <Link href="/notifications" className="block p-2.5 text-center text-xs font-medium text-brand-signal hover:underline">
          View all
        </Link>
      </PopoverContent>
    </Popover>
  );
}
