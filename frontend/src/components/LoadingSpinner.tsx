import React from 'react';
import '../styles/theme.css';
import '../styles/animations.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message = 'The needle finds the groove...',
}) => {
  const sizeClass = `loading-spinner--${size}`;

  return (
    <div className={`loading-spinner ${sizeClass}`} role="status" aria-label="Loading">
      <div className="loading-spinner-vinyl" aria-hidden="true">
        <div className="vinyl-record">
          <div className="vinyl-label" />
          <div className="vinyl-grooves" />
        </div>
        <div className="tonearm" />
      </div>
      <p className="loading-spinner-message">{message}</p>
      <span className="sr-only">Loading content</span>
    </div>
  );
};

export default LoadingSpinner;