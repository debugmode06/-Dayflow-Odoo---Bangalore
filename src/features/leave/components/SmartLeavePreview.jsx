import React, { useMemo } from 'react';
import Card from '@/components/ui/Card';
import { calculateLeaveImpact } from '../intelligence/leaveImpactEngine';

export const SmartLeavePreview = ({ 
  startDate, 
  endDate, 
  userId, 
  allLeaves = []
}) => {
  const impact = useMemo(() => {
    if (!startDate || !endDate) return null;
    // Basic validation
    if (new Date(endDate) < new Date(startDate)) return null;

    return calculateLeaveImpact({
      requestedStartDate: startDate,
      requestedEndDate: endDate,
      requestingUserId: userId,
      existingLeaves: allLeaves,
      totalEmployees: 20 // Simulated team size for hackathon
    });
  }, [startDate, endDate, userId, allLeaves]);

  if (!startDate || !endDate) return null;
  if (new Date(endDate) < new Date(startDate)) return null;
  if (!impact) return null;

  const {
    leaveDuration,
    overlappingLeaveCount,
    currentAvailability,
    projectedAvailability,
    impactLevel,
    explanation
  } = impact;

  const getImpactColor = () => {
    if (impactLevel === 'LOW') return 'var(--color-success)';
    if (impactLevel === 'MEDIUM') return 'var(--color-warning-text)';
    return 'var(--color-danger)';
  };

  return (
    <div style={{ marginTop: 'var(--space-4)' }}>
      <div style={{ 
        border: '1px solid var(--border-color)', 
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          backgroundColor: 'var(--color-primary-light)', 
          padding: 'var(--space-3) var(--space-4)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)'
        }}>
          <span style={{ color: 'var(--color-primary)', fontSize: '1.2em' }}>✦</span>
          <span style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-sm)', letterSpacing: '0.05em', color: 'var(--color-primary)' }}>
            SMART REQUEST PREVIEW
          </span>
        </div>
        
        <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Duration */}
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Duration</div>
            <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{leaveDuration} days requested</div>
          </div>

          {/* Team Availability */}
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Team availability</div>
            <div style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {currentAvailability.toFixed(0)}% → {projectedAvailability.toFixed(0)}%
            </div>
          </div>

          {/* Overlapping Leave */}
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Existing leave</div>
            <div style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {overlappingLeaveCount} {overlappingLeaveCount === 1 ? 'teammate' : 'teammates'} already away
            </div>
          </div>

          {/* Overall Impact */}
          <div style={{ 
            backgroundColor: 'var(--bg-secondary)', 
            padding: 'var(--space-3)', 
            borderRadius: 'var(--radius-md)' 
          }}>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: '4px' }}>Workforce Impact</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ 
                width: '10px', height: '10px', borderRadius: '50%', backgroundColor: getImpactColor() 
              }}></span>
              <span style={{ fontWeight: 'var(--font-weight-bold)', letterSpacing: '0.05em', color: getImpactColor() }}>
                {impactLevel}
              </span>
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              ✓ {explanation}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SmartLeavePreview;
