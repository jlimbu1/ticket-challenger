import React from 'react';

interface GothicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles: Record<string, string> = {
  primary: 'bg-gradient-to-r from-crimson to-deepPurple text-white hover:brightness-110',
  secondary: 'bg-transparent border-2 border-crimson text-crimson hover:bg-crimson hover:text-white',
  danger: 'bg-gradient-to-r from-red-800 to-crimson text-white hover:brightness-110',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
};

const GothicButton: React.FC<GothicButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        font-gothic tracking-wider uppercase
        rounded-md transition-all duration-300 ease-out
        active:scale-95 focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 focus:ring-offset-black
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variantStyles[variant] || variantStyles.primary}
        ${sizeStyles[size] || sizeStyles.md}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default GothicButton;