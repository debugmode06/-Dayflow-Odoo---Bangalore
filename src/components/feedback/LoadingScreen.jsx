import React from 'react';
import { Loader2 } from 'lucide-react';
import { APP_NAME } from '@/config/constants';

export const LoadingScreen = ({ message = 'Loading OdooSphere workspace...' }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-app)',
        gap: 'var(--space-4)',
      }}
      className="animate-fade-in"
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--text-primary)',
          color: 'var(--text-inverse)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'var(--font-weight-bold)',
          fontSize: 'var(--font-size-xl)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        D
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)' }}>
        <Loader2 className="animate-spin" size={20} />
        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-secondary)' }}>
          {message}
        </span>
      </div>
    </div>
  );
};

export default LoadingScreen;
