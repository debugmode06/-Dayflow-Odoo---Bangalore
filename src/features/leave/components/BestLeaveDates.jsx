import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { calculateLeaveImpact } from '../intelligence/leaveImpactEngine';

export const BestLeaveDates = ({ allLeaves = [], userId, onApplyDates }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [duration, setDuration] = useState(3);
  const [recommendation, setRecommendation] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const findBestDates = () => {
    setIsSearching(true);
    setRecommendation(null);
    
    // Simulate slight delay for "analysis" feel
    setTimeout(() => {
      const today = new Date();
      // Start searching from tomorrow
      let currentSearchStart = new Date(today);
      currentSearchStart.setDate(currentSearchStart.getDate() + 1);
      
      let bestImpact = null;
      let bestStart = null;
      let bestEnd = null;
      
      // Look ahead up to 60 days
      for (let i = 0; i < 60; i++) {
        // Skip weekends
        if (currentSearchStart.getDay() === 0 || currentSearchStart.getDay() === 6) {
          currentSearchStart.setDate(currentSearchStart.getDate() + 1);
          continue;
        }

        const candidateStart = new Date(currentSearchStart);
        const candidateEnd = new Date(candidateStart);
        
        // Calculate end date skipping weekends
        let daysAdded = 0;
        while (daysAdded < duration - 1) {
          candidateEnd.setDate(candidateEnd.getDate() + 1);
          if (candidateEnd.getDay() !== 0 && candidateEnd.getDay() !== 6) {
            daysAdded++;
          }
        }

        const startStr = candidateStart.toISOString().split('T')[0];
        const endStr = candidateEnd.toISOString().split('T')[0];

        const impact = calculateLeaveImpact({
          requestedStartDate: startStr,
          requestedEndDate: endStr,
          requestingUserId: userId,
          existingLeaves: allLeaves,
          totalEmployees: 20
        });

        if (impact.impactLevel === 'LOW' && impact.overlappingLeaveCount === 0) {
          bestImpact = impact;
          bestStart = startStr;
          bestEnd = endStr;
          break; // Found the perfect spot
        } else if (!bestImpact || impact.currentAvailability > bestImpact.currentAvailability) {
          // Keep track of the best one found so far even if not perfect
          if (impact.impactLevel !== 'HIGH') {
            bestImpact = impact;
            bestStart = startStr;
            bestEnd = endStr;
          }
        }
        
        currentSearchStart.setDate(currentSearchStart.getDate() + 1);
      }

      if (bestImpact) {
        setRecommendation({
          start: bestStart,
          end: bestEnd,
          impact: bestImpact
        });
      } else {
        setRecommendation('NONE');
      }
      setIsSearching(false);
    }, 800);
  };

  const handleUseDates = () => {
    if (recommendation && recommendation !== 'NONE') {
      onApplyDates(recommendation.start, recommendation.end);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        style={{ 
          borderColor: 'var(--color-primary)', 
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-5)'
        }}
      >
        
      </Button>

      {isOpen && (
        <Modal title="Find Best Leave Dates" onClose={() => setIsOpen(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              Ask Dayflow to find the dates with the least workforce disruption for your requested duration.
            </p>
            
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-4)' }}>
              <div style={{ flex: 1 }}>
                <Input
                  label="How many days?"
                  type="number"
                  min="1"
                  max="20"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value, 10) || 1)}
                />
              </div>
              <Button type="button" onClick={findBestDates} isLoading={isSearching}>
                Search
              </Button>
            </div>

            {isSearching && (
              <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--text-secondary)' }}>
                Analyzing team schedules and existing leaves...
              </div>
            )}

            {recommendation === 'NONE' && !isSearching && (
              <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}>
                No suitable leave period found with low impact.
              </div>
            )}

            {recommendation && recommendation !== 'NONE' && !isSearching && (
              <div style={{ 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-primary-light)'
              }}>
                <div style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                  RECOMMENDED:
                </div>
                <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-1)' }}>
                  {recommendation.start} → {recommendation.end}
                </div>
                <div style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                  {duration} days
                </div>
                
                <div style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
                  <div style={{ fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-2)' }}>Why?</div>
                  <div style={{ color: 'var(--color-success)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>✓ {recommendation.impact.projectedAvailability.toFixed(0)}% team availability</div>
                    <div>✓ {recommendation.impact.overlappingLeaveCount === 0 ? 'No major overlapping leave' : 'Acceptable overlap'}</div>
                    <div>✓ {recommendation.impact.impactLevel === 'LOW' ? 'Low workforce impact' : 'Medium workforce impact'}</div>
                  </div>
                </div>

                <Button type="button" onClick={handleUseDates} style={{ width: '100%' }}>
                  Use These Dates
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default BestLeaveDates;
