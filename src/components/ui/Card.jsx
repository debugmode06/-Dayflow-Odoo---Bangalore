import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  variant = 'default', // 'default' | 'flat' | 'ai'
  className = '',
  style = {},
  onClick,
}) => {
  const variantStyles = {
    default: {
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)',
    },
    flat: {
      backgroundColor: 'var(--bg-surface-secondary)',
      border: '1px solid var(--border-color-subtle)',
    },
    ai: {
      backgroundColor: 'var(--color-ai-bg)',
      border: '1px solid var(--color-ai-border)',
      boxShadow: 'var(--shadow-sm)',
    },
  };

  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        transition: 'box-shadow var(--transition-fast), border-color var(--transition-fast)',
        cursor: onClick ? 'pointer' : 'default',
        ...variantStyles[variant],
        ...style,
      }}
      className={`animate-fade-in ${className}`}
    >
      {(title || subtitle || headerAction) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-4)',
          }}
        >
          <div>
            {title && (
              <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      <div>{children}</div>

      {footer && (
        <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color-subtle)' }}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
