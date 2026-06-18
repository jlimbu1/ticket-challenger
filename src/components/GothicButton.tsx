import React from 'react';

interface GothicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

const variantStyles = {
  primary: 'bg-crimson hover:bg-red-900 text-white border-crimson hover:shadow-[0_0_15px_rgba(139,0,0,0.5)]',
  secondary: 'bg-deep-purple hover:bg-purple-900 text-white border-deep-purple hover:shadow-[0_0_15px_rgba(74,0,130,0.5)]',
  danger: 'bg-red-900 hover:bg-red-800 text-white border-red-800 hover:shadow-[0_0_15px_rgba(255,0,0,0.3)]',
};

const sizeStyles = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
};

export function GothicButton({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText = 'Loading...',
  children,
  className = '',
  disabled,
  ...props
}: GothicButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center font-heading font-bold tracking-wider uppercase border-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-crimson disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none';

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}