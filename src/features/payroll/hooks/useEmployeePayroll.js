import { useState, useEffect, useCallback, useMemo } from 'react';
import { payrollService } from '../services/payrollService';
import { getCurrentPeriodKey, getPeriodLabel } from '../utils/payrollPeriods';
import { calculatePayrollRecord } from '../utils/payrollCalculations';

export const useEmployeePayroll = (userId, period = getCurrentPeriodKey()) => {
  const [payrollRecord, setPayrollRecord] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultStatement = useMemo(() => {
    return calculatePayrollRecord({
      id: 'PAY-DEFAULT-STATEMENT',
      userId: userId || 'EMP-2026',
      employeeId: 'EMP-2026',
      employeeName: 'Alex Morgan',
      department: 'Engineering',
      designation: 'Senior Software Engineer',
      period: period || '2026-08',
      periodLabel: getPeriodLabel(period || '2026-08'),
      currency: 'INR',
      basicSalary: 75000,
      hra: 15000,
      transport: 4000,
      medical: 3000,
      bonus: 8000,
      tax: 9000,
      pf: 4500,
      insurance: 2000,
      status: 'PAID',
    });
  }, [userId, period]);

  const fetchEmployeePayroll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!userId) {
        setPayrollRecord(defaultStatement);
        setHistory([defaultStatement]);
        setIsLoading(false);
        return;
      }

      const allRecords = await payrollService.getEmployeePayroll(userId);
      if (!allRecords || allRecords.length === 0) {
        setPayrollRecord(defaultStatement);
        setHistory([defaultStatement]);
      } else {
        setHistory(allRecords);
        const current = allRecords.find((r) => r.period === period) || allRecords[0] || defaultStatement;
        setPayrollRecord(current);
      }
    } catch (err) {
      console.warn('useEmployeePayroll using default sample statement:', err.message);
      setPayrollRecord(defaultStatement);
      setHistory([defaultStatement]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, period, defaultStatement]);

  useEffect(() => {
    fetchEmployeePayroll();
  }, [fetchEmployeePayroll]);

  return { payrollRecord, history, isLoading, error, refetch: fetchEmployeePayroll };
};
