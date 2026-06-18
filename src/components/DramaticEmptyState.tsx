import React from 'react';

interface DramaticEmptyStateProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const DramaticEmptyState: React.FC<DramaticEmptyStateProps> = ({
  title = 'The shelves are bare, like a forgotten attic',
  subtitle = 'No records to be found in this haunted collection...',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[400px] px-6 py-12 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="relative mb-8">
        <div
          className="w-24 h-24 rounded-full opacity-30 animate-pulse"
          style={{
            background: 'radial-gradient(circle, #8B0000 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="text-4xl opacity-40 select-none">&#9765;</span>
        </div>
      </div>

      <h2
        className="text-2xl md:text-3xl font-gothic text-crimson text-center mb-4 leading-relaxed"
        style={{
          textShadow: '0 0 20px rgba(139, 0, 0, 0.3)',
        }}
      >
        {title}
      </h2>

      <p
        className="text-lg text-gray-400 text-center max-w-md font-serif italic"
        style={{
          textShadow: '0 0 10px rgba(74, 0, 130, 0.2)',
        }}
      >
        {subtitle}
      </p>

      <div
        className="mt-8 w-32 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, #8B0000, transparent)',
        }}
      />
    </div>
  );
};

export default DramaticEmptyState;