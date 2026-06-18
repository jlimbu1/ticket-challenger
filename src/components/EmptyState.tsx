import React from 'react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const DEFAULT_POETIC_MESSAGES = [
  'The shelf stands empty, waiting for your collection.',
  'Silence echoes in these hollow halls.',
  'No records spin in this forgotten corner.',
  'The jukebox weeps for songs not yet chosen.',
  'A blank page in the book of melodies.',
  'The stage is dark, the crowd has gone.',
  'These halls remember songs that never played.',
  'A ghost of music lingers in the air.',
  'The needle waits for a groove to find.',
  'Every masterpiece begins with an empty canvas.',
];

const getRandomPoeticMessage = (): string => {
  return DEFAULT_POETIC_MESSAGES[Math.floor(Math.random() * DEFAULT_POETIC_MESSAGES.length)];
};

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'The shelves are bare',
  message,
  icon,
  action,
  className = '',
}) => {
  const poeticMessage = message || getRandomPoeticMessage();

  return (
    <div
      data-testid="empty-state"
      className={`flex flex-col items-center justify-center text-center px-6 py-16 ${className}`}
      role="status"
      aria-label="Empty state"
    >
      {icon ? (
        <div className="mb-6 text-crimson opacity-60">{icon}</div>
      ) : (
        <div className="mb-6 relative w-24 h-24">
          <div
            className="w-full h-full rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(139,0,0,0.2) 0%, transparent 70%)',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-crimson/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
        </div>
      )}
      <h3 className="font-heading text-2xl text-parchment-white mb-3 tracking-wide">
        {title}
      </h3>
      <p className="font-body text-lg text-text-muted max-w-md italic leading-relaxed">
        {poeticMessage}
      </p>
      {action && (
        <div className="mt-8">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;