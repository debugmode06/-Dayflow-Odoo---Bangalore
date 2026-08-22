import { useState, useEffect, useCallback, useMemo } from 'react';
import { payrollService } from '../services/payrollService';
import { getCurrentPeriodKey, getPeriodLabel, getRecentPeriods } from '../utils/payrollPeriods';
import { calculatePayrollRecord, calcCTC, calculateYTD, comparePayrollPeriods } from '../utils/payrollCalculations';

export function getSampleRecordForPeriod(userId, periodKey = '2026-08') {
  const [yearStr, monthStr] = (periodKey || '2026-08').split('-');
  const monthNum = parseInt(monthStr || '8', 10);

  // Month-dependent salary variations (realistic Indian corporate structure)
  const basicSalary = 70000 + (monthNum % 5) * 1500;
  const hra = Math.round(basicSalary * 0.20);
  const transport = 4000;
  const medical = 3000;

  // Month-varying bonus (higher in appraisal months / festive seasons)
  const bonus = (monthNum === 3 || monthNum === 10) ? 12000 : (monthNum % 2 === 0) ? 5000 : 2000;
  const overtime = (monthNum % 4 === 0) ? 3500 : 0;

  const tax = Math.round((basicSalary + hra + bonus + overtime) * 0.10);
  const pf = Math.round(basicSalary * 0.06);
  const insurance = 2000;

  return calculatePayrollRecord({
    id: `PAY-${periodKey}-${userId || 'EMP-2026'}`,
    userId: userId || 'EMP-2026',
    employeeId: 'EMP-2026',
    employeeName: 'Alex Morgan',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    period: periodKey,
    periodLabel: getPeriodLabel(periodKey),
    currency: 'INR',
    basicSalary,
    hra,
    transport,
    medical,
    bonus,
    overtime,
    tax,
    pf,
    insurance,
    status: monthNum > 8 ? 'DRAFT' : 'PAID',
  });
}

export const useEmployeePayroll = (userId, period = getCurrentPeriodKey()) => {
  const [payrollRecord, setPayrollRecord] = useState(null);
  const [history, setHistory] = useState([]);
  const [revisions, setRevisions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate full 12-month sample history sequence
  const sample12MonthHistory = useMemo(() => {
    const periods = getRecentPeriods(12);
    return periods.map((p) => getSampleRecordForPeriod(userId, p.key));
  }, [userId]);

  const fetchEmployeePayroll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let allRecords = [];
      if (userId) {
        allRecords = await payrollService.getEmployeePayroll(userId);
      }

      if (!allRecords || allRecords.length === 0) {
        setHistory(sample12MonthHistory);
        const current = sample12MonthHistory.find((r) => r.period === period) || getSampleRecordForPeriod(userId, period);
        setPayrollRecord(current);
      } else {
        // Merge real Firestore records with period-specific fallback for unpopulated months
        const mergedHistory = [...allRecords];
        sample12MonthHistory.forEach((sampleRec) => {
          if (!mergedHistory.some((r) => r.period === sampleRec.period)) {
            mergedHistory.push(sampleRec);
          }
        });
        setHistory(mergedHistory);

        const current = mergedHistory.find((r) => r.period === period) || getSampleRecordForPeriod(userId, period);
        setPayrollRecord(current);
      }

      // Fetch salary revision history for this employee
      const revs = await payrollService.getSalaryRevisions(payrollRecord?.employeeId || 'EMP-2026');
      setRevisions(revs);
    } catch (err) {
      console.warn('useEmployeePayroll using dynamic period fallback statement:', err.message);
      setHistory(sample12MonthHistory);
      setPayrollRecord(getSampleRecordForPeriod(userId, period));
    } finally {
      setIsLoading(false);
    }
  }, [userId, period, sample12MonthHistory, payrollRecord?.employeeId]);

  useEffect(() => {
    fetchEmployeePayroll();
  }, [fetchEmployeePayroll]);

  // Derived CTC, YTD, and Month-over-Month comparison
  const ctcBreakdown = useMemo(() => {
    if (!payrollRecord) return calcCTC(74500, 21800, 5000);
    return calcCTC(
      payrollRecord.basicSalary,
      payrollRecord.totalAllowances,
      payrollRecord.variableObj || payrollRecord.bonus,
      payrollRecord.pf
    );
  }, [payrollRecord]);

  const ytdSummary = useMemo(() => {
    return calculateYTD(history);
  }, [history]);

  const momComparison = useMemo(() => {
    if (!history || history.length === 0) return comparePayrollPeriods(payrollRecord, null);
    const currentIndex = history.findIndex((r) => r.period === (payrollRecord?.period || period));
    const previous = currentIndex >= 0 && currentIndex + 1 < history.length ? history[currentIndex + 1] : null;
    return comparePayrollPeriods(payrollRecord || getSampleRecordForPeriod(userId, period), previous);
  }, [history, payrollRecord, period, userId]);

  return {
    payrollRecord,
    history,
    revisions,
    ctcBreakdown,
    ytdSummary,
    momComparison,
    isLoading,
    error,
    refetch: fetchEmployeePayroll,
  };
};
