import React from 'react';

export const Badge = ({
  children,
  variant = 'default', // 'default' | 'success' | 'warning' | 'danger' | 'info' | 'ai'
  size = 'md',          // 'sm' | 'md'
  dot = false,
  className = '',
}) => {
  const variantStyles = {
    default: {
      backgroundColor: 'var(--bg-surface-secondary)',
      color: 'var(--text-secondary)',
      borderColor: 'var(--border-color)',
    },
    success: {
      backgroundColor: 'var(--color-success-bg)',
      color: 'var(--color-success-text)',
      borderColor: 'var(--color-success-border)',
    },
    warning: {
      backgroundColor: 'var(--color-warning-bg)',
      color: 'var(--color-warning-text)',
      borderColor: 'var(--color-warning-border)',
    },
    danger: {
      backgroundColor: 'var(--color-danger-bg)',
      color: 'var(--color-danger-text)',
      borderColor: 'var(--color-danger-border)',
    },
    info: {
      backgroundColor: 'var(--color-info-bg)',
      color: 'var(--color-info-text)',
      borderColor: 'var(--color-info-border)',
    },
    ai: {
      backgroundColor: 'var(--color-ai-bg)',
      color: 'var(--color-ai-text)',
      borderColor: 'var(--color-ai-border)',
    },
  };

  const dotColors = {
    default: 'var(--text-tertiary)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    danger: 'var(--color-danger)',
    info: 'var(--color-info)',
    ai: 'var(--color-ai)',
  };

  return (
    <span
      style={{
        inlineFlex: 'inline-flex',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: size === 'sm' ? '2px 8px' : '4px 10px',
        fontSize: size === 'sm' ? '11px' : '12px',
        fontWeight: 'var(--font-weight-medium)',
        borderRadius: 'var(--radius-full)',
        border: '1px solid',
        whiteSpace: 'nowrap',
        ...variantStyles[variant],
      }}
      className={className}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: dotColors[variant],
          }}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
