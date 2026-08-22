import React from 'react';
import Card from '@/components/ui/Card';

const generateBrief = (data) => {
  if (!data) return 'Loading workforce data...';
  const { health, overview, departments } = data;
  const score = health?.overall || 0;
  const label = health?.label || 'Good';
  const att = health?.breakdown?.attendance || 0;
  const pending = overview?.pendingLeaveRequests || 0;
  const atRisk = (departments || []).filter(d => d.risk === 'high').map(d => d.name);
  const strong = (departments || []).filter(d => d.risk === 'low' && d.attendance >= 90).map(d => d.name);

  let brief = `Your workforce is ${label.toLowerCase()} at ${score}/100. `;
  brief += `Attendance is ${att >= 90 ? 'stable' : 'under pressure'} at ${att}%. `;
  if (atRisk.length) brief += `${atRisk.join(' and ')} ${atRisk.length === 1 ? 'has' : 'have'} below-target availability. `;
  if (pending > 0) brief += `${pending} leave ${pending === 1 ? 'request requires' : 'requests require'} approval. `;
  if (strong.length) brief += `${strong[0]} has the strongest workforce capacity today.`;
  return brief;
};

export const HRDailyBrief = ({ data }) => {
  const brief = generateBrief(data);
  return (
    <Card title="Today's HR Brief" subtitle="Deterministic summary from live workforce metrics">
      <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>
        {brief}
      </p>
      <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 'var(--space-3)', fontStyle: 'italic' }}>
        Generated from attendance, leave and department data. No external AI service is used.
      </p>
    </Card>
  );
};

export default HRDailyBrief;
