import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export const Unauthorized = () => {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-6)',
      }}
      className="animate-fade-in"
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-danger-bg)',
          color: 'var(--color-danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-4)',
        }}
      >
        <ShieldAlert size={32} />
      </div>

      <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)' }}>
        Access Restricted
      </h1>

      <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '440px' }}>
        You do not have administrative or HR permission to access this module. Please switch role mode or contact your HR administrator.
      </p>

      <div style={{ marginTop: 'var(--space-6)' }}>
        <Link to="/dashboard">
          <Button variant="primary" icon={ArrowLeft}>
            Back to Employee Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
