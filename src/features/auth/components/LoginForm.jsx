import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import PasswordField from './PasswordField';
import { validateEmail, validatePassword } from '../utils/authValidation';

const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

const DEMO_ACCOUNTS = [
  { label: '👤 Employee', email: 'mohan@dayflow.demo', password: 'demo1234', color: '#6366f1' },
  { label: '🛡️ HR Admin', email: 'hr@dayflow.demo', password: 'demo1234', color: '#0ea5e9' },
];

export const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const doLogin = async (emailVal, passwordVal) => {
    setGlobalError('');
    setErrors({});
    setIsSubmitting(true);
    try {
      await login(emailVal, passwordVal);
      navigate('/dashboard');
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }
    await doLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {globalError && (
        <div style={{
          padding: 'var(--space-3)',
          marginBottom: 'var(--space-4)',
          backgroundColor: 'var(--color-danger-light)',
          color: 'var(--color-danger-text)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-sm)',
          border: '1px solid var(--color-danger)'
        }}>
          {globalError}
        </div>
      )}

      {/* ⚡ Quick Demo Login Buttons */}
      {IS_DEMO_MODE && (
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <p style={{
            fontSize: '11px',
            textAlign: 'center',
            color: 'var(--text-tertiary)',
            marginBottom: 'var(--space-2)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            ⚡ Quick Demo Access
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                disabled={isSubmitting}
                onClick={() => doLogin(acc.email, acc.password)}
                style={{
                  flex: 1,
                  padding: '10px 8px',
                  backgroundColor: acc.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 'var(--font-weight-medium)',
                  fontSize: '13px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {isSubmitting ? '...' : acc.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', margin: 'var(--space-4) 0 var(--space-2)' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>or sign in manually</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          </div>
        </div>
      )}

      <div style={{ marginBottom: 'var(--space-4)' }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
          Work Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@dayflow.hr"
          style={{
            width: '100%',
            padding: 'var(--space-2) var(--space-3)',
            border: `1px solid ${errors.email ? 'var(--color-danger)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-md)',
            outline: 'none',
            fontSize: 'var(--font-size-sm)',
            transition: 'border-color 0.2s',
          }}
        />
        {errors.email && <span style={{ display: 'block', color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px' }}>{errors.email}</span>}
      </div>

      <PasswordField
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: 'var(--space-2) var(--space-4)',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontWeight: 'var(--font-weight-medium)',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.7 : 1,
          marginTop: 'var(--space-2)',
          transition: 'opacity 0.2s'
        }}
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>

      <div style={{ marginTop: 'var(--space-4)', textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
        Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 'var(--font-weight-medium)' }}>Request Access</Link>
      </div>
    </form>
  );
};

export default LoginForm;
