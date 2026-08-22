import React from 'react';
import Card from '@/components/ui/Card';
import { Calendar } from 'lucide-react';

export const UpcomingSchedule = ({ schedule = [] }) => {
  return (
    <Card title="Upcoming Schedule">
      {schedule.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {schedule.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '48px', 
                height: '48px', 
                backgroundColor: item.isHoliday ? 'var(--color-primary-light)' : 'var(--bg-surface-secondary)', 
                borderRadius: 'var(--radius-md)',
                color: item.isHoliday ? 'var(--color-primary)' : 'var(--text-secondary)'
              }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'var(--font-weight-bold)' }}>{item.dayShort}</span>
                <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', lineHeight: 1 }}>{item.date}</span>
              </div>
              <div>
                <div style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  {item.time || 'All Day'}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: 'var(--space-4) 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          <Calendar size={24} style={{ opacity: 0.5, marginBottom: '8px' }} />
          <p style={{ fontSize: 'var(--font-size-sm)' }}>No upcoming schedule</p>
        </div>
      )}
    </Card>
  );
};

export default UpcomingSchedule;
