import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva("flex gap-3 rounded-[var(--radius-md)] border p-4 text-sm", {
  variants: {
    variant: {
      info: "border-info/20 bg-info/8 text-text-primary",
      success: "border-success/20 bg-success/8 text-text-primary",
      warning: "border-warning/20 bg-warning/8 text-text-primary",
      error: "border-error/20 bg-error/8 text-text-primary",
    },
  },
  defaultVariants: { variant: "info" },
});

const icons = { info: Info, success: CheckCircle2, warning: AlertTriangle, error: XCircle };
const iconColors = { info: "text-info", success: "text-success", warning: "text-warning", error: "text-error" };

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}

function Alert({ className, variant = "info", children, ...props }: AlertProps) {
  const Icon = icons[variant ?? "info"];
  return (
    <div role={variant === "error" || variant === "warning" ? "alert" : "status"} className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon className={cn("h-4.5 w-4.5 shrink-0", iconColors[variant ?? "info"])} aria-hidden="true" />
      <div className="flex-1">{children}</div>
    </div>
  );
}

const AlertTitle = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("font-medium text-text-primary", className)} {...props} />
);
const AlertDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-text-secondary mt-0.5", className)} {...props} />
);

export { Alert, AlertTitle, AlertDescription };
