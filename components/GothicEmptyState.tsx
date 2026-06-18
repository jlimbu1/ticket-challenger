"use client";

import { cn } from "@/lib/utils";
import ThemedButton from "@/components/ThemedButton";

interface GothicEmptyStateProps {
  title?: string;
  message?: string;
  className?: string;
  children?: React.ReactNode;
  onAction?: () => void;
  actionLabel?: string;
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
  onAction,
  actionLabel = "Return",
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
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gothic-200">{title}</h3>
        <p className="text-sm text-gothic-400 italic">{displayMessage}</p>
      </div>
      {children && <div className="w-full">{children}</div>}
      {onAction && (
        <ThemedButton onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </ThemedButton>
      )}
    </div>
  );
}