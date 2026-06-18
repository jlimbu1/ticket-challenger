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
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage = getRandomErrorMessage();

      return (
        <div
          role="alert"
          className={cn(
            "flex min-h-[400px] flex-col items-center justify-center gap-6 p-8",
            "bg-gradient-to-b from-gothic-900 via-gothic-800 to-gothic-900",
            "border-2 border-crimson/30 shadow-crimson",
            this.props.className
          )}
        >
          {/* Dramatic album-cover-style header */}
          <div className="relative flex items-center justify-center" aria-hidden="true">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-crimson/50 bg-gothic-900 shadow-lg">
              <span className="text-4xl text-crimson">&#9760;</span>
            </div>
            <div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-rose/40">
              <span className="text-sm text-rose-light">&#10013;</span>
            </div>
          </div>

          {/* Dramatic typography */}
          <div className="space-y-2 text-center">
            <h2 className="font-serif text-3xl font-bold tracking-wider text-crimson">
              ERROR
            </h2>
            <p className="max-w-md font-serif text-lg italic text-gothic-300">
              &ldquo;{errorMessage}&rdquo;
            </p>
          </div>

          {/* Error details */}
          {this.state.error && (
            <details className="w-full max-w-md rounded border border-gothic-700 bg-gothic-900/80 p-4">
              <summary className="cursor-pointer font-serif text-sm text-gothic-400 hover:text-gothic-200">
                Technical details for the brave
              </summary>
              <pre className="mt-2 overflow-x-auto text-xs text-gothic-500">
                {this.state.error.message}
              </pre>
            </details>
          )}

          {/* Reset button */}
          <button
            onClick={this.handleReset}
            className={cn(
              "rounded-md border border-crimson bg-crimson/20 px-6 py-3",
              "font-serif text-lg font-semibold text-gothic-50",
              "transition-all duration-300 ease-in-out",
              "hover:bg-crimson/40 hover:shadow-crimson",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-gothic-900"
            )}
          >
            Attempt the Ritual Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}