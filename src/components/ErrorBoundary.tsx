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
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
          <div className="max-w-lg w-full bg-gradient-to-b from-darkGray to-black border-2 border-crimson rounded-lg overflow-hidden shadow-2xl shadow-crimson/30">
            <div className="relative p-8 text-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-crimson via-deepPurple to-crimson" />
              
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-crimson to-deepPurple flex items-center justify-center animate-pulse">
                  <span className="text-4xl text-white font-gothic">!</span>
                </div>
              </div>

              <h2 className="text-3xl font-gothic font-bold text-crimson mb-2">
                The Record Skips
              </h2>
              
              <p className="text-gray-400 font-body mb-6 italic">
                Something went wrong in the darkness...
              </p>

              <div className="bg-black/50 border border-crimson/30 rounded p-4 mb-6 text-left">
                <p className="text-crimson text-sm font-mono mb-2">
                  Error: {errorMessage}
                </p>
                {errorStack && (
                  <details className="mt-2">
                    <summary className="text-gray-500 text-xs cursor-pointer hover:text-gray-300">
                      View technical details
                    </summary>
                    <pre className="mt-2 text-xs text-gray-500 font-mono overflow-auto max-h-32 whitespace-pre-wrap">
                      {errorStack}
                      {componentStack && `\n\nComponent Stack:\n${componentStack}`}
                    </pre>
                  </details>
                )}
              </div>

              <button
                onClick={this.handleReset}
                className="font-gothic tracking-wider uppercase px-8 py-3 bg-gradient-to-r from-crimson to-deepPurple text-white rounded-md transition-all duration-300 hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 focus:ring-offset-black"
              >
                Try Again
              </button>
            </div>

            <div className="border-t border-crimson/20 px-8 py-4 bg-black/50">
              <p className="text-gray-600 text-xs text-center font-body">
                If this persists, the ritual may need to be performed again
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;