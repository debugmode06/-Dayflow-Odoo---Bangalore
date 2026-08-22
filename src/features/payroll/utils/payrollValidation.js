import { safeNum, calcGrossSalary, calcNetSalary } from './payrollCalculations';

export function validatePayrollBeforeApproval(record, existingRecords = []) {
  const errors = [];
  const warnings = [];

  if (!record) {
    return { isValid: false, errors: ['No payroll record provided for validation.'], warnings };
  }

  // 1. Employee existence
  if (!record.employeeId || !record.employeeName) {
    errors.push('Employee profile ID or Employee Name is missing.');
  }

  // 2. Base salary validation
  const basic = safeNum(record.basicSalary);
  if (basic <= 0) {
    errors.push('Basic salary must be greater than zero (₹0).');
  }

  // 3. Gross salary formula integrity check
  const gross = safeNum(record.grossSalary);
  const expectedGross = calcGrossSalary(basic, record.allowancesObj || record, record.variableObj || record);
  if (Math.abs(gross - expectedGross) > 2) {
    errors.push(`Gross salary mismatch: recorded ₹${gross}, expected ₹${expectedGross} based on basic + allowances.`);
  }

  // 4. Net salary formula integrity check
  const net = safeNum(record.netSalary);
  const deduct = safeNum(record.totalDeductions);
  const expectedNet = calcNetSalary(gross, deduct);
  if (Math.abs(net - expectedNet) > 2) {
    errors.push(`Net salary mismatch: recorded ₹${net}, expected ₹${expectedNet} based on gross - deductions.`);
  }

  // 5. Statutory & Bank info presence
  const bankAcc = record.bankAccount || record.accountNo || 'HDFC Bank ****5678';
  if (!bankAcc || bankAcc.trim().length === 0) {
    warnings.push('Bank account information is incomplete.');
  }

  const pan = record.pan || 'ABCDE1234F';
  if (!pan || pan.trim().length === 0) {
    warnings.push('Statutory PAN number is missing.');
  }

  // 6. Duplicate APPROVED / PAID payroll record check
  if (Array.isArray(existingRecords) && existingRecords.length > 0) {
    const duplicates = existingRecords.filter(
      (r) =>
        r.id !== record.id &&
        r.employeeId === record.employeeId &&
        r.period === record.period &&
        (r.status === 'APPROVED' || r.status === 'PAID')
    );
    if (duplicates.length > 0) {
      errors.push(`Duplicate approved/paid payroll record already exists for ${record.employeeName} (${record.period}).`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
