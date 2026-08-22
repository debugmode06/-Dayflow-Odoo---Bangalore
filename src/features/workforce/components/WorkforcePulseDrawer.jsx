import React from 'react';
import Drawer from '@/components/ui/Drawer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Lightbulb, ArrowRight, ShieldCheck, Clock, CalendarDays } from 'lucide-react';

export const WorkforcePulseDrawer = ({
  isOpen,
  onClose,
  pulseData = {},
}) => {
  const { score = 86, metrics = {}, insight = {}, provider = 'NVIDIA NIM Llama 3.1 8B' } = pulseData;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Workforce Pulse Explainability Brief" width="460px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Header Summary */}
        <div style={{ backgroundColor: 'var(--bg-surface-secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-secondary)' }}>
              CALCULATED HEALTH SCORE
            </span>
            <Badge variant="success" dot>{score}/100 HEALTHY</Badge>
          </div>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            {insight.summary}
          </p>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} color="var(--color-ai)" />
            <span>Powered by {provider}</span>
          </div>
        </div>

        {/* 1. Positive Signals */}
        <div>
          <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-success-text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="var(--color-success)" />
            Positive Operational Signals
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(insight.positiveSignals || []).map((signal, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-success-bg)',
                  border: '1px solid var(--color-success-border)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-success-text)',
                }}
              >
                • {signal}
              </div>
            ))}
          </div>
        </div>

        {/* 2. Attention Areas & Risks */}
        <div>
          <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-warning-text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={16} color="var(--color-warning)" />
            Areas Requiring HR Review
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(insight.attentionAreas || []).map((area, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-warning-bg)',
                  border: '1px solid var(--color-warning-border)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-warning-text)',
                }}
              >
                • {area}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Recommended Actions */}
        <div>
          <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-ai-text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lightbulb size={16} color="var(--color-ai)" />
            Suggested HR Review Actions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(insight.recommendations || []).map((rec, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-ai-bg)',
                  border: '1px solid var(--color-ai-border)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-ai-text)',
                }}
              >
                → {rec}
              </div>
            ))}
          </div>
        </div>

        {/* 4. Traceable Explainability Navigation Links */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-4)' }}>
          <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
            TRACEABLE MODULE DETAILS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <Link to="/hr/attendance" onClick={onClose}>
              <Button variant="outline" size="sm" icon={Clock} fullWidth>
                View Attendance Signals
              </Button>
            </Link>
            <Link to="/hr/leave" onClick={onClose}>
              <Button variant="outline" size="sm" icon={CalendarDays} fullWidth>
                Review Leave Impact
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default WorkforcePulseDrawer;
