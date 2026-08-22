import React, { useState, useEffect } from 'react';

export const LiveTimer = ({ checkInTimestamp }) => {
  const [duration, setDuration] = useState('00h 00m 00s');

  useEffect(() => {
    if (!checkInTimestamp) return;

    // Convert Firestore Timestamp to JS Date milliseconds
    // Note: checkInTimestamp might be a JS Date or a Firestore Timestamp depending on state
    const startMs = typeof checkInTimestamp.toMillis === 'function' 
      ? checkInTimestamp.toMillis() 
      : (checkInTimestamp.seconds ? checkInTimestamp.seconds * 1000 : new Date(checkInTimestamp).getTime());

    const updateTimer = () => {
      const now = Date.now();
      let diffMs = now - startMs;
      if (diffMs < 0) diffMs = 0;

      const totalSeconds = Math.floor(diffMs / 1000);
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      setDuration(
        `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [checkInTimestamp]);

  return (
    <div style={{ 
      fontSize: 'var(--font-size-3xl)', 
      fontWeight: 'var(--font-weight-bold)', 
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.02em',
      color: 'var(--text-primary)'
    }}>
      {duration}
    </div>
  );
};
