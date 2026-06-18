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

      const errorMessage = this.state.error?.message || getRandomErrorMessage();

      return (
        <div
          role="alert"
          className={cn(
            "flex flex-col items-center justify-center gap-6 p-12 text-center",
            "min-h-[400px] bg-gothic-950 border border-crimson/30",
            "rounded-lg shadow-gothic",
            this.props.className
          )}
        >
          <div className="relative" aria-hidden="true">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-crimson/50 bg-gothic-900">
              <span className="text-4xl text-crimson">&#9760;</span>
            </div>
            <div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-crimson/20">
              <span className="text-lg text-crimson">&#9888;</span>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-crimson tracking-wider uppercase">
              Ritual Interrupted
            </h2>
            <p className="text-gothic-300 text-lg max-w-md mx-auto leading-relaxed">
              {errorMessage}
            </p>
          </div>

          <button
            onClick={this.handleReset}
            className={cn(
              "px-8 py-3 rounded-md font-semibold tracking-wider uppercase",
              "bg-crimson text-white hover:bg-crimson/80",
              "transition-all duration-300 border border-crimson/50",
              "shadow-lg hover:shadow-crimson/20"
            )}
            type="button"
          >
            Attempt the Ritual Again
          </button>

          {this.state.error && (
            <details className="w-full max-w-md mt-4">
              <summary className="text-gothic-400 text-sm cursor-pointer hover:text-gothic-300 transition-colors">
                Technical Details
              </summary>
              <pre className="mt-2 p-4 bg-gothic-950 border border-gothic-800 rounded text-xs text-gothic-400 overflow-auto max-h-32 text-left">
                {this.state.error.stack || this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}