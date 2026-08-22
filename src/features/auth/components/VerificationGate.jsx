import React, { useState } from 'react';
import { Mail, RefreshCw, LogOut } from 'lucide-react';
import { resendVerification } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

export const VerificationGate = ({ children }) => {
  const { user, isEmailVerified, refreshAuth } = useAuth();
  const [resending, setResending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (isEmailVerified) {
    return children;
  }

  const handleResend = async () => {
    setResending(true);
    setMessage('');
    setError('');
    try {
      await resendVerification(user);
      setMessage('Verification link has been resent to your email.');
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setMessage('');
    setError('');
    try {
      const verified = await refreshAuth();
      if (!verified) {
        setMessage('Your email is not verified yet. Please check your inbox and click the verification link, then try again.');
      }
      // If verified, isEmailVerified state in AuthProvider will update and children will render
    } catch (err) {
      setError(err.message || 'Unable to check verification status. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-secondary)',
      padding: 'var(--space-4)'
    }}>
      <div style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }}>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            marginBottom: 'var(--space-4)'
          }}>
            <Mail size={32} />
          </div>
          <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-2)' }}>Verify your email</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            We've sent a verification link to <br/>
            <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>{user?.email}</span>
          </p>
        </div>

        {message && (
          <div style={{ padding: 'var(--space-3)', marginBottom: 'var(--space-4)', backgroundColor: 'var(--color-success-light)', color: 'var(--color-success-text)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
            {message}
          </div>
        )}
        
        {error && (
          <div style={{ padding: 'var(--space-3)', marginBottom: 'var(--space-4)', backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger-text)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              width: '100%', padding: 'var(--space-2) var(--space-4)',
              backgroundColor: 'var(--color-primary)', color: 'white',
              border: 'none', borderRadius: 'var(--radius-md)',
              fontWeight: 'var(--font-weight-medium)', cursor: refreshing ? 'not-allowed' : 'pointer',
              opacity: refreshing ? 0.7 : 1, transition: 'opacity 0.2s'
            }}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Checking...' : 'I have verified my email'}
          </button>
          
          <button
            onClick={handleResend}
            disabled={resending}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              width: '100%', padding: 'var(--space-2) var(--space-4)',
              backgroundColor: 'transparent', color: 'var(--color-primary)',
              border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
              fontWeight: 'var(--font-weight-medium)', cursor: resending ? 'not-allowed' : 'pointer',
              opacity: resending ? 0.7 : 1, transition: 'background-color 0.2s'
            }}
          >
            {resending ? 'Sending...' : 'Resend verification link'}
          </button>
        </div>

        <div style={{ marginTop: 'var(--space-6)' }}>
          <button
            onClick={user?.logout}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'none', border: 'none',
              color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)',
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} /> Change Account / Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationGate;
