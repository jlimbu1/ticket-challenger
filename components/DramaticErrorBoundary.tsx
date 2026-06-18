"use client";

import { Component, ReactNode, ErrorInfo } from "react";
import { cn } from "@/lib/utils";
import ThemedButton from "@/components/ThemedButton";

interface DramaticErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  onRetry?: () => void;
}

interface DramaticErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

const errorMessages = [
  "The ritual has been interrupted by an otherworldly force.",
  "A tear in the fabric of reality has caused a system failure.",
  "The spirits are restless — an unexpected error has occurred.",
  "The black parade has encountered a disturbance in the void.",
  "A dark omen: something has gone terribly wrong.",
];

function getRandomErrorMessage(): string {
  return errorMessages[Math.floor(Math.random() * errorMessages.length)];
}

function getErrorMessage(error: Error): string {
  if (error.message) {
    return error.message;
  }
  return getRandomErrorMessage();
}

function reportError(error: Error, errorInfo: ErrorInfo): void {
  try {
    if (typeof window !== "undefined" && window.fetch) {
      const payload = {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };
      window.fetch("/api/log-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {
        // Silently fail — logging is best-effort
      });
    }
  } catch {
    // Silently fail — logging is best-effort
  }
}

export default class DramaticErrorBoundary extends Component<
  DramaticErrorBoundaryProps,
  DramaticErrorBoundaryState
> {
  constructor(props: DramaticErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): DramaticErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    reportError(error, errorInfo);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage = this.state.error
        ? getErrorMessage(this.state.error)
        : getRandomErrorMessage();

      return (
        <div
          role="alert"
          className={cn(
            "flex flex-col items-center justify-center gap-6 p-8 text-center",
            "border border-crimson/40 bg-gothic-900/50 shadow-gothic",
            "rounded-lg",
            this.props.className
          )}
        >
          <div className="relative flex items-center justify-center" aria-hidden="true">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-crimson bg-gothic-800">
              <span className="text-4xl text-crimson">&#9762;</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-crimson">
              A Dark Omen
            </h2>
            <p className="max-w-md font-mono text-sm text-gothic-300">
              {errorMessage}
            </p>
          </div>

          <div className="flex gap-4">
            <ThemedButton
              variant="primary"
              size="md"
              onClick={this.handleRetry}
            >
              Attempt the Ritual Again
            </ThemedButton>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}