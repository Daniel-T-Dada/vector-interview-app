import * as React from "react";
import { cn } from "@/lib/utils";

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => {
    return (
        <div
            ref={ref}
            role="alert"
            className={cn(
                "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
                {
                    "bg-destructive/15 text-destructive border-destructive/50":
                        variant === "destructive",
                    "bg-primary/15 text-primary border-primary/50": variant === "default",
                    "bg-green-500/15 text-green-600 border-green-500/50":
                        variant === "success",
                    "bg-yellow-500/15 text-yellow-600 border-yellow-500/50":
                        variant === "warning",
                },
                className
            )}
            {...props}
        />
    );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h5
        ref={ref}
        className={cn("mb-1 font-medium leading-none tracking-tight", className)}
        {...props}
    />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("text-sm [&_p]:leading-relaxed", className)}
        {...props}
    />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription }; 