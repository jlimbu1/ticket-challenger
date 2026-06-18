import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = (): void => {
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

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-gradient-to-b from-gray-900 to-black border-2 border-crimson rounded-lg overflow-hidden shadow-[0_0_30px_rgba(139,0,0,0.3)]">
            {/* Album cover header */}
            <div className="relative h-48 bg-gradient-to-r from-crimson via-deep-purple to-black flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-4 w-16 h-16 border border-crimson rounded-full" />
                <div className="absolute bottom-4 right-4 w-24 h-24 border border-deep-purple rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-gray-700 rounded-full" />
              </div>
              <div className="relative z-10 text-center">
                <h2 className="text-5xl font-heading text-white tracking-widest mb-2">
                  The End.
                </h2>
                <p className="text-gray-400 text-sm italic font-serif">
                  Something went wrong
                </p>
              </div>
            </div>

            {/* Error details */}
            <div className="p-8 space-y-6">
              <div className="bg-gray-900 border border-gray-700 rounded p-4">
                <p className="text-crimson font-heading text-sm tracking-wider mb-2">
                  ERROR LOG
                </p>
                <p className="text-gray-300 font-mono text-sm break-all">
                  {this.state.error?.message || 'An unknown error occurred'}
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={this.handleReset}
                  className="px-8 py-3 bg-crimson hover:bg-red-900 text-white font-heading font-bold tracking-wider uppercase border-2 border-crimson transition-all duration-300 ease-in-out hover:shadow-[0_0_15px_rgba(139,0,0,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-crimson"
                >
                  Try Again
                </button>
              </div>

              <p className="text-center text-gray-500 text-xs italic font-serif">
                "Every saint has a past, and every sinner has a future."
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}