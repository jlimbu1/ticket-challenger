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

      return (
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-6 p-8 text-center",
            "border border-gothic-700 bg-gothic-900/50 shadow-gothic",
            "rounded-lg",
            this.props.className
          )}
          role="alert"
        >
          <div className="relative flex items-center justify-center" aria-hidden="true">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-crimson/40 bg-gothic-800">
              <span className="text-3xl text-crimson/60">&#9760;</span>
            </div>
            <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose/30">
              <span className="text-xs text-rose">!</span>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="font-gothic text-2xl font-bold tracking-wider text-crimson">
              A Dark Omen
            </h2>
            <p className="max-w-md font-mono text-sm text-gothic-300">
              {getRandomErrorMessage()}
            </p>
            {this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer font-mono text-xs text-gothic-500 hover:text-gothic-300">
                  View technical details
                </summary>
                <pre className="mt-2 max-h-32 overflow-auto rounded bg-gothic-950 p-2 text-left font-mono text-xs text-gothic-400">
                  {this.state.error.message}
                  {"\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
          <button
            onClick={this.handleReset}
            className={cn(
              "rounded border border-crimson/40 bg-gothic-800 px-6 py-2",
              "font-mono text-sm text-crimson transition-all duration-300",
              "hover:bg-crimson/20 hover:shadow-gothic-crimson",
              "focus:outline-none focus:ring-2 focus:ring-crimson/50"
            )}
          >
            Attempt to Restore the Ritual
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}