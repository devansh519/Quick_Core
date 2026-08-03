import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export function Pagination({ page, totalPages, onPageChange, totalItems, pageSize }: PaginationProps) {
  const start = totalItems && pageSize ? (page - 1) * pageSize + 1 : undefined;
  const end = totalItems && pageSize ? Math.min(page * pageSize, totalItems) : undefined;

  return (
    <div className="flex items-center justify-between gap-4 px-1 py-2">
      <p className="text-xs text-text-secondary tabular-nums">
        {totalItems !== undefined ? `Showing ${start}\u2013${end} of ${totalItems}` : `Page ${page} of ${totalPages}`}
      </p>
      <div className="flex items-center gap-1">
        <IconButton
          aria-label="Previous page"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </IconButton>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .map((p, idx, arr) => (
            <React.Fragment key={p}>
              {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 text-text-muted">…</span>}
              <button
                onClick={() => onPageChange(p)}
                aria-current={p === page ? "page" : undefined}
                className={cn(
                  "h-8 w-8 rounded-[var(--radius-md)] text-sm tabular-nums transition-colors",
                  p === page ? "bg-brand-signal text-white" : "text-text-secondary hover:bg-bg-surface"
                )}
              >
                {p}
              </button>
            </React.Fragment>
          ))}
        <IconButton
          aria-label="Next page"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  );
}
