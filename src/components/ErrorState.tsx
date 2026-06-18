import React from 'react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  errorCode?: string;
  onRetry?: () => void;
  className?: string;
}

const DRAMATIC_ERROR_MESSAGES: Record<string, { subtitle: string; description: string }> = {
  '404': {
    subtitle: 'Lost in the Void',
    description: 'The page you seek has vanished into the darkness, like a forgotten melody.',
  },
  '500': {
    subtitle: 'The Machine Weeps',
    description: 'Our instruments have fallen out of tune. The conductor is working to restore harmony.',
  },
  'NETWORK': {
    subtitle: 'Silent Frequencies',
    description: 'The signal has been lost to the static. Check your connection and try again.',
  },
  'DEFAULT': {
    subtitle: 'A Discordant Note',
    description: 'Something has gone awry in our symphony. The show must go on.',
  },
};

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Error',
  message,
  errorCode = 'DEFAULT',
  onRetry,
  className = '',
}) => {
  const errorInfo = DRAMATIC_ERROR_MESSAGES[errorCode] || DRAMATIC_ERROR_MESSAGES.DEFAULT;
  const displayMessage = message || errorInfo.description;

  return (
    <div
      data-testid="error-state"
      className={`relative overflow-hidden bg-gradient-to-br from-black via-[#0a0a0a] to-[#111111] border border-crimson/30 rounded-lg ${className}`}
      role="alert"
      aria-label="Error state"
    >
      {/* Dramatic gradient overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: 'linear-gradient(135deg, rgba(139,0,0,0.3) 0%, transparent 50%, rgba(74,0,130,0.3) 100%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center px-8 py-12 text-center">
        {/* Error code with dramatic styling */}
        <div className="mb-4">
          <span className="font-heading text-7xl font-black text-crimson opacity-80 select-none">
            {errorCode === 'DEFAULT' ? '!!' : errorCode}
          </span>
        </div>

        {/* Subtitle */}
        <h2 className="font-heading text-2xl font-bold text-white mb-2 tracking-wide">
          {errorInfo.subtitle}
        </h2>

        {/* Title */}
        <h3 className="font-heading text-lg font-semibold text-crimson-light mb-4 uppercase tracking-widest">
          {title}
        </h3>

        {/* Description */}
        <p className="font-body text-base text-text-muted max-w-md mb-6 leading-relaxed">
          {displayMessage}
        </p>

        {/* Retry button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="font-gothic tracking-wider uppercase px-6 py-2.5 text-sm rounded-md border border-crimson text-crimson hover:bg-crimson hover:text-white transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 focus:ring-offset-black"
            type="button"
          >
            Try Again
          </button>
        )}
      </div>

      {/* Decorative bottom border */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{
          background: 'linear-gradient(90deg, transparent, #8B0000, #4A0082, transparent)',
        }}
      />
    </div>
  );
};

export default ErrorState;