"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import VinylSpinner from "@/components/VinylSpinner";

interface ThemedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variantClasses = {
  primary:
    "bg-crimson text-gothic-50 hover:bg-crimson-light active:bg-crimson-dark border-crimson shadow-crimson",
  secondary:
    "bg-transparent text-gothic-200 hover:bg-gothic-700 active:bg-gothic-600 border-gothic-600 hover:border-gothic-500",
  danger:
    "bg-rose-dark text-gothic-50 hover:bg-rose active:bg-rose-dark border-rose-dark shadow-crimson",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-8 py-3.5 text-lg",
};

const ThemedButton = forwardRef<HTMLButtonElement, ThemedButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-md border font-serif font-semibold",
          "transition-all duration-300 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-gothic-900",
          isDisabled && "cursor-not-allowed opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && (
          <VinylSpinner size="sm" className="absolute" />
        )}
        <span className={cn(loading && "invisible")}>
          {children}
        </span>
      </button>
    );
  }
);

ThemedButton.displayName = "ThemedButton";

export default ThemedButton;