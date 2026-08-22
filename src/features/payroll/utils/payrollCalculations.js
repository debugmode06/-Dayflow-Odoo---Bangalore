/**
 * Pure calculation functions for Dayflow HR Payroll Management
 */

export function safeNum(value) {
  const n = Number(value);
  return isNaN(n) || !isFinite(n) || n < 0 ? 0 : n;
}

export function calcTotalAllowances(allowances = {}) {
  if (!allowances) return 0;
  return (
    safeNum(allowances.hra) +
    safeNum(allowances.transport) +
    safeNum(allowances.medical) +
    safeNum(allowances.special) +
    safeNum(allowances.communication) +
    safeNum(allowances.other)
  );
}

export function calcTotalVariableEarnings(variableEarnings = {}) {
  if (!variableEarnings) return 0;
  return (
    safeNum(variableEarnings.performanceBonus || variableEarnings.bonus) +
    safeNum(variableEarnings.incentive) +
    safeNum(variableEarnings.overtime) +
    safeNum(variableEarnings.reimbursement) +
    safeNum(variableEarnings.otherEarnings)
  );
}

export function calcGrossSalary(basicSalary = 0, allowances = {}, variableEarnings = {}) {
  const basic = safeNum(basicSalary);
  const allowTotal = typeof allowances === 'number' ? safeNum(allowances) : calcTotalAllowances(allowances);
  const varTotal = typeof variableEarnings === 'number' ? safeNum(variableEarnings) : calcTotalVariableEarnings(variableEarnings);
  return basic + allowTotal + varTotal;
}

export function calcTotalDeductions(deductions = {}) {
  if (!deductions) return 0;
  if (typeof deductions === 'number') return safeNum(deductions);
  return (
    safeNum(deductions.tax) +
    safeNum(deductions.providentFund || deductions.pf) +
    safeNum(deductions.insurance) +
    safeNum(deductions.professionalTax) +
    safeNum(deductions.loanDeduction) +
    safeNum(deductions.otherDeductions || deductions.other)
  );
}

export function calcNetSalary(grossSalary = 0, totalDeductions = 0) {
  const gross = safeNum(grossSalary);
  const deduct = safeNum(totalDeductions);
  const net = gross - deduct;
  return net > 0 ? net : 0;
}

export function formatCurrency(value, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR',
    maximumFractionDigits: 0,
  }).format(safeNum(value));
}

export function calculatePayrollRecord(record = {}) {
  const basicSalary = safeNum(record.basicSalary);
  
  const allowancesObj = record.allowances && typeof record.allowances === 'object' 
    ? record.allowances 
    : {
        hra: safeNum(record.hra),
        transport: safeNum(record.transport),
        medical: safeNum(record.medical),
        special: safeNum(record.special),
        communication: safeNum(record.communication),
        other: safeNum(record.otherAllowance),
      };

  const variableObj = record.variableEarnings && typeof record.variableEarnings === 'object'
    ? record.variableEarnings
    : {
        performanceBonus: safeNum(record.bonus || record.performanceBonus),
        incentive: safeNum(record.incentive),
        overtime: safeNum(record.overtime),
        reimbursement: safeNum(record.reimbursement),
        otherEarnings: safeNum(record.otherEarnings),
      };

  const deductionsObj = record.deductions && typeof record.deductions === 'object'
    ? record.deductions
    : {
        tax: safeNum(record.tax),
        providentFund: safeNum(record.pf || record.providentFund),
        insurance: safeNum(record.insurance),
        professionalTax: safeNum(record.professionalTax),
        loanDeduction: safeNum(record.loanDeduction),
        otherDeductions: safeNum(record.otherDeductions),
      };

  const totalAllowances = calcTotalAllowances(allowancesObj);
  const totalVariableEarnings = calcTotalVariableEarnings(variableObj);
  const grossSalary = basicSalary + totalAllowances + totalVariableEarnings;
  const totalDeductions = calcTotalDeductions(deductionsObj);
  const netSalary = calcNetSalary(grossSalary, totalDeductions);

  return {
    ...record,
    basicSalary,
    allowancesObj,
    variableObj,
    deductionsObj,
    totalAllowances,
    totalVariableEarnings,
    grossSalary,
    totalDeductions,
    netSalary,
  };
}

export function calculatePayrollSummary(records = []) {
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
    const allow = r.totalAllowances !== undefined ? safeNum(r.totalAllowances) : calcTotalAllowances(r.allowancesObj || r);
    const deduct = r.totalDeductions !== undefined ? safeNum(r.totalDeductions) : calcTotalDeductions(r.deductionsObj || r);
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
}
