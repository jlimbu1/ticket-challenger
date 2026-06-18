"use client";

import { Component, ReactNode, ErrorInfo } from "react";
import { cn } from "@/lib/utils";

interface DramaticErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
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
        console.warn("Failed to report error to server");
      });
    }
  } catch {
    console.warn("Failed to report error to server");
  }
}

export default class DramaticErrorBoundary extends Component<
  DramaticErrorBoundaryProps,
  DramaticErrorBoundaryState
> {
  constructor(props: DramaticErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): DramaticErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    reportError(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
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
            "border border-crimson/30 bg-gothic-900/80 shadow-gothic",
            "rounded-lg min-h-[300px]",
            this.props.className
          )}
        >
          <div className="relative flex items-center justify-center" aria-hidden="true">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-crimson/50 bg-gothic-800">
              <span className="text-4xl text-crimson">&#9760;</span>
            </div>
            <div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-rose/40">
              <span className="text-lg text-white">!</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-creepster text-2xl text-crimson tracking-wider">
              Ritual Interrupted
            </h2>
            <p className="font-gothic text-lg text-gothic-300 max-w-md">
              {errorMessage}
            </p>
          </div>

          <button
            onClick={this.handleRetry}
            className={cn(
              "px-6 py-3 rounded-md font-semibold text-lg",
              "bg-crimson text-white hover:bg-crimson/80",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-crimson/50 focus:ring-offset-2 focus:ring-offset-gothic-900"
            )}
            aria-label="Retry loading the page"
          >
            Attempt the Ritual Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}