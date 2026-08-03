import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium transition-colors duration-[120ms] ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 min-h-10",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-signal text-white hover:bg-brand-signal-hover active:scale-[0.98]",
        secondary:
          "border border-border-default bg-transparent text-text-primary hover:bg-bg-surface active:scale-[0.98]",
        ghost:
          "bg-transparent text-text-primary hover:bg-bg-surface active:scale-[0.98]",
        destructive:
          "bg-error text-white hover:opacity-90 active:scale-[0.98]",
        link: "text-brand-signal underline-offset-4 hover:underline p-0 h-auto min-h-0",
      },
      size: {
        sm: "h-8 px-3 text-xs [&_svg]:size-3.5",
        md: "h-10 px-4 [&_svg]:size-4",
        lg: "h-11 px-6 text-base [&_svg]:size-4.5",
        icon: "h-10 w-10 p-0 [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
