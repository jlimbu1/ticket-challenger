"use client";

import { cn } from "@/lib/utils";

interface GothicEmptyStateProps {
  title?: string;
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

const defaultMessages = [
  "The void stares back, empty and waiting.",
  "No relics found in this chamber.",
  "The collection lies dormant, awaiting your touch.",
  "Silence echoes through these empty halls.",
  "Not a single artifact remains in this exhibit.",
];

function getRandomDefaultMessage(): string {
  return defaultMessages[Math.floor(Math.random() * defaultMessages.length)];
}

export default function GothicEmptyState({
  title = "Empty",
  message,
  className,
  children,
}: GothicEmptyStateProps) {
  const displayMessage = message ?? getRandomDefaultMessage();

  return (
    <div
      role="status"
      aria-label="Empty state"
      className={cn(
        "flex flex-col items-center justify-center gap-6 p-8 text-center",
        "border border-gothic-700 bg-gothic-900/50 shadow-gothic",
        "rounded-lg",
        className
      )}
    >
      <div className="relative flex items-center justify-center" aria-hidden="true">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-crimson/40 bg-gothic-800">
          <span className="text-2xl text-crimson/60">&#9760;</span>
        </div>
        <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose/30">
          <span className="text-xs text-rose/60">&#10007;</span>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-gothic text-xl font-bold tracking-wider text-crimson">
          {title}
        </h3>
        <p className="max-w-md text-sm italic text-gothic-300">
          {displayMessage}
        </p>
      </div>
      {children && (
        <div className="mt-2">
          {children}
        </div>
      )}
    </div>
  );
}