import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import { Calendar, Clock, User, MessageSquare, Send } from 'lucide-react';

export const QuickActions = ({ onOpenAi }) => {
  const navigate = useNavigate();

  const actions = [
    { label: 'Apply Leave', icon: <Send size={20} />, onClick: () => navigate('/leave'), color: 'var(--color-primary)' },
    { label: 'View Attendance', icon: <Clock size={20} />, onClick: () => navigate('/attendance'), color: 'var(--color-info)' },
    { label: 'Calendar', icon: <Calendar size={20} />, onClick: () => navigate('/leave'), color: 'var(--color-success)' },
    { label: 'My Profile', icon: <User size={20} />, onClick: () => navigate('/profile'), color: 'var(--color-warning)' },
    { label: 'Ask AI', icon: <MessageSquare size={20} />, onClick: onOpenAi, color: 'var(--color-ai)' },
  ];

  return (
    <Card>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 'var(--space-4)' }}>
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-3)',
              backgroundColor: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-color-subtle)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              color: 'var(--text-primary)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
              e.currentTarget.style.borderColor = action.color;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-secondary)';
              e.currentTarget.style.borderColor = 'var(--border-color-subtle)';
            }}
          >
            <div style={{ color: action.color }}>{action.icon}</div>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)' }}>
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;
