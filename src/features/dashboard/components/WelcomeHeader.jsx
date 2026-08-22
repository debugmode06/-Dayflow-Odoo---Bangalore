import React from 'react';
import { useAuth } from '@/features/auth';
import Badge from '@/components/ui/Badge';

export const WelcomeHeader = () => {
  const { user, profile } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const name = user?.displayName || 'Employee';
  const department = profile?.department || 'Unassigned Department';
  const employeeId = profile?.employeeId || profile?.id || 'No ID';

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>
          {getGreeting()}, {name} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span>{formattedDate}</span>
          <span style={{ color: 'var(--border-color-dark)' }}>•</span>
          <span>{department}</span>
          <span style={{ color: 'var(--border-color-dark)' }}>•</span>
          <span>{employeeId}</span>
        </p>
      </div>
      <Badge variant="info" size="md">
        Employee Workspace
      </Badge>
    </div>
  );
};

export default WelcomeHeader;
