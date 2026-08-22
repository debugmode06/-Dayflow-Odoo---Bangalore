import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Sparkles, HelpCircle, ArrowUpRight, Activity } from 'lucide-react';
import AIInsightCard from './AIInsightCard';

export const WorkforcePulseCard = ({
  pulseData,
  onOpenWhyDrawer,
  onOpenAssistantDrawer,
}) => {
  const { score = 86, metrics = {}, insight = {} } = pulseData || {};

  const getHealthBadge = (val) => {
    if (val >= 85) return <Badge variant="success" dot>HEALTHY</Badge>;
    if (val >= 70) return <Badge variant="warning" dot>MODERATE</Badge>;
    return <Badge variant="danger" dot>ATTENTION REQUIRED</Badge>;
  };

  return (
    <Card variant="ai" className="workforce-pulse-card">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Card Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="var(--color-ai)" />
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ai-text)' }}>
              Workforce Pulse
            </span>
          </div>
          {getHealthBadge(score)}
        </div>

        {/* Score & Core Breakdown */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '1px solid var(--color-ai-border)', paddingBottom: 'var(--space-4)' }}>
          <div>
            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)', lineHeight: 1 }}>
              {score}
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)', fontWeight: 'var(--font-weight-normal)' }}> / 100</span>
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Calculated Real-Time Health Score
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 16px', textAlign: 'right' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Attendance: </span>
              <strong style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)' }}>{metrics.attendanceScore || 91}%</strong>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Availability: </span>
              <strong style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)' }}>{metrics.availabilityScore || 82}%</strong>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Leave Load: </span>
              <strong style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)' }}>{metrics.leaveLoadScore || 84}%</strong>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Profile Health: </span>
              <strong style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)' }}>{metrics.profileHealthScore || 88}%</strong>
            </div>
          </div>
        </div>

        {/* AI Workforce Brief */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Sparkles size={14} color="var(--color-ai)" />
            <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-ai-text)', textTransform: 'uppercase' }}>
              AI Workforce Brief
            </span>
          </div>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            "{insight.summary || 'Workforce health remains strong overall. Attendance is healthy, while increased late arrivals and reduced availability are the main areas requiring attention.'}"
          </p>
        </div>

        {/* Actions Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', marginTop: '4px' }}>
          <Button
            onClick={onOpenWhyDrawer}
            variant="ai"
            size="sm"
            icon={HelpCircle}
          >
            Why {score}?
          </Button>

          {onOpenAssistantDrawer && (
            <Button
              onClick={onOpenAssistantDrawer}
              variant="outline"
              size="sm"
              icon={ArrowUpRight}
            >
              Ask AI Assistant
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default WorkforcePulseCard;
