import React from 'react';

interface VinylSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeMap = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-32 h-32',
};

const innerSizeMap = {
  sm: 'w-4 h-4',
  md: 'w-7 h-7',
  lg: 'w-11 h-11',
};

export function VinylSpinner({ size = 'md', className = '', label }: VinylSpinnerProps) {
  const outerSize = sizeMap[size];
  const innerSize = innerSizeMap[size];

  return (
    <div
      role="status"
      aria-label={label || 'Loading'}
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <div
        className={`relative ${outerSize} rounded-full bg-black border-2 border-gray-700 animate-spin-vinyl flex items-center justify-center`}
      >
        {/* Vinyl grooves */}
        <div className="absolute inset-2 rounded-full border border-gray-600" />
        <div className="absolute inset-4 rounded-full border border-gray-500" />
        <div className="absolute inset-6 rounded-full border border-gray-400" />

        {/* Center label */}
        <div
          className={`relative ${innerSize} rounded-full bg-crimson flex items-center justify-center`}
        >
          <div className="w-1/2 h-1/2 rounded-full bg-black" />
        </div>
      </div>
      {label && (
        <p className="text-sm text-gray-400 font-serif italic tracking-wider">
          {label}
        </p>
      )}
    </div>
  );
}