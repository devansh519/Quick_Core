import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

export interface IconButtonProps extends Omit<ButtonProps, "size"> {
  "aria-label": string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-11 w-11" };

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = "md", variant = "ghost", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        className={`${sizeMap[size]} p-0 ${className ?? ""}`}
        {...props}
      />
    );
  }
);
IconButton.displayName = "IconButton";

export { IconButton };
