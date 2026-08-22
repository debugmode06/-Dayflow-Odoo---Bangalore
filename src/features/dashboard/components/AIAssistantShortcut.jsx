import React from 'react';
import Card from '@/components/ui/Card';
import { MessageSquare, Sparkles } from 'lucide-react';

export const AIAssistantShortcut = ({ onOpenAi }) => {
  const prompts = [
    "What is my attendance this month?",
    "How many leave days do I have?",
    "When is my next holiday?"
  ];

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          Ask OdooSphere AI
          <Sparkles size={16} color="var(--color-ai)" />
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={onOpenAi}
            style={{
              padding: '10px 12px',
              backgroundColor: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 'var(--font-size-sm)',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
              e.currentTarget.style.borderColor = 'var(--color-ai)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-secondary)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <MessageSquare size={14} color="var(--text-tertiary)" />
            {prompt}
          </button>
        ))}
      </div>
    </Card>
  );
};

export default AIAssistantShortcut;
