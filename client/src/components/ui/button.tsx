import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-blue text-white border border-transparent hover:bg-blue-hover hover:border-blue-hover hover:-translate-y-px active:translate-y-0",
        outline:
          "bg-white text-primary border border-border hover:bg-background hover:border-blue",
        ghost:
          "bg-transparent text-text-secondary border border-transparent hover:bg-background hover:border-border hover:text-primary",
        link: "bg-transparent text-blue underline-offset-4 hover:underline border-0 p-0 h-auto",
        icon: "rounded-pill border border-border bg-white text-text-muted hover:bg-blue hover:border-blue hover:text-white hover:shadow-card hover:scale-110 active:scale-100",
      },
      size: {
        sm:        "h-8 px-3 text-xs",
        default:   "h-9 px-4 py-2",
        lg:        "h-11 px-6 text-base",
        icon:      "h-8 w-8 p-0",
        "icon-sm": "h-7 w-7 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
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
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
