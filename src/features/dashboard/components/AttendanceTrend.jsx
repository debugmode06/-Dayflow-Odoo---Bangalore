import React from 'react';
import Card from '@/components/ui/Card';

export const AttendanceTrend = ({ trend = [] }) => {
  // Simple CSS bar chart visualization
  // Expects trend array like: [{ label: 'M', value: 100 }, { label: 'T', value: 80 }]
  
  const defaultTrend = [
    { label: 'Mon', value: 100 },
    { label: 'Tue', value: 100 },
    { label: 'Wed', value: 80 }, // late
    { label: 'Thu', value: 100 },
    { label: 'Fri', value: 100 },
  ];

  const data = trend.length > 0 ? trend : defaultTrend;

  return (
    <Card title="My Attendance Trend" subtitle="This week's performance">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px', marginTop: 'var(--space-4)', padding: '0 var(--space-2)' }}>
        {data.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
            <div 
              style={{ 
                width: '100%', 
                maxWidth: '24px', 
                height: `${item.value}%`, 
                backgroundColor: item.value >= 90 ? 'var(--color-success)' : (item.value >= 50 ? 'var(--color-warning)' : 'var(--color-danger)'),
                borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                minHeight: '4px' // Ensure visibility for 0%
              }} 
            />
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AttendanceTrend;
