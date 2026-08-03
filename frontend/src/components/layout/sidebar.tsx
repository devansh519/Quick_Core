"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { NAV_BY_ROLE } from "@/constants/nav";
import type { Role } from "@/types";
import { cn } from "@/lib/utils";

const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrator",
  warehouse: "Warehouse Manager",
  delivery: "Delivery Partner",
  ai_operator: "AI Operations",
  customer: "Customer",
};

export function Sidebar({ role, basePath }: { role: Role; basePath: string }) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role];
  const roleLabel = ROLE_LABELS[role];

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border-default bg-bg-surface md:flex">
      <div className="flex h-14 items-center gap-2 border-b border-border-default px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-brand-signal text-white">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none text-text-primary">QuickCore</p>
          <p className="text-[11px] leading-none text-text-muted">{roleLabel}</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-2" aria-label={`${roleLabel} navigation`}>
        {items.map((item) => {
          const href = `${basePath}${item.href === "/" ? "" : item.href}`;
          const isActive = pathname === href || (item.href !== "/" && pathname.startsWith(href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-[var(--radius-md)] px-2.5 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-brand-signal/10 text-brand-signal" : "text-text-secondary hover:bg-bg-canvas hover:text-text-primary"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
