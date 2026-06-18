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
      {/* Decorative skull/rose element */}
      <div className="relative flex items-center justify-center" aria-hidden="true">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-crimson/40 bg-gothic-800">
          <span className="text-2xl text-crimson/60">&#9760;</span>
        </div>
        <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose/30">
          <span className="text-xs text-rose/80">&#10022;</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-gothic text-2xl font-bold tracking-wider text-gothic-200">
        {title}
      </h3>

      {/* Message */}
      <p className="max-w-md font-serif text-lg italic leading-relaxed text-gothic-400">
        {displayMessage}
      </p>

      {/* Optional children (e.g., a CTA button) */}
      {children && (
        <div className="mt-2">
          {children}
        </div>
      )}
    </div>
  );
}