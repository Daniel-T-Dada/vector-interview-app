import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

const Button = React.forwardRef(
    ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-primary text-primary-foreground shadow hover:bg-primary/90":
                            variant === "default",
                        "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90":
                            variant === "destructive",
                        "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground":
                            variant === "outline",
                        "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80":
                            variant === "secondary",
                        "bg-transparent text-foreground underline-offset-4 hover:underline":
                            variant === "link",
                        "bg-transparent text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground":
                            variant === "ghost",
                        "h-9 px-3 py-2": size === "sm",
                        "h-10 px-4 py-2": size === "default",
                        "h-11 px-8": size === "lg",
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button }; 