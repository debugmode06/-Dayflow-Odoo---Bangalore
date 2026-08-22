/**
 * Pure calculation functions for Dayflow HR Payroll Management
 */

export const safeNum = (val) => {
  const n = Number(val);
  return isNaN(n) || !isFinite(n) || n < 0 ? 0 : n;
};

export const calculateAllowancesBreakdown = (item = {}) => {
  const hra = safeNum(item.hra);
  const transport = safeNum(item.transport);
  const medical = safeNum(item.medical);
  const bonus = safeNum(item.bonus);
  const other = safeNum(item.otherAllowance || item.other);
  return hra + transport + medical + bonus + other;
};

export const calculateDeductionsBreakdown = (item = {}) => {
  const tax = safeNum(item.tax);
  const pf = safeNum(item.pf);
  const insurance = safeNum(item.insurance);
  const other = safeNum(item.otherDeductions || item.otherDeduct);
  return tax + pf + insurance + other;
};

export const calculateGrossSalary = (basicSalary = 0, allowances = 0) => {
  return safeNum(basicSalary) + safeNum(allowances);
};

export const calculateNetSalary = (basicSalary = 0, allowances = 0, deductions = 0) => {
  const basic = safeNum(basicSalary);
  const allow = safeNum(allowances);
  const deduct = safeNum(deductions);
  const net = basic + allow - deduct;
  return net > 0 ? net : 0;
};

export const calculatePayrollSummary = (records = []) => {
  if (!Array.isArray(records) || records.length === 0) {
    return {
      totalGross: 0,
      totalNet: 0,
      totalAllowances: 0,
      totalDeductions: 0,
      count: 0,
      avgSalary: 0,
    };
  }

  let totalGross = 0;
  let totalNet = 0;
  let totalAllowances = 0;
  let totalDeductions = 0;

  records.forEach((r) => {
    const basic = safeNum(r.basicSalary);
    const allow = r.allowances !== undefined ? safeNum(r.allowances) : calculateAllowancesBreakdown(r);
    const deduct = r.deductions !== undefined ? safeNum(r.deductions) : calculateDeductionsBreakdown(r);
    const gross = r.grossSalary !== undefined ? safeNum(r.grossSalary) : basic + allow;
    const net = r.netSalary !== undefined ? safeNum(r.netSalary) : gross - deduct;

    totalGross += gross;
    totalNet += net > 0 ? net : 0;
    totalAllowances += allow;
    totalDeductions += deduct;
  });

  const count = records.length;
  const avgSalary = count > 0 ? Math.round(totalNet / count) : 0;

  return {
    totalGross,
    totalNet,
    totalAllowances,
    totalDeductions,
    count,
    avgSalary,
  };
};
