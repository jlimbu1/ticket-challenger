import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

const SIZE_MAP = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-28 h-28',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  className = '',
}) => {
  const sizeClass = SIZE_MAP[size];

  return (
    <div
      data-testid="loading-spinner"
      className={`flex flex-col items-center justify-center text-center px-6 py-16 ${className}`}
      role="status"
      aria-label="Loading"
    >
      <div className={`relative ${sizeClass} mb-6`}>
        {/* Vinyl record outer ring */}
        <div
          className="absolute inset-0 rounded-full border-4 border-gray-800"
          style={{ boxShadow: '0 0 15px rgba(139, 0, 0, 0.3)' }}
        />
        {/* Vinyl record body with spinning animation */}
        <div
          className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-vinyl-spin motion-reduce:animate-none"
          style={{ willChange: 'transform' }}
        >
          {/* Record grooves */}
          <div className="absolute inset-4 rounded-full border border-gray-700/50" />
          <div className="absolute inset-8 rounded-full border border-gray-700/30" />
          <div className="absolute inset-10 rounded-full border border-gray-700/20" />
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-crimson/80 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-black" />
            </div>
          </div>
        </div>
      </div>
      {message && (
        <p className="text-lg text-text-muted font-body italic">
          {message}
        </p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;