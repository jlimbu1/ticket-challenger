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
              boxShadow: '0 0 15px rgba(139, 0, 0, 0.2), inset 0 0 8px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"
              style={{
                width: '30%',
                height: '30%',
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.8), inset 0 0 3px rgba(139, 0, 0, 0.3)',
              }}
            />
          </div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-crimson opacity-40 rounded-full"
            style={{ transform: 'translate(-50%, -50%) rotate(45deg)' }}
          />
        </div>
      )}
      <h3 className="font-gothic text-2xl text-white mb-3 tracking-wider">{title}</h3>
      <p className="font-body text-gray-400 italic max-w-md leading-relaxed">
        {poeticMessage}
      </p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
};

export default EmptyState;