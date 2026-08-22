import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { AlertCircle, ChevronRight } from 'lucide-react';

export const ActionRequired = ({ actions = [] }) => {
  const navigate = useNavigate();

  return (
    <Card 
      title="Action Required" 
      action={actions.length > 0 ? <Badge variant="warning">{actions.length}</Badge> : null}
    >
      {actions.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.link)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-3)',
                backgroundColor: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color var(--transition-fast)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-secondary)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <AlertCircle size={16} color="var(--color-warning)" />
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>
                  {action.message}
                </span>
              </div>
              <ChevronRight size={16} color="var(--text-tertiary)" />
            </button>
          ))}
        </div>
      ) : (
        <div style={{ padding: 'var(--space-4) 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          <p style={{ fontSize: 'var(--font-size-sm)' }}>You're all caught up 🎉</p>
        </div>
      )}
    </Card>
  );
};

export default ActionRequired;
