import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("skeleton-shimmer rounded-[var(--radius-md)]", className)}
      {...props}
    />
  );
}

export { Skeleton };
