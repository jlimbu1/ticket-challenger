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
          background: 'radial-gradient(ellipse at center, rgba(139, 0, 0, 0.4) 0%, transparent 70%)',
        }}
      />

      {/* Skull decorative element - top left */}
      <div className="absolute top-2 left-2 text-crimson/20 text-4xl select-none" aria-hidden="true">
        &#9760;
      </div>

      {/* Rose decorative element - bottom right */}
      <div className="absolute bottom-2 right-2 text-crimson/20 text-3xl select-none" aria-hidden="true">
        &#127801;
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-16">
        {/* Error code badge */}
        {errorCode !== 'DEFAULT' && (
          <div className="mb-4 inline-block px-4 py-1 text-xs font-heading tracking-widest uppercase border border-crimson/50 text-crimson bg-crimson/10 rounded-full">
            {errorCode}
          </div>
        )}

        {/* Dramatic title */}
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2 tracking-wide">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl font-heading text-crimson mb-4 italic">
          {errorInfo.subtitle}
        </p>

        {/* Description */}
        <p className="text-gray-400 font-body text-lg max-w-md mb-8 leading-relaxed">
          {displayMessage}
        </p>

        {/* Retry button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-8 py-3 bg-crimson hover:bg-crimson-hover text-white font-heading tracking-wider uppercase text-sm transition-all duration-300 border border-crimson/50 hover:border-crimson shadow-lg hover:shadow-crimson/30"
            aria-label="Try again"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;