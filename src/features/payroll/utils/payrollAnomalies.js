/**
 * Pure deterministic functions for detecting payroll anomalies.
 */

export function detectAnomalies(currentRecord, previousRecord = null) {
  const flags = [];
  if (!currentRecord) return flags;

  const basic = Number(currentRecord.basicSalary) || 0;
  const net = Number(currentRecord.netSalary) || 0;
  const gross = Number(currentRecord.grossSalary) || 0;
  const deductions = Number(currentRecord.totalDeductions) || 0;
  const allowances = Number(currentRecord.totalAllowances) || 0;

  // Zero basic salary
  if (basic === 0) {
    flags.push({ severity: 'HIGH', message: 'Basic salary is zero' });
  }

  // Negative net salary
  if (net < 0) {
    flags.push({ severity: 'HIGH', message: 'Net salary is negative' });
  }

  // Unusually high deduction ratio (>50% of gross)
  if (gross > 0 && deductions > gross * 0.5) {
    flags.push({ severity: 'MEDIUM', message: 'Deductions exceed 50% of gross' });
  }

  // Allowances exceed basic salary
  if (allowances > basic && basic > 0) {
    flags.push({ severity: 'MEDIUM', message: 'Allowances exceed basic salary' });
  }

  // Month-over-month net salary shift (>20%)
  if (previousRecord && Number(previousRecord.netSalary) > 0) {
    const prevNet = Number(previousRecord.netSalary);
    const change = Math.abs((net - prevNet) / prevNet);
    if (change > 0.2) {
      flags.push({ severity: 'LOW', message: `Net salary shifted by ${(change * 100).toFixed(1)}% vs previous period` });
    }
  }

  return flags;
}
