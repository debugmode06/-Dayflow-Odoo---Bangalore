import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Sparkles, ArrowRight } from 'lucide-react';

export const DayflowAIInsight = ({ insight, onOpenAi }) => {
  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          Dayflow AI Insight
          <Badge variant="ai" size="sm">BETA</Badge>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: 'var(--radius-md)', 
            backgroundColor: 'var(--color-ai-light)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--color-ai)',
            flexShrink: 0
          }}>
            <Sparkles size={16} />
          </div>
          <p style={{ color: 'var(--text-primary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.5, margin: 0 }}>
            {insight || "Your attendance is strong this month. Punctuality improved compared with last month."}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button
            onClick={onOpenAi}
            style={{
              padding: '6px 12px',
              backgroundColor: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-secondary)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Ask Dayflow AI <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default DayflowAIInsight;
