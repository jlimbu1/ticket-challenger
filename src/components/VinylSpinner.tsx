import React from 'react';

interface VinylSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeMap: Record<string, string> = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-32 h-32',
};

const labelSizeMap: Record<string, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const VinylSpinner: React.FC<VinylSpinnerProps> = ({
  size = 'md',
  className = '',
  label = 'Spinning the record...',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-label={label}
    >
      <div
        className={`
          relative rounded-full
          animate-spin
          ${sizeMap[size]}
        `}
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
          boxShadow: '0 0 20px rgba(139, 0, 0, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"
          style={{
            width: '40%',
            height: '40%',
            boxShadow: 'inset 0 0 5px rgba(139, 0, 0, 0.5)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '15%',
            height: '15%',
            background: 'radial-gradient(circle, #8B0000 0%, #4A0082 100%)',
            boxShadow: '0 0 10px rgba(139, 0, 0, 0.8)',
          }}
        />
      </div>
      {label && (
        <span
          className={`font-gothic text-crimson ${labelSizeMap[size]}`}
          style={{
            textShadow: '0 0 10px rgba(139, 0, 0, 0.5)',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default VinylSpinner;