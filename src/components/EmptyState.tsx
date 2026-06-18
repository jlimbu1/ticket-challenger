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
              background: 'conic-gradient(from 0deg, #8B0000 0deg 45deg, transparent 45deg 90deg, #8B0000 90deg 135deg, transparent 135deg 180deg, #8B0000 180deg 225deg, transparent 225deg 270deg, #8B0000 270deg 315deg, transparent 315deg 360deg)',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl text-crimson opacity-40">&#9835;</span>
          </div>
        </div>
      )}
      <h3 className="font-heading text-2xl text-parchment-white mb-3 tracking-wide">
        {title}
      </h3>
      <p className="font-body text-lg text-text-muted italic max-w-md leading-relaxed">
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