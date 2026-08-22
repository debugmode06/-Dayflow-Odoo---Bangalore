import React, { useState, useEffect } from 'react';
import Badge from '@/components/ui/Badge';
import { fetchLeaveImpactAIExplanation } from '@/features/workforce/services/workforceAiService';
import Card from '@/components/ui/Card';

const LeaveImpactSimulator = ({ impact, employeeName, leaveDates, leaveType }) => {
  const [aiInsight, setAiInsight] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchInsight = async () => {
      if (!impact || hasAttemptedFetch) return;
      
      setIsAiLoading(true);
      setHasAttemptedFetch(true);
      
      try {
        const payload = {
          department: 'General', // Fallback
          requestedDays: impact.leaveDuration,
          currentAvailability: Math.round(impact.currentAvailability),
          projectedAvailability: Math.round(impact.projectedAvailability),
          existingLeavesCount: impact.overlappingLeaveCount,
          impactLevel: impact.impactLevel,
        };
        
        const response = await fetchLeaveImpactAIExplanation(payload);
        
        if (isMounted) {
          if (response && response.explanation) {
             setAiInsight(response);
          } else {
             // Safe Fallback
             setAiInsight({
                explanation: impact.explanation,
                isFallback: true
             });
          }
        }
      } catch (error) {
        if (isMounted) {
          setAiInsight({
            explanation: impact.explanation,
            isFallback: true
          });
        }
      } finally {
        if (isMounted) {
          setIsAiLoading(false);
        }
      }
    };

    fetchInsight();

    return () => {
      isMounted = false;
    };
  }, [impact, hasAttemptedFetch]);

  if (!impact) return null;

  const isLow = impact.impactLevel === 'LOW';
  const isMedium = impact.impactLevel === 'MEDIUM';
  const isHigh = impact.impactLevel === 'HIGH';

  const badgeVariant = isHigh ? 'danger' : isMedium ? 'warning' : 'success';
  const color = isHigh ? 'var(--color-danger)' : isMedium ? 'var(--color-warning)' : 'var(--color-success)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', width: '100%' }}>
      
      {/* IMPACT HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-semibold)' }}>
            Leave Impact
          </h3>
          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
            {employeeName} • {leaveDates} • {impact.leaveDuration} {impact.leaveDuration === 1 ? 'day' : 'days'}
          </p>
        </div>
        <Badge variant={badgeVariant}>{impact.impactLevel} IMPACT</Badge>
      </div>

      {/* VISUALIZATION */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: 'var(--space-4)',
        backgroundColor: 'var(--bg-surface-secondary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>
            {Math.round(impact.currentAvailability)}%
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Current
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, padding: '0 var(--space-4)' }}>
          <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-color)', borderRadius: '2px', position: 'relative', marginBottom: 'var(--space-2)' }}>
             <div style={{ 
               position: 'absolute', 
               left: 0, 
               top: 0, 
               bottom: 0, 
               width: `${Math.max(0, impact.projectedAvailability)}%`, 
               backgroundColor: color, 
               borderRadius: '2px',
               transition: 'width 0.5s ease-in-out'
             }} />
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: color, fontWeight: 'var(--font-weight-medium)' }}>
            {impact.availabilityChange > 0 ? '+' : ''}{impact.availabilityChange.toFixed(1)} percentage points
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: color }}>
            {Math.round(impact.projectedAvailability)}%
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Projected
          </div>
        </div>
      </div>

      {/* SIGNALS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Already Unavailable</div>
          <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-medium)' }}>
            {impact.currentUnavailableCount} {impact.currentUnavailableCount === 1 ? 'employee' : 'employees'}
          </div>
        </div>
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Overlap Status</div>
          <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-medium)' }}>
            {impact.overlapDetected ? 'Detected' : 'None'}
          </div>
        </div>
      </div>

      {/* AI HR INSIGHT */}
      <div style={{
        marginTop: 'var(--space-2)',
        padding: 'var(--space-4)',
        backgroundColor: 'var(--bg-surface-tertiary)',
        borderLeft: '4px solid var(--color-primary)',
        borderRadius: '0 var(--radius-md) var(--radius-md) 0'
      }}>
        <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>
          AI HR Insight
        </div>
        
        {isAiLoading ? (
          <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', fontStyle: 'italic', animation: 'pulse 2s infinite' }}>
            Analyzing workforce impact...
          </div>
        ) : aiInsight ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', lineHeight: '1.5' }}>
              {aiInsight.explanation}
            </p>
            {aiInsight.recommendation && (
              <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                Recommendation: {aiInsight.recommendation}
              </p>
            )}
            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textAlign: 'right', marginTop: 'var(--space-2)' }}>
              Powered by {aiInsight.isFallback ? 'Dayflow Deterministic Engine' : 'NVIDIA NIM Llama 3.1 8B'}
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            AI insight is temporarily unavailable.
          </div>
        )}
      </div>

    </div>
  );
};

export default LeaveImpactSimulator;
