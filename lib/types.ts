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
      const errorMessage = getRandomErrorMessage();
      return (
        <div
          className={cn(
            "flex flex-col items-center justify-center min-h-[400px] p-8",
            "bg-gothic-950 border border-crimson/30 rounded-lg",
            "shadow-gothic text-center",
            this.props.className
          )}
          role="alert"
        >
          <div className="mb-6 text-6xl text-crimson/60" aria-hidden="true">
            &#9760;
          </div>
          <h2 className="text-2xl font-bold text-crimson mb-4 font-gothic">
            A Dark Omen
          </h2>
          <p className="text-gray-300 mb-6 max-w-md">
            {errorMessage}
          </p>
          {this.props.fallback ? (
            this.props.fallback
          ) : (
            <button
              onClick={this.handleReset}
              className={cn(
                "px-6 py-3 bg-crimson text-white font-bold rounded-md",
                "hover:bg-crimson/80 transition-colors duration-300",
                "focus:outline-none focus:ring-2 focus:ring-crimson/50"
              )}
            >
              Attempt the Ritual Again
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}