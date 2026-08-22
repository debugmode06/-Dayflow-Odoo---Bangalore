import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { Clock, Calendar, UserCheck } from 'lucide-react';

export const MyWorkdayHealth = ({ metrics }) => {
  const score = metrics?.score || 0;
  
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setAnimatedScore(score);
    } else {
      const timer = setTimeout(() => setAnimatedScore(score), 100);
      return () => clearTimeout(timer);
    }
  }, [score]);

  let statusText = 'Needs Attention';
  let statusColor = 'var(--color-danger)';
  if (score >= 90) {
    statusText = 'Excellent';
    statusColor = 'var(--color-success)';
  } else if (score >= 75) {
    statusText = 'Good';
    statusColor = 'var(--color-info)';
  } else if (score >= 60) {
    statusText = 'Fair';
    statusColor = 'var(--color-warning)';
  }

  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const renderMetric = (label, value, subtext, icon) => (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: 'var(--bg-surface-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        transition: 'all var(--transition-fast)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
        e.currentTarget.style.borderColor = 'var(--border-color-dark)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--bg-surface-secondary)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
          {icon}
          <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>{label}</span>
        </div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginLeft: '24px' }}>
          {subtext}
        </div>
      </div>
      <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>
        {value != null ? `${value}%` : '--'}
      </div>
    </div>
  );

  return (
    <Card 
      title="My Workday Health" 
      subtitle="Your overall workforce alignment"
    >
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: 'var(--space-6)', 
          marginTop: 'var(--space-4)' 
        }}
        aria-label={`Workday health score: ${score} out of 100, ${statusText}.`}
      >
        {/* LEFT: Radial Score */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '160px', height: '160px' }}>
            <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background track */}
              <circle 
                cx="80" 
                cy="80" 
                r={radius} 
                fill="none" 
                stroke="var(--border-color-subtle)" 
                strokeWidth="10" 
              />
              {/* Animated progress ring */}
              <circle 
                cx="80" 
                cy="80" 
                r={radius} 
                fill="none" 
                stroke={statusColor} 
                strokeWidth="10" 
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              lineHeight: 1
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <span style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>
                  {score}
                </span>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)', marginLeft: '2px' }}>/100</span>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: 'var(--space-3)', textAlign: 'center' }}>
            <div style={{ 
              display: 'inline-block',
              padding: '4px 12px', 
              backgroundColor: `color-mix(in srgb, ${statusColor} 10%, transparent)`, 
              color: statusColor, 
              borderRadius: 'var(--radius-full)', 
              fontSize: 'var(--font-size-sm)', 
              fontWeight: 'var(--font-weight-bold)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {statusText}
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: '6px' }}>
              Overall alignment
            </div>
          </div>
        </div>

        {/* RIGHT: Metric Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', justifyContent: 'center' }}>
          {renderMetric(
            'Attendance', 
            metrics?.attendance, 
            metrics?.attendance >= 90 ? 'Strong attendance' : 'Needs attention', 
            <Clock size={16} color="var(--color-primary)" />
          )}
          {renderMetric(
            'Punctuality', 
            metrics?.punctuality, 
            metrics?.punctuality >= 80 ? 'Consistently on time' : 'Room for improvement', 
            <Calendar size={16} color="var(--color-info)" />
          )}
          {renderMetric(
            'Profile Completion', 
            metrics?.profile, 
            metrics?.profile === 100 ? 'Fully completed' : 'Missing information', 
            <UserCheck size={16} color="var(--color-success)" />
          )}
        </div>
      </div>
    </Card>
  );
};

export default MyWorkdayHealth;
