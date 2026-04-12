import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-cobalt)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,var(--brand-cobalt)_0%,var(--brand-violet)_52%,var(--brand-sky)_100%)] text-white shadow-[0_18px_40px_-24px_rgba(88,80,236,0.7)] hover:opacity-95",
        secondary: "bg-[var(--brand-mist)] text-slate-900 hover:bg-[color:rgba(224,213,255,0.9)]",
        outline:
          "border border-[color:rgba(88,80,236,0.18)] bg-white text-slate-900 hover:bg-[linear-gradient(135deg,rgba(245,247,255,0.98),rgba(248,241,255,0.95))]",
        ghost: "text-slate-700 hover:bg-[var(--brand-mist)]"
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
