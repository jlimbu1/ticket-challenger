import React from 'react';

interface VinylSpinnerProps {
  size?: number;
  className?: string;
}

const VinylSpinner: React.FC<VinylSpinnerProps> = ({ size = 80, className = '' }) => {
  const centerSize = size * 0.2;
  const labelSize = size * 0.08;
  const grooveCount = 6;

  return (
    <div
      className={`vinyl-spinner ${className}`}
      role="status"
      aria-label="Loading"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 30%, #1a1a1a 60%, #333 100%)',
        boxShadow: `0 0 20px rgba(139, 0, 0, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.5)`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'vinylSpin 2s linear infinite',
        flexShrink: 0,
      }}
    >
      <style>{`
        @keyframes vinylSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .vinyl-spinner {
            animation: none !important;
          }
        }
      `}</style>

      {Array.from({ length: grooveCount }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: size - (i + 1) * (size * 0.08),
            height: size - (i + 1) * (size * 0.08),
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            pointerEvents: 'none',
          }}
        />
      ))}

      <div
        style={{
          width: centerSize,
          height: centerSize,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #333 0%, #1a1a1a 100%)',
          border: '2px solid #8B0000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: labelSize,
            height: labelSize,
            borderRadius: '50%',
            background: '#8B0000',
          }}
        />
      </div>
    </div>
  );
};

export default VinylSpinner;