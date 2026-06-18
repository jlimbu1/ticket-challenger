"use client";

import { cn } from "@/lib/utils";

interface VinylSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: "h-12 w-12",
  md: "h-20 w-20",
  lg: "h-32 w-32",
};

const innerSizeClasses = {
  sm: "h-6 w-6",
  md: "h-10 w-10",
  lg: "h-16 w-16",
};

export default function VinylSpinner({
  size = "md",
  className,
  label = "Loading...",
}: VinylSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("flex flex-col items-center justify-center gap-4", className)}
    >
      <div
        className={cn(
          "relative rounded-full bg-gothic-900 shadow-gothic",
          sizeClasses[size]
        )}
      >
        {/* Vinyl record body */}
        <div className="absolute inset-0 rounded-full bg-black">
          {/* Grooves */}
          <div className="absolute inset-[15%] rounded-full border-2 border-gothic-700" />
          <div className="absolute inset-[25%] rounded-full border-2 border-gothic-700" />
          <div className="absolute inset-[35%] rounded-full border-2 border-gothic-700" />
          <div className="absolute inset-[45%] rounded-full border-2 border-gothic-700" />
          {/* Label */}
          <div className="absolute inset-[30%] rounded-full bg-crimson shadow-inner">
            <div className="flex h-full items-center justify-center">
              <div className={cn("rounded-full bg-gothic-900", innerSizeClasses[size])} />
            </div>
          </div>
        </div>
        {/* Spinning animation overlay */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border-2 border-transparent border-t-crimson",
            "animate-spin"
          )}
          style={{ animationDuration: "3s" }}
        />
      </div>
      {label && (
        <span className="text-sm font-serif text-gothic-400 animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
}