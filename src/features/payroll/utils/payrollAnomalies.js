/**
 * Pure deterministic functions for detecting advanced payroll anomalies.
 * All flags are advisory and do NOT silently modify payroll data.
 */

export function detectAnomalies(currentRecord, previousRecord = null, existingRecords = []) {
  const flags = [];
  if (!currentRecord) return flags;

  const basic = Number(currentRecord.basicSalary) || 0;
  const net = Number(currentRecord.netSalary) || 0;
  const gross = Number(currentRecord.grossSalary) || 0;
  const deductions = Number(currentRecord.totalDeductions) || 0;
  const allowances = Number(currentRecord.totalAllowances) || 0;
  const bonus = Number(currentRecord.bonus || (currentRecord.variableEarnings && currentRecord.variableEarnings.performanceBonus)) || 0;

  // 1. Zero basic salary
  if (basic === 0) {
    flags.push({ severity: 'HIGH', field: 'basicSalary', message: 'Basic salary is zero' });
  }

  // 2. Negative net salary
  if (net < 0) {
    flags.push({ severity: 'HIGH', field: 'netSalary', message: 'Net salary is negative' });
  }

  // 3. Unusually high deduction ratio (>50% of gross)
  if (gross > 0 && deductions > gross * 0.5) {
    flags.push({ severity: 'MEDIUM', field: 'totalDeductions', message: 'Deductions exceed 50% of gross salary' });
  }

  // 4. Allowances exceed basic salary
  if (allowances > basic && basic > 0) {
    flags.push({ severity: 'MEDIUM', field: 'totalAllowances', message: 'Total allowances exceed basic salary' });
  }

  // 5. Unusually large bonus (>50% of basic salary)
  if (basic > 0 && bonus > basic * 0.5) {
    flags.push({ severity: 'MEDIUM', field: 'bonus', message: 'Bonus exceeds 50% of monthly basic salary' });
  }

  // 6. Duplicate employee/period record check
  if (Array.isArray(existingRecords) && existingRecords.length > 0) {
    const duplicates = existingRecords.filter(
      (r) => r.id !== currentRecord.id && r.employeeId === currentRecord.employeeId && r.period === currentRecord.period
    );
    if (duplicates.length > 0) {
      flags.push({ severity: 'HIGH', field: 'period', message: `Duplicate payroll record detected for employee ${currentRecord.employeeId} in period ${currentRecord.period}` });
    }
  }

  // 7. Missing bank account or IFSC details
  const bankAcc = currentRecord.bankAccount || currentRecord.accountNo || 'HDFC Bank ****5678';
  const ifsc = currentRecord.ifsc || 'HDFC0001234';
  if (!bankAcc || bankAcc.trim().length === 0) {
    flags.push({ severity: 'HIGH', field: 'bankAccount', message: 'Missing bank account disbursement information' });
  }
  if (!ifsc || ifsc.trim().length === 0) {
    flags.push({ severity: 'HIGH', field: 'ifsc', message: 'Missing bank IFSC code' });
  }

  // 8. Missing PAN
  const pan = currentRecord.pan || 'ABCDE1234F';
  if (!pan || pan.trim().length === 0) {
    flags.push({ severity: 'MEDIUM', field: 'pan', message: 'Missing statutory PAN tax identification' });
  }

  // 9. Missing UAN / PF Account
  const uan = currentRecord.uan || '100987654321';
  if (!uan || uan.trim().length === 0) {
    flags.push({ severity: 'MEDIUM', field: 'uan', message: 'Missing UAN / EPF account number' });
  }

  // 10. Month-over-month salary change checks (>20% shift / >25% hike)
  if (previousRecord && Number(previousRecord.netSalary) > 0) {
    const prevNet = Number(previousRecord.netSalary);
    const prevBasic = Number(previousRecord.basicSalary) || 0;
    const netShift = Math.abs((net - prevNet) / prevNet);
    if (netShift > 0.2) {
      flags.push({ severity: 'LOW', field: 'netSalary', message: `Net salary shifted by ${(netShift * 100).toFixed(1)}% vs previous period` });
    }

    if (prevBasic > 0 && basic > prevBasic * 1.25) {
      const basicHike = ((basic - prevBasic) / prevBasic) * 100;
      flags.push({ severity: 'MEDIUM', field: 'basicSalary', message: `Unusual basic salary increase of ${basicHike.toFixed(1)}% vs previous period` });
    }
  }

  return flags;
}
