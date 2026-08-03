import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function CategoryCard({ name, icon: Icon, href }: { name: string; icon: LucideIcon; href: string }) {
  return (
    <Link href={href}>
      <Card className="flex flex-col items-center gap-2 p-4 text-center transition-colors hover:border-border-strong">
        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-brand-signal/10">
          <Icon className="h-5 w-5 text-brand-signal" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-text-primary">{name}</p>
      </Card>
    </Link>
  );
}
