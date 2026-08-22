import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const PasswordField = ({ label = 'Password', value, onChange, error, placeholder, name = 'password' }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
      <label htmlFor={name} style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id={name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder || '••••••••'}
          style={{
            width: '100%',
            padding: 'var(--space-2) var(--space-3)',
            paddingRight: '40px',
            border: `1px solid ${error ? 'var(--color-danger)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-md)',
            outline: 'none',
            fontSize: 'var(--font-size-sm)',
            transition: 'border-color 0.2s',
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <span style={{ display: 'block', color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default PasswordField;
