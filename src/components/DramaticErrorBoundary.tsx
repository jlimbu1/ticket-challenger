import React, { Component, ErrorInfo, ReactNode } from 'react';

interface DramaticErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface DramaticErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class DramaticErrorBoundary extends Component<DramaticErrorBoundaryProps, DramaticErrorBoundaryState> {
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
    console.error('[DramaticErrorBoundary] Uncaught error:', error);
    console.error('[DramaticErrorBoundary] Component stack:', errorInfo.componentStack);
  }

  private handleRetry = (): void => {
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
        <div
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a0000] p-8"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-lg w-full text-center">
            {/* Skull ASCII art */}
            <pre
              className="text-crimson text-xs leading-tight mb-6 select-none"
              aria-hidden="true"
            >
{`      .-.
     (o o)
     | O \\
     \\   \\
      '~~~'
   .-""""""-.
  /          \\
 |   RIP     |
 |   YOUR    |
 |   APP     |
  \\          /
   '-......-'
      |  |
      |  |
      |  |
     _|__|_
    (______)
`}
            </pre>

            <h2 className="text-3xl font-heading text-white mb-4">
              The Application Has Fallen
            </h2>

            <p className="text-text-muted mb-2">
              A catastrophic error has occurred. The spirits are restless.
            </p>

            {this.state.error && (
              <p className="text-crimson-light text-sm mb-6 font-mono">
                {this.state.error.message}
              </p>
            )}

            <button
              onClick={this.handleRetry}
              className="px-8 py-3 bg-crimson hover:bg-crimson-hover text-white font-heading text-lg
                         transition-all duration-300 border border-crimson-light/30
                         hover:shadow-[0_0_20px_rgba(139,0,0,0.5)]
                         motion-safe:hover:scale-105"
              type="button"
            >
              Attempt Resurrection
            </button>

            <p className="text-text-muted text-xs mt-8">
              If the error persists, consult the ancient tomes (console).
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DramaticErrorBoundary;