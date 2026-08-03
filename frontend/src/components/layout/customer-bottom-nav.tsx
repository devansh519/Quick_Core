"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CUSTOMER_NAV } from "@/constants/nav";
import { cn } from "@/lib/utils";

export function CustomerBottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border-default bg-bg-surface-raised py-1.5 md:hidden"
    >
      {CUSTOMER_NAV.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex min-h-10 min-w-10 flex-col items-center justify-center gap-0.5 rounded-[var(--radius-md)] px-2 py-1 text-[11px] font-medium",
              isActive ? "text-brand-signal" : "text-text-muted"
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
