import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'ai'
  size = 'md',          // 'sm' | 'md' | 'lg'
  isLoading = false,
  isDisabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'var(--font-weight-medium)',
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--transition-fast)',
    cursor: isDisabled || isLoading ? 'not-allowed' : 'pointer',
    border: '1px solid transparent',
    outline: 'none',
    opacity: isDisabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    gap: 'var(--space-2)',
  };

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: 'var(--font-size-xs)' },
    md: { padding: '9px 16px', fontSize: 'var(--font-size-sm)' },
    lg: { padding: '12px 22px', fontSize: 'var(--font-size-base)' },
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--text-inverse)',
      boxShadow: 'var(--shadow-sm)',
    },
    secondary: {
      backgroundColor: 'var(--bg-surface-secondary)',
      color: 'var(--text-primary)',
      borderColor: 'var(--border-color)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--text-primary)',
      borderColor: 'var(--border-color)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
    },
    danger: {
      backgroundColor: 'var(--color-danger)',
      color: 'var(--text-inverse)',
      boxShadow: 'var(--shadow-sm)',
    },
    ai: {
      backgroundColor: 'var(--color-ai-bg)',
      color: 'var(--color-ai-text)',
      borderColor: 'var(--color-ai-border)',
      fontWeight: 'var(--font-weight-semibold)',
    },
  };

  return (
    <button
      type={type}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      style={{
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
      }}
      className={`focus-ring ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 16} />}
      {!isLoading && Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : 16} />}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : 16} />}
    </button>
  );
};

export default Button;
