import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    console.error(
      'ErrorBoundary caught an error:',
      error,
      errorInfo
    );
  }

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage = this.state.error?.message || 'An unknown error occurred';
      const errorStack = this.state.error?.stack || '';
      const componentStack = this.state.errorInfo?.componentStack || '';

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-gradient-to-b from-gray-900 to-black border-2 border-crimson rounded-lg overflow-hidden shadow-2xl shadow-crimson/30">
            <div className="relative p-8">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-crimson via-deepPurple to-crimson" />
              
              <div className="text-center mb-8">
                <div className="text-6xl mb-4 opacity-30 select-none">&#9835;</div>
                <h1 className="text-4xl font-gothic text-crimson mb-2 tracking-wider uppercase">
                  The Record Skips
                </h1>
                <p className="text-gray-400 font-gothic text-lg italic">
                  Something went wrong in the symphony
                </p>
              </div>

              <div className="bg-black/50 border border-crimson/30 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-crimson text-xl mt-0.5">&#9888;</span>
                  <div>
                    <h2 className="text-crimson font-gothic text-lg tracking-wider uppercase mb-1">
                      Error Details
                    </h2>
                    <p className="text-gray-300 font-mono text-sm break-all">
                      {errorMessage}
                    </p>
                  </div>
                </div>

                {(errorStack || componentStack) && (
                  <details className="mt-4">
                    <summary className="text-gray-500 font-gothic text-sm tracking-wider cursor-pointer hover:text-crimson transition-colors duration-300">
                      View the full tragedy
                    </summary>
                    <div className="mt-3 space-y-3">
                      {errorStack && (
                        <div>
                          <p className="text-gray-500 font-gothic text-xs tracking-wider uppercase mb-1">
                            Error Stack
                          </p>
                          <pre className="text-gray-400 font-mono text-xs whitespace-pre-wrap break-all bg-black/50 p-3 rounded border border-gray-800 max-h-40 overflow-y-auto">
                            {errorStack}
                          </pre>
                        </div>
                      )}
                      {componentStack && (
                        <div>
                          <p className="text-gray-500 font-gothic text-xs tracking-wider uppercase mb-1">
                            Component Stack
                          </p>
                          <pre className="text-gray-400 font-mono text-xs whitespace-pre-wrap break-all bg-black/50 p-3 rounded border border-gray-800 max-h-40 overflow-y-auto">
                            {componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={this.handleReset}
                  className="px-8 py-3 bg-gradient-to-r from-crimson to-deepPurple text-white font-gothic tracking-wider uppercase rounded-md transition-all duration-300 ease-out hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 focus:ring-offset-black"
                >
                  Try Again
                </button>
                <p className="text-gray-600 font-gothic text-xs tracking-wider italic">
                  &quot;This is not a failure, but a dramatic pause.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;