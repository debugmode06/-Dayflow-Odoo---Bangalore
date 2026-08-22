import React from 'react';

export const Avatar = ({
  src,
  name = 'User',
  size = 'md', // 'sm' (32px) | 'md' (40px) | 'lg' (56px) | 'xl' (80px)
  className = '',
}) => {
  const sizePixels = {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  };

  const px = sizePixels[size] || 40;

  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <div
      style={{
        width: `${px}px`,
        height: `${px}px`,
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-primary-light)',
        color: 'var(--color-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'var(--font-weight-semibold)',
        fontSize: `${px * 0.4}px`,
        overflow: 'hidden',
        border: '1px solid var(--color-primary-border)',
        flexShrink: 0,
      }}
      className={className}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};

export default Avatar;
