import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-brick)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--brand-brick)] text-white shadow-[0_14px_32px_-18px_rgba(123,44,40,0.5)] hover:bg-[#65231f]",
        secondary: "bg-[var(--brand-green)] text-white hover:bg-[#18231c]",
        outline:
          "border border-[rgba(123,44,40,0.22)] bg-white text-[var(--brand-brick)] hover:border-[var(--brand-brick)] hover:bg-[var(--brand-mist)]",
        ghost: "text-[var(--brand-brick)] hover:bg-[var(--brand-mist)]",
        inverse: "border border-white/30 bg-white text-[var(--brand-brick)] hover:bg-white/92"
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
