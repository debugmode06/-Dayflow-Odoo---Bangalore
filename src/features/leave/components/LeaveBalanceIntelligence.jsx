import React from 'react';
import Card from '@/components/ui/Card';
import { calculateLeaveDuration } from '../intelligence/leaveImpactEngine';
import { Sun, Heart, User } from 'lucide-react';

const ALLOWANCES = {
  Vacation: 24,
  Sick: 14,
  Personal: 5
};

const TYPE_MAPPING = {
  'Vacation': 'Vacation',
  'Sick': 'Sick',
  'Personal': 'Personal',
  'Sick Leave': 'Sick',
  'Personal Time': 'Personal'
};

const typeConfigs = {
  Vacation: { 
    label: 'Vacation', 
    icon: <Sun size={18} color="var(--color-primary)" />, 
    color: 'var(--color-primary)',
    bgColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)'
  },
  Sick: { 
    label: 'Sick Leave', 
    icon: <Heart size={18} color="var(--color-danger)" />, 
    color: 'var(--color-danger)',
    bgColor: 'color-mix(in srgb, var(--color-danger) 10%, transparent)'
  },
  Personal: { 
    label: 'Personal Time', 
    icon: <User size={18} color="var(--color-info)" />, 
    color: 'var(--color-info)',
    bgColor: 'color-mix(in srgb, var(--color-info) 10%, transparent)'
  }
};

const getStatusText = (remaining, allowance) => {
  if (remaining === 0) return 'No balance remaining';
  const pct = (remaining / allowance) * 100;
  if (pct === 100) return 'Fully available';
  if (pct >= 75) return 'Good balance';
  if (pct >= 25) return 'Moderate balance';
  return 'Low balance';
};

const ProgressRing = ({ percentage, color }) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div style={{ position: 'relative', width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="52" height="52" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="26" cy="26" r={radius} fill="none" stroke="var(--border-color-subtle)" strokeWidth="6" />
        <circle 
          cx="26" cy="26" r={radius} fill="none" stroke={color} strokeWidth="6" 
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      <div style={{ position: 'absolute', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>
        {Math.round(percentage)}%
      </div>
    </div>
  );
};

export const LeaveBalanceIntelligence = ({ leaves = [], activeRequest = null }) => {
  const calculateBalance = (typeKey) => {
    const allowance = ALLOWANCES[typeKey] || 0;
    const used = leaves
      .filter(l => l.status === 'approved' && TYPE_MAPPING[l.type] === typeKey)
      .reduce((total, l) => total + calculateLeaveDuration(l.startDate, l.endDate), 0);

    const remaining = Math.max(0, allowance - used);
    return { allowance, used, remaining };
  };

  const types = ['Vacation', 'Sick', 'Personal'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
      {types.map((id) => {
        const { allowance, used, remaining } = calculateBalance(id);
        const config = typeConfigs[id];
        
        const isRequestedType = activeRequest && TYPE_MAPPING[activeRequest.type] === id && activeRequest.duration > 0;
        const requested = isRequestedType ? activeRequest.duration : 0;
        const afterApproval = Math.max(0, remaining - requested);
        
        const usedPercentage = allowance > 0 ? (used / allowance) * 100 : 0;
        const statusText = getStatusText(remaining, allowance);

        return (
          <div 
            key={id} 
            style={{ 
              backgroundColor: 'var(--bg-surface)', 
              borderRadius: 'var(--radius-lg)', 
              border: '1px solid var(--border-color)', 
              boxShadow: 'var(--shadow-sm)',
              padding: 'var(--space-5)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all var(--transition-fast)',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = 'var(--border-color-dark)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
            aria-label={`${config.label}: ${remaining} days remaining out of ${allowance} total, ${used} days used.`}
          >
            {/* Header Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  width: '32px', height: '32px', borderRadius: 'var(--radius-md)', 
                  backgroundColor: config.bgColor 
                }}>
                  {config.icon}
                </div>
                <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)', margin: 0 }}>
                  {config.label}
                </h3>
              </div>
              <div style={{ 
                padding: '4px 10px', 
                borderRadius: 'var(--radius-full)', 
                backgroundColor: 'var(--bg-surface-secondary)', 
                color: 'var(--text-secondary)',
                fontSize: 'var(--font-size-xs)', 
                fontWeight: 'var(--font-weight-medium)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {statusText}
              </div>
            </div>

            {/* Central Balance */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6) 0' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: 'var(--font-size-5xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)', lineHeight: 1 }}>
                  {remaining}
                </span>
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)', fontWeight: 'var(--font-weight-medium)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Days Left
              </div>
            </div>

            {/* Bottom Section */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              borderTop: '1px solid var(--border-color-subtle)', 
              paddingTop: 'var(--space-4)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <ProgressRing percentage={usedPercentage} color={config.color} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Used</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>{used}d</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'right' }}>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Total</div>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>{allowance}d</div>
              </div>
            </div>

            {/* Active Request Preview */}
            {isRequestedType && (
              <div style={{ 
                marginTop: 'var(--space-4)', 
                padding: 'var(--space-3)', 
                backgroundColor: config.bgColor, 
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                border: `1px solid ${config.color}`,
                opacity: 0.9
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Current balance:</span>
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{remaining} days</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Requested:</span>
                  <span style={{ color: config.color, fontWeight: 'var(--font-weight-bold)' }}>{requested} days</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid color-mix(in srgb, var(--border-color) 50%, transparent)' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>After approval:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-weight-bold)' }}>{afterApproval} days</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LeaveBalanceIntelligence;
