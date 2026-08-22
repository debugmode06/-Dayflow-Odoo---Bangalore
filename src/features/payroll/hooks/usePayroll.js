import { useState, useEffect, useCallback } from 'react';
import { payrollService } from '../services/payrollService';
import { getCurrentPeriodKey } from '../utils/payrollPeriods';

export const usePayroll = (period = getCurrentPeriodKey()) => {
  const [payrollData, setPayrollData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayroll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await payrollService.getPayrollData(period);
      setPayrollData(data);
    } catch (err) {
      console.error('usePayroll error:', err);
      setError(err.message || 'Failed to load payroll data from Firestore.');
      setPayrollData([]); // Ensure state is reset — NO FAKE FALLBACK DATA
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchPayroll();
  }, [fetchPayroll]);

  const updateSalary = async (recordId, newSalaryData) => {
    try {
      await payrollService.updateSalaryRecord(recordId, newSalaryData);
      await fetchPayroll();
      return true;
    } catch (err) {
      throw new Error(err.message || 'Failed to update salary.');
    }
  };

  const updateStatus = async (recordId, newStatus) => {
    try {
      await payrollService.updatePayrollStatus(recordId, newStatus);
      await fetchPayroll();
      return true;
    } catch (err) {
      throw new Error(err.message || 'Failed to update payroll status.');
    }
  };

  return { payrollData, isLoading, error, updateSalary, updateStatus, refetch: fetchPayroll };
};
