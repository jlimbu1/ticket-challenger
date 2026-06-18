import React from 'react';

interface EmptyStateProps {
  message?: string;
  icon?: 'skull' | 'rose' | 'none';
  className?: string;
}

const SKULL_ICON = (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="50" cy="45" r="35" fill="#8B0000" opacity="0.3" />
    <circle cx="35" cy="40" r="6" fill="#1a1a1a" />
    <circle cx="65" cy="40" r="6" fill="#1a1a1a" />
    <path d="M40 58 Q50 68 60 58" stroke="#8B0000" strokeWidth="2" fill="none" strokeLinecap="round" />
    <rect x="45" y="70" width="10" height="8" rx="2" fill="#1a1a1a" />
    <rect x="42" y="78" width="16" height="4" rx="2" fill="#1a1a1a" />
  </svg>
);

const ROSE_ICON = (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="50" cy="50" r="20" fill="#8B0000" opacity="0.4" />
    <circle cx="50" cy="50" r="14" fill="#8B0000" opacity="0.3" />
    <circle cx="50" cy="50" r="8" fill="#8B0000" opacity="0.2" />
    <path d="M50 30 L50 70" stroke="#4A0082" strokeWidth="2" strokeLinecap="round" />
    <path d="M30 50 L70 50" stroke="#4A0082" strokeWidth="2" strokeLinecap="round" />
    <path d="M35 35 L65 65" stroke="#4A0082" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M65 35 L35 65" stroke="#4A0082" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const DEFAULT_MESSAGE = 'The shelves are empty, but the echoes remain...';

const EmptyState: React.FC<EmptyStateProps> = ({
  message = DEFAULT_MESSAGE,
  icon = 'skull',
  className = '',
}) => {
  const iconElement = icon === 'none' ? null : icon === 'rose' ? ROSE_ICON : SKULL_ICON;

  return (
    <div
      className={`empty-state ${className}`}
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        textAlign: 'center',
        gap: '1.5rem',
        minHeight: '200px',
      }}
    >
      {iconElement && (
        <div
          aria-hidden="true"
          style={{
            width: '80px',
            height: '80px',
            opacity: 0.6,
          }}
        >
          {iconElement}
        </div>
      )}
      <p
        style={{
          fontFamily: "'Playfair Display', 'Georgia', serif",
          fontSize: '1.25rem',
          color: '#8B0000',
          fontStyle: 'italic',
          letterSpacing: '0.05em',
          lineHeight: 1.6,
          maxWidth: '400px',
          margin: 0,
        }}
      >
        {message}
      </p>
    </div>
  );
};

export default EmptyState;