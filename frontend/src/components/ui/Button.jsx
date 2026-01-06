import React, { forwardRef } from 'react';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  // Base classes
  const baseClasses = `
    relative inline-flex items-center justify-center
    font-semibold rounded-xl
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-all duration-300 ease-in-out
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  // Size variants
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    default: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  };

  // Variant styles
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-primary to-primary-dark
      text-white
      border-2 border-primary
      shadow-md shadow-primary/20
      hover:from-primary-dark hover:to-primary
      hover:shadow-lg hover:shadow-primary/30
      focus:ring-primary
      active:from-primary-dark active:to-primary-dark
    `,
    secondary: `
      bg-gradient-to-r from-secondary to-secondary-dark
      text-black
      border-2 border-secondary
      shadow-md shadow-secondary/20
      hover:from-secondary-dark hover:to-secondary
      hover:shadow-lg hover:shadow-secondary/30
      focus:ring-secondary
    `,
    outline: `
      bg-transparent
      text-main
      border-2 border-main
      shadow-md shadow-main/20
      hover:bg-main hover:text-white
      hover:shadow-lg hover:shadow-main/30
      focus:ring-main
    `,
    ghost: `
      bg-transparent
      text-main
      border-2 border-transparent
      shadow-md shadow-main/20
      hover:bg-main/10 hover:border-main/20
      focus:ring-main
    `,
  };

  // Loading spinner
  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${loading || disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
