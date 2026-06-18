import React from 'react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const defaultMessages = {
  title: 'The Void Beckons',
  message: 'Like echoes in an empty cathedral, nothing resides here yet. Perhaps it is time to fill this space with something beautiful and tragic.',
};

export function EmptyState({
  title = defaultMessages.title,
  message = defaultMessages.message,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-6 py-16 ${className}`}
      role="status"
      aria-label="Empty state"
    >
      {icon && (
        <div className="mb-6 text-gray-600">
          {icon}
        </div>
      )}
      {!icon && (
        <div className="mb-6 w-20 h-20 rounded-full border-2 border-gray-700 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
      )}
      <h3 className="text-2xl font-heading text-gray-300 mb-3 tracking-wider">
        {title}
      </h3>
      <p className="text-base text-gray-500 max-w-md leading-relaxed italic">
        {message}
      </p>
      {action && (
        <div className="mt-8">
          {action}
        </div>
      )}
    </div>
  );
}