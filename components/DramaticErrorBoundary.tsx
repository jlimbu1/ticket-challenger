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
    console.error(
      "[DramaticErrorBoundary] Caught an error:",
      error.message,
      error.stack,
      errorInfo.componentStack
    );

    if (typeof window !== "undefined" && window.onerror) {
      window.onerror(
        error.message,
        undefined,
        undefined,
        undefined,
        error
      );
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage = this.state.error
        ? this.state.error.message
        : getRandomErrorMessage();

      return (
        <div
          role="alert"
          className={cn(
            "flex flex-col items-center justify-center gap-6 p-8 text-center",
            "min-h-[300px] bg-gothic-950 border border-crimson/30",
            "rounded-lg shadow-gothic",
            this.props.className
          )}
        >
          <div className="relative" aria-hidden="true">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-crimson/50 bg-gothic-900">
              <span className="text-4xl text-crimson">&#9760;</span>
            </div>
            <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-crimson/20">
              <span className="text-lg text-crimson">&#9888;</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-wider text-crimson">
              RITUAL INTERRUPTED
            </h2>
            <p className="max-w-md text-gothic-300 text-sm leading-relaxed">
              {errorMessage}
            </p>
          </div>

          <button
            onClick={this.handleReset}
            className={cn(
              "px-6 py-2 rounded-md border border-crimson/40",
              "bg-gothic-900 text-crimson hover:bg-crimson/10",
              "transition-colors duration-300 focus:outline-none",
              "focus:ring-2 focus:ring-crimson/50 focus:ring-offset-2",
              "focus:ring-offset-gothic-950"
            )}
            aria-label="Try again"
          >
            Attempt the Ritual Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}