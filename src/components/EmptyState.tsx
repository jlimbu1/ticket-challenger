import React from 'react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'The shelves are bare',
  message = 'But the music plays on...',
  icon,
  action,
  className = '',
}) => {
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
              boxShadow: '0 0 15px rgba(139, 0, 0, 0.2)',
            }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black border-2 border-crimson" />
          </div>
        </div>
      )}
      <h3 className="text-2xl font-gothic text-crimson mb-2 tracking-wider">
        {title}
      </h3>
      <p className="text-lg text-gray-400 font-serif italic max-w-md">
        {message}
      </p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;