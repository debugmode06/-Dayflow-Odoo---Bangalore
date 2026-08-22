import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Clock, MapPin, Briefcase } from 'lucide-react';

export const TodaysWorkday = ({ attendanceData, onClockOut }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!attendanceData) {
    return (
      <Card title="Today's Workday">
        <div style={{ padding: 'var(--space-6) 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          <Clock size={32} style={{ opacity: 0.5, marginBottom: 'var(--space-3)' }} />
          <p style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--text-secondary)' }}>Not clocked in</p>
          <p style={{ fontSize: 'var(--font-size-sm)' }}>Your workday starts when you clock in via the Attendance module.</p>
        </div>
      </Card>
    );
  }

  const { status, clockInTime, shift, workMode } = attendanceData;

  // Simple duration calculation
  const getDuration = () => {
    if (!clockInTime) return '00:00:00';
    const diff = Math.floor((currentTime - new Date(clockInTime)) / 1000);
    const hrs = String(Math.floor(diff / 3600)).padStart(2, '0');
    const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    const secs = String(diff % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const getStatusVariant = () => {
    if (status === 'present') return 'success';
    if (status === 'late') return 'warning';
    return 'default';
  };

  return (
    <Card title="Today's Workday">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
        
        {/* Status & Duration */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Badge variant={getStatusVariant()} size="lg" dot>{(status || 'PRESENT').toUpperCase()}</Badge>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>Working today</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
              {getDuration()}
            </div>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--border-color-subtle)', margin: 'var(--space-2) 0' }} />

        {/* Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
            <Clock size={16} color="var(--text-tertiary)" style={{ marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Clocked in</div>
              <div style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                {clockInTime ? new Date(clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
            <Briefcase size={16} color="var(--text-tertiary)" style={{ marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Shift</div>
              <div style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                {shift || '09:00 AM – 06:00 PM'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start', gridColumn: '1 / -1' }}>
            <MapPin size={16} color="var(--text-tertiary)" style={{ marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Work Mode</div>
              <div style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                {workMode || 'Office'}
              </div>
            </div>
          </div>
        </div>

        {/* Action */}
        {onClockOut && (
          <button 
            onClick={onClockOut}
            style={{
              marginTop: 'var(--space-2)',
              width: '100%',
              padding: '12px',
              backgroundColor: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-secondary)'}
          >
            Clock Out
          </button>
        )}
      </div>
    </Card>
  );
};

export default TodaysWorkday;
