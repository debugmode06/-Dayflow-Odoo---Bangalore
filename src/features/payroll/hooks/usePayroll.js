import { useState, useEffect, useCallback } from 'react';
import { payrollService } from '../services/payrollService';

export const usePayroll = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayroll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await payrollService.getPayrollData();
      setPayrollData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch payroll data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayroll();
  }, [fetchPayroll]);

  const updateSalary = async (recordId, newSalaryData) => {
    try {
      await payrollService.updateSalaryRecord(recordId, newSalaryData);
      // Refresh the data locally after successful update
      await fetchPayroll();
      return true;
    } catch (err) {
      throw new Error(err.message || 'Failed to update salary.');
    }
  };

  return { payrollData, isLoading, error, updateSalary, refetch: fetchPayroll };
};
