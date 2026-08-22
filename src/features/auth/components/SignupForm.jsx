import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/authService';
import PasswordField from './PasswordField';
import { validateEmail, validatePassword, validateEmployeeId } from '../utils/authValidation';
import { DEFAULT_ROLE } from '../utils/roles';

export const SignupForm = () => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    
    const empErr = validateEmployeeId(employeeId);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    
    if (empErr || emailErr || passErr) {
      setErrors({ employeeId: empErr, email: emailErr, password: passErr });
      return;
    }
    setErrors({});
    
    setIsSubmitting(true);
    try {
      await signup(email, password, employeeId);
      // The user is authenticated but not verified. They will be pushed to VerifyEmail view by ProtectedRoute/VerificationGate
      navigate('/dashboard');
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
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

      <div style={{ marginBottom: 'var(--space-4)' }}>
        <label htmlFor="employeeId" style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
          Employee ID
        </label>
        <input
          id="employeeId"
          type="text"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          placeholder="e.g. EMP-1024"
          style={{
            width: '100%',
            padding: 'var(--space-2) var(--space-3)',
            border: `1px solid ${errors.employeeId ? 'var(--color-danger)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-md)',
            outline: 'none',
            fontSize: 'var(--font-size-sm)',
            transition: 'border-color 0.2s',
          }}
        />
        {errors.employeeId && <span style={{ display: 'block', color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px' }}>{errors.employeeId}</span>}
      </div>

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

      <div style={{ marginBottom: 'var(--space-4)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
          Role
        </label>
        <input
          type="text"
          value={DEFAULT_ROLE === 'employee' ? 'Employee' : DEFAULT_ROLE}
          disabled
          style={{
            width: '100%',
            padding: 'var(--space-2) var(--space-3)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-tertiary)',
            fontSize: 'var(--font-size-sm)',
            cursor: 'not-allowed'
          }}
        />
        <span style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '11px', marginTop: '4px' }}>
          HR/Admin roles must be provisioned internally.
        </span>
      </div>

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
        {isSubmitting ? 'Creating Account...' : 'Sign Up'}
      </button>

      <div style={{ marginTop: 'var(--space-4)', textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 'var(--font-weight-medium)' }}>Sign In</Link>
      </div>
    </form>
  );
};

export default SignupForm;
