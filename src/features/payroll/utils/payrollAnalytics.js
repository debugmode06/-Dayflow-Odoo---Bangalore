import { safeNum } from './payrollCalculations';

export function calculateHRAnalytics(records = []) {
  if (!Array.isArray(records) || records.length === 0) {
    return {
      totalGross: 0,
      totalNet: 0,
      totalAllowances: 0,
      totalDeductions: 0,
      count: 0,
      departmentCosts: {},
      statusDistribution: { DRAFT: 0, CALCULATED: 0, APPROVED: 0, PAID: 0 },
      topEarners: [],
    };
  }

  let totalGross = 0;
  let totalNet = 0;
  let totalAllowances = 0;
  let totalDeductions = 0;

  const departmentCosts = {};
  const statusDistribution = { DRAFT: 0, CALCULATED: 0, APPROVED: 0, PAID: 0 };

  records.forEach((r) => {
    const gross = safeNum(r.grossSalary);
    const net = safeNum(r.netSalary);
    const allow = safeNum(r.totalAllowances);
    const deduct = safeNum(r.totalDeductions);
    const dept = r.department || 'General';
    const status = (r.status || 'DRAFT').toUpperCase();

    totalGross += gross;
    totalNet += net;
    totalAllowances += allow;
    totalDeductions += deduct;

    departmentCosts[dept] = (departmentCosts[dept] || 0) + gross;
    statusDistribution[status] = (statusDistribution[status] || 0) + 1;
  });

  return {
    totalGross,
    totalNet,
    totalAllowances,
    totalDeductions,
    count: records.length,
    departmentCosts,
    statusDistribution,
  };
}
