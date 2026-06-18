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
            "border border-crimson/40 bg-gothic-900/50 shadow-gothic",
            "rounded-lg min-h-[300px]",
            this.props.className
          )}
        >
          <div className="relative flex items-center justify-center" aria-hidden="true">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-crimson/60 bg-gothic-800">
              <span className="text-4xl text-crimson">&#9760;</span>
            </div>
            <div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-rose/40">
              <span className="text-sm text-white">!</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-gothic text-2xl font-bold tracking-wider text-crimson">
              A Dark Omen
            </h2>
            <p className="max-w-md font-serif text-lg italic text-gothic-300">
              {errorMessage}
            </p>
          </div>

          <button
            onClick={this.handleReset}
            className={cn(
              "px-6 py-3 font-gothic text-sm font-bold uppercase tracking-widest",
              "border border-crimson/60 bg-gothic-800 text-crimson",
              "hover:bg-crimson hover:text-white hover:shadow-gothic",
              "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-crimson/60"
            )}
            type="button"
          >
            Attempt the Ritual Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}