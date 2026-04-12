import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-blue)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,#ff6d00_0%,#ff7f11_100%)] text-white shadow-[0_18px_40px_-24px_rgba(255,109,0,0.55)] hover:bg-[linear-gradient(135deg,#e86300_0%,#f97316_100%)] hover:shadow-[0_22px_42px_-24px_rgba(255,109,0,0.62)]",
        secondary: "bg-[var(--brand-navy)] text-white hover:bg-[#15233f]",
        outline:
          "border border-[color:var(--brand-line-strong)] bg-white text-[var(--brand-navy)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand-blue)]",
        ghost: "text-[var(--brand-navy)] hover:bg-[var(--brand-mist)]"
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
