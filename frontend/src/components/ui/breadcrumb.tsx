import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

export function Breadcrumb({ segments, className }: { segments: BreadcrumbSegment[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1.5 text-sm", className)}>
      <ol className="flex items-center gap-1.5">
        {segments.map((segment, i) => {
          const isLast = i === segments.length - 1;
          return (
            <li key={segment.label} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />}
              {segment.href && !isLast ? (
                <Link href={segment.href} className="text-text-secondary hover:text-text-primary transition-colors">
                  {segment.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "text-text-primary font-medium" : "text-text-secondary"}>
                  {segment.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
