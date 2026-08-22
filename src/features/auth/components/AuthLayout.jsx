import React from 'react';
import Card from '@/components/ui/Card';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-secondary)',
      padding: 'var(--space-4)'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ 
            fontSize: 'var(--font-size-2xl)', 
            fontWeight: 'var(--font-weight-bold)', 
            color: 'var(--color-primary)', 
            letterSpacing: '-0.02em',
            marginBottom: 'var(--space-2)'
          }}>
            OdooSphere
          </div>
          {title && <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-1)' }}>{title}</h1>}
          {subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>{subtitle}</p>}
        </div>
        
        <Card style={{ padding: 'var(--space-6)', boxShadow: 'var(--shadow-lg)' }}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
