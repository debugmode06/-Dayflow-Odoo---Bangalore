import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import { ArrowRight } from 'lucide-react';

export const AttendanceSummary = ({ summary }) => {
  const navigate = useNavigate();
  
  // Default fallback if no data provided
  const data = summary || {
    score: 91,
    present: 18,
    late: 2,
    absent: 1,
    halfDay: 0
  };

  return (
    <Card 
      title="My Attendance" 
      action={
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
          {data.score}%
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          This Month
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>Present</div>
            <div style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>{data.present} days</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>Late</div>
            <div style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>{data.late} days</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>Absent</div>
            <div style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>{data.absent} days</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>Half Day</div>
            <div style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>{data.halfDay} days</div>
          </div>
        </div>

        <button
          onClick={() => navigate('/attendance')}
          style={{
            marginTop: 'var(--space-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--color-primary)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)',
            cursor: 'pointer',
            paddingLeft: 0
          }}
        >
          View Attendance <ArrowRight size={16} />
        </button>
      </div>
    </Card>
  );
};

export default AttendanceSummary;
