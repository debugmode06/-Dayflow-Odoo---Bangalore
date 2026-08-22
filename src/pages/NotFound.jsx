import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export const NotFound = () => {
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
          backgroundColor: 'var(--bg-surface-secondary)',
          color: 'var(--text-tertiary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-4)',
        }}
      >
        <FileQuestion size={32} />
      </div>

      <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)' }}>
        404 — Page Not Found
      </h1>

      <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '400px' }}>
        The requested page does not exist or has been moved within the Dayflow workspace.
      </p>

      <div style={{ marginTop: 'var(--space-6)' }}>
        <Link to="/dashboard">
          <Button variant="primary" icon={ArrowLeft}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
