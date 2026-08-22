import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from '@/components/ui/Card';

export const WhatChangedSection = ({ changes = [] }) => (
  <Card title="What Changed Since Yesterday?" subtitle="Based on available attendance and leave data">
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
      {changes.map((c, i) => {
        const up = c.trend === 'up';
        const isGood = up ? !c.isBad : !!c.isBad;
        const delta = Math.abs((c.today - c.yesterday)).toFixed(1);
        const color = isGood ? 'var(--color-success-text)' : c.trend === 'up' ? 'var(--color-danger-text)' : 'var(--color-warning-text)';
        const Icon = up ? TrendingUp : TrendingDown;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '10px var(--space-3)', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color-subtle)' }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: isGood ? 'var(--color-success-bg)' : 'var(--color-warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={15} color={color} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{c.metric}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{c.yesterday}{c.unit}</span>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>→</span>
              <span style={{ fontSize: 13, fontWeight: 700, color }}>{c.today}{c.unit}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color, background: isGood ? 'var(--color-success-bg)' : 'var(--color-warning-bg)', borderRadius: 'var(--radius-full)', padding: '2px 8px' }}>
                {up ? '+' : '-'}{delta}{c.unit}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  </Card>
);

export default WhatChangedSection;
