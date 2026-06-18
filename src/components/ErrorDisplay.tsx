import React from 'react';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = 'The Record Skips',
  message = 'Something went wrong. The music has stopped.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      data-testid="error-display"
      className={`relative flex flex-col items-center justify-center text-center px-6 py-16 overflow-hidden ${className}`}
      role="alert"
      aria-label="Error state"
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `
            linear-gradient(135deg, #8B0000 0%, transparent 50%),
            linear-gradient(225deg, #4A0082 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, #8B0000 0%, transparent 70%)
          `,
        }}
      />
      <div className="relative z-10 max-w-md">
        <div className="mb-6 relative w-32 h-32 mx-auto">
          <div
            className="w-full h-full rounded-full border-4 border-crimson opacity-40"
            style={{
              background: `conic-gradient(
                from 0deg,
                #1a1a1a 0deg 30deg,
                #2a2a2a 30deg 60deg,
                #1a1a1a 60deg 90deg,
                #2a2a2a 90deg 120deg,
                #1a1a1a 120deg 150deg,
                #2a2a2a 150deg 180deg,
                #1a1a1a 180deg 210deg,
                #2a2a2a 210deg 240deg,
                #1a1a1a 240deg 270deg,
                #2a2a2a 270deg 300deg,
                #1a1a1a 300deg 330deg,
                #2a2a2a 330deg 360deg
              )`,
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black border-2 border-crimson"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-crimson"
            aria-hidden="true"
          />
        </div>
        <h2 className="font-heading text-3xl md:text-4xl text-crimson mb-4 tracking-wider uppercase">
          {title}
        </h2>
        <p className="font-body text-lg text-text-muted mb-8 leading-relaxed">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="font-gothic tracking-wider uppercase px-6 py-3 bg-gradient-to-r from-crimson to-deepPurple text-white rounded-md transition-all duration-300 ease-out hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 focus:ring-offset-black"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;