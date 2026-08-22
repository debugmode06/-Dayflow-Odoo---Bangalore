import { useState, useEffect } from 'react';
import { workforcePulseService } from '../services/workforcePulseService';

export const useWorkforcePulse = () => {
  const [pulseData, setPulseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPulse = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workforcePulseService.getPulseData();
      setPulseData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch workforce pulse');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPulse();
  }, []);

  return {
    pulseData,
    loading,
    error,
    refreshPulse: fetchPulse
  };
};
