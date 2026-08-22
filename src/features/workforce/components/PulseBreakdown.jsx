import React from 'react';
import { SignalCard } from './SignalCard';
import SignalDetailDrawer from './SignalDetailDrawer';
import { useWorkforcePulse } from '@/features/workforce/hooks/useWorkforcePulse';

/**
 * Displays the four core signal cards (Attendance, Availability, Leave, Profile).
 * Clicking a card opens a detailed drawer.
 */
export const PulseBreakdown = () => {
  const { pulseData, loading, error, refresh } = useWorkforcePulse();
  const [selectedSignal, setSelectedSignal] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  if (loading) return <p>Loading pulse data...</p>;
  if (error) return <p>Error loading pulse data: {error}</p>;
  if (!pulseData) return null;

  const { signals } = pulseData;

  const handleCardClick = (key) => {
    setSelectedSignal({
      title: key.charAt(0).toUpperCase() + key.slice(1),
      ...signals[key]
    });
    setDrawerOpen(true);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(signals).map(([key, signal]) => (
        <SignalCard
          key={key}
          title={key.charAt(0).toUpperCase() + key.slice(1)}
          score={signal.score}
          status={signal.status}
          explanation={signal.explanation}
          onClick={() => handleCardClick(key)}
        />
      ))}

      <SignalDetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        signal={selectedSignal}
      />
    </div>
  );
};
