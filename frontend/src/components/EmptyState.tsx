import React from 'react';
import '../styles/theme.css';
import '../styles/animations.css';

interface EmptyStateProps {
  message?: string;
  subtitle?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'The shelves are bare, but the echoes remain...',
  subtitle = 'Perhaps the records have found other homes. Check back when the moon is full.',
}) => {
  return (
    <div className="empty-state" role="status" aria-label="No products available">
      <div className="empty-state-artwork" aria-hidden="true">
        <div className="empty-state-vinyl">
          <div className="empty-state-vinyl-disc">
            <div className="empty-state-vinyl-label" />
            <div className="empty-state-vinyl-grooves" />
          </div>
          <div className="empty-state-dust" />
        </div>
        <div className="empty-state-rose" />
      </div>
      <div className="empty-state-content">
        <h2 className="empty-state-heading">{message}</h2>
        <p className="empty-state-subtitle">{subtitle}</p>
        <div className="empty-state-decoration" aria-hidden="true">
          <span className="empty-state-skull" />
          <span className="empty-state-dagger" />
        </div>
      </div>
    </div>
  );
};

export default EmptyState;