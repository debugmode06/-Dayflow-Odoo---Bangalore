import React from 'react';

export const Skeleton = ({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-sm)',
  className = '',
  style = {},
}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
      className={`skeleton-pulse ${className}`}
    />
  );
};

export const CardSkeleton = () => (
  <div
    style={{
      padding: 'var(--space-6)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-surface)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
    }}
  >
    <Skeleton height="24px" width="40%" />
    <Skeleton height="16px" width="80%" />
    <Skeleton height="16px" width="60%" />
  </div>
);

export default Skeleton;
