import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export const ErrorState = ({
  title = 'Something went wrong',
  description = 'An unexpected error occurred while loading this section.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8) var(--space-6)',
        textAlign: 'center',
        backgroundColor: 'var(--color-danger-bg)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-danger-border)',
      }}
      className={`animate-fade-in ${className}`}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: '#FEE2E2',
          color: 'var(--color-danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-3)',
        }}
      >
        <AlertCircle size={24} />
      </div>

      <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-danger-text)' }}>
        {title}
      </h4>

      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '360px' }}>
        {description}
      </p>

      {onRetry && (
        <div style={{ marginTop: 'var(--space-4)' }}>
          <Button onClick={onRetry} variant="outline" size="sm" icon={RefreshCw}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
