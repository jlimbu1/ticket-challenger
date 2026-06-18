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
          className={cn(
            "fixed inset-0 z-50 flex flex-col items-center justify-center gap-8",
            "bg-gradient-to-b from-gothic-900 via-gothic-800 to-gothic-900",
            "p-8 text-center",
            this.props.className
          )}
          role="alert"
          aria-live="assertive"
        >
          {/* Dramatic skull/rose decorative element */}
          <div className="relative" aria-hidden="true">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-crimson/60 bg-gothic-800 shadow-crimson">
              <span className="text-5xl text-crimson">&#9760;</span>
            </div>
            <div className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose/40">
              <span className="text-lg text-rose-light">&#10022;</span>
            </div>
          </div>

          {/* Dramatic typography */}
          <div className="max-w-lg space-y-4">
            <h2 className="font-unifraktur text-4xl text-crimson md:text-5xl">
              Catastrophe
            </h2>
            <p className="font-serif text-xl text-gothic-200">
              {errorMessage}
            </p>
            {this.state.error && (
              <details className="mx-auto max-w-md">
                <summary className="cursor-pointer font-serif text-sm text-gothic-400 hover:text-gothic-200">
                  Technical details for the brave
                </summary>
                <pre className="mt-2 overflow-auto rounded border border-gothic-700 bg-gothic-900 p-4 text-left font-mono text-xs text-gothic-400">
                  {this.state.error.message}
                  {"\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              onClick={this.handleReset}
              className={cn(
                "rounded-md border border-crimson bg-crimson px-6 py-3",
                "font-serif text-lg font-semibold text-gothic-50",
                "transition-all duration-300 ease-in-out",
                "hover:bg-crimson-light hover:shadow-crimson",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-gothic-900"
              )}
            >
              Attempt the Ritual Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className={cn(
                "rounded-md border border-gothic-600 bg-transparent px-6 py-3",
                "font-serif text-lg font-semibold text-gothic-200",
                "transition-all duration-300 ease-in-out",
                "hover:bg-gothic-700 hover:border-gothic-500",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gothic-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gothic-900"
              )}
            >
              Return from the Void
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}