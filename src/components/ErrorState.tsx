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
      className={`relative overflow-hidden bg-gradient-to-br from-black via-[#0a0a0a] to-[#111111] border border-crimson/30 rounded-lg ${className}`}
      role="alert"
      aria-label="Error state"
    >
      {/* Dramatic gradient overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'linear-gradient(135deg, rgba(139,0,0,0.3) 0%, transparent 50%, rgba(74,0,130,0.2) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-16">
        {/* Error code badge */}
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-crimson/10 border-2 border-crimson/40">
          <span className="text-3xl font-heading font-black text-crimson tracking-wider">
            {errorCode === 'DEFAULT' ? '!' : errorCode}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-heading font-bold text-white mb-2 tracking-wide">
          {title}
        </h2>

        {/* Dramatic subtitle */}
        <p className="text-lg font-heading italic text-crimson/80 mb-4">
          {errorInfo.subtitle}
        </p>

        {/* Description */}
        <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
          {displayMessage}
        </p>

        {/* Retry button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-gradient-to-r from-crimson to-deepPurple text-white font-heading tracking-wider uppercase rounded-md transition-all duration-300 hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 focus:ring-offset-black"
          >
            Try Again
          </button>
        )}
      </div>

      {/* Decorative bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--color-crimson), var(--color-secondary), transparent)',
        }}
      />
    </div>
  );
};

export default ErrorState;