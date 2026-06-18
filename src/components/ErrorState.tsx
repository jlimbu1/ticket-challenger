import React from 'react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const DEFAULT_MESSAGE = 'The ritual has failed. Darkness consumes all...';

const ErrorState: React.FC<ErrorStateProps> = ({
  message = DEFAULT_MESSAGE,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`error-state ${className}`}
      role="alert"
      aria-live="assertive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        border: '2px solid #8B0000',
        borderRadius: '8px',
        boxShadow: '0 0 30px rgba(139, 0, 0, 0.2), inset 0 0 60px rgba(0, 0, 0, 0.6)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '200px',
        textAlign: 'center',
      }}
    >
      {/* Distressed texture overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(139, 0, 0, 0.1) 2px,
              rgba(139, 0, 0, 0.1) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 3px,
              rgba(139, 0, 0, 0.1) 3px,
              rgba(139, 0, 0, 0.1) 6px
            )
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Album cover style decorative border */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          right: '8px',
          bottom: '8px',
          border: '1px solid rgba(139, 0, 0, 0.3)',
          borderRadius: '4px',
          pointerEvents: 'none',
        }}
      />

      {/* Error icon - dramatic skull */}
      <div
        aria-hidden="true"
        style={{
          width: '64px',
          height: '64px',
          marginBottom: '1.5rem',
          opacity: 0.6,
        }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
          <circle cx="50" cy="45" r="35" fill="#8B0000" opacity="0.4" />
          <circle cx="35" cy="40" r="6" fill="#8B0000" />
          <circle cx="65" cy="40" r="6" fill="#8B0000" />
          <path d="M40 58 Q50 68 60 58" stroke="#8B0000" strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x="45" y="70" width="10" height="8" rx="2" fill="#8B0000" />
          <rect x="42" y="78" width="16" height="4" rx="2" fill="#8B0000" />
        </svg>
      </div>

      {/* Error message */}
      <p
        style={{
          color: '#8B0000',
          fontFamily: "'Playfair Display', 'Georgia', serif",
          fontSize: '1.25rem',
          fontWeight: 700,
          lineHeight: 1.6,
          margin: 0,
          maxWidth: '400px',
          textShadow: '0 0 10px rgba(139, 0, 0, 0.3)',
        }}
      >
        {message}
      </p>

      {/* Retry button */}
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem 2rem',
            background: 'linear-gradient(135deg, #8B0000 0%, #4A0082 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 15px rgba(139, 0, 0, 0.3)',
            letterSpacing: '1px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 25px rgba(139, 0, 0, 0.5)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 15px rgba(139, 0, 0, 0.3)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Attempt the Ritual Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;