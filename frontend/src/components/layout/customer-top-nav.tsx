"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CUSTOMER_NAV } from "@/constants/nav";
import { NotificationCenter } from "@/components/layout/notification-center";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";

export function CustomerTopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border-default bg-bg-canvas">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-4 px-4 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-brand-signal text-white">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </div>
          <span className="hidden text-sm font-semibold text-text-primary sm:inline">QuickCore</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {CUSTOMER_NAV.filter((i) => i.href !== "/cart" && i.href !== "/profile").map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-[var(--radius-md)] px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive ? "text-brand-signal" : "text-text-secondary hover:text-text-primary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="relative ml-auto hidden max-w-xs flex-1 sm:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
          <Input placeholder="Search products" className="pl-8" aria-label="Search products" />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:ml-0">
          <Link href="/cart">
            <IconButton aria-label="View cart">
              <ShoppingCart className="h-4 w-4" />
            </IconButton>
          </Link>
          <NotificationCenter />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
