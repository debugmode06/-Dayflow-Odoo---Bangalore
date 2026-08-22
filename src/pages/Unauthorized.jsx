import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export const Unauthorized = () => {
  const location = useLocation();
  const reason = location.state?.reason;
  const isUnauthenticated = reason === 'unauthenticated';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-6)',
        background: 'var(--bg-primary)',
      }}
      className="animate-fade-in"
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: isUnauthenticated
            ? 'rgba(59,130,246,0.12)'
            : 'var(--color-danger-bg)',
          color: isUnauthenticated
            ? '#3b82f6'
            : 'var(--color-danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-4)',
        }}
      >
        {isUnauthenticated ? <LogIn size={34} /> : <ShieldAlert size={32} />}
      </div>

      <h1
        style={{
          fontSize: 'var(--font-size-3xl)',
          fontWeight: 'var(--font-weight-bold)',
        }}
      >
        {isUnauthenticated ? 'Sign In Required' : 'Access Restricted'}
      </h1>

      <p
        style={{
          fontSize: 'var(--font-size-base)',
          color: 'var(--text-secondary)',
          marginTop: '10px',
          maxWidth: '460px',
          lineHeight: 1.6,
        }}
      >
        {isUnauthenticated
          ? 'You need to sign in to your Dayflow account before accessing this page. Please log in with your company credentials.'
          : 'You do not have administrative or HR permission to access this module. Please switch role mode or contact your HR administrator.'}
      </p>

      <div
        style={{
          marginTop: 'var(--space-6)',
          display: 'flex',
          gap: 'var(--space-3)',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Link to="/attendance">
          <Button variant="primary" icon={ArrowLeft}>
            Go to Attendance Module
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="outline">
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {isUnauthenticated && (
        <p
          style={{
            marginTop: '12px',
            fontSize: '13px',
            color: 'var(--text-tertiary, #9ca3af)',
          }}
        >
          Contact your HR administrator if you need access.
        </p>
      )}
    </div>
  );
};

export default Unauthorized;
