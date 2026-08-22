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

/**
 * Calculates CTC (Cost to Company) breakdown components.
 */
export function calcCTC(basicSalary = 0, allowances = {}, variableEarnings = {}, employerEPF = 0, employerESI = 0) {
  const basic = safeNum(basicSalary);
  const allowTotal = typeof allowances === 'number' ? safeNum(allowances) : calcTotalAllowances(allowances);
  const varTotal = typeof variableEarnings === 'number' ? safeNum(variableEarnings) : calcTotalVariableEarnings(variableEarnings);
  
  const fixedCompensation = basic + allowTotal;
  const variableCompensation = varTotal;
  const epfEmployer = employerEPF ? safeNum(employerEPF) : Math.round(basic * 0.12);
  const esiEmployer = employerESI ? safeNum(employerESI) : Math.round(basic * 0.0325);
  const employerContributions = epfEmployer + esiEmployer;

  const monthlyCTC = fixedCompensation + variableCompensation + employerContributions;
  const annualCTC = monthlyCTC * 12;

  const grossSalary = fixedCompensation + variableCompensation;
  const estimatedTax = Math.round(grossSalary * 0.10);
  const estimatedEPF = Math.round(basic * 0.06);
  const estimatedNetMonthly = calcNetSalary(grossSalary, estimatedTax + estimatedEPF);
  const estimatedAnnualTakeHome = estimatedNetMonthly * 12;

  return {
    monthlyCTC,
    annualCTC,
    fixedCompensation,
    variableCompensation,
    employerContributions,
    epfEmployer,
    esiEmployer,
    estimatedAnnualTakeHome,
  };
}

/**
 * Calculates Year-To-Date (YTD) summary metrics for an employee's statement history.
 */
export function calculateYTD(records = []) {
  if (!Array.isArray(records) || records.length === 0) {
    return {
      ytdGross: 0,
      ytdNet: 0,
      ytdTds: 0,
      ytdEpf: 0,
      ytdAllowances: 0,
      ytdDeductions: 0,
      recordCount: 0,
    };
  }

  let ytdGross = 0;
  let ytdNet = 0;
  let ytdTds = 0;
  let ytdEpf = 0;
  let ytdAllowances = 0;
  let ytdDeductions = 0;

  records.forEach((r) => {
    const basic = safeNum(r.basicSalary);
    const allow = r.totalAllowances !== undefined ? safeNum(r.totalAllowances) : calcTotalAllowances(r.allowancesObj || r);
    const deduct = r.totalDeductions !== undefined ? safeNum(r.totalDeductions) : calcTotalDeductions(r.deductionsObj || r);
    const gross = r.grossSalary !== undefined ? safeNum(r.grossSalary) : basic + allow;
    const net = r.netSalary !== undefined ? safeNum(r.netSalary) : gross - deduct;

    const tax = safeNum(r.tax || (r.deductionsObj && r.deductionsObj.tax));
    const pf = safeNum(r.pf || (r.deductionsObj && r.deductionsObj.providentFund));

    ytdGross += gross;
    ytdNet += net;
    ytdTds += tax;
    ytdEpf += pf;
    ytdAllowances += allow;
    ytdDeductions += deduct;
  });

  return {
    ytdGross,
    ytdNet,
    ytdTds,
    ytdEpf,
    ytdAllowances,
    ytdDeductions,
    recordCount: records.length,
  };
}

/**
 * Computes Month-to-Month financial statement comparison.
 */
export function comparePayrollPeriods(currentRecord, previousRecord) {
  if (!currentRecord) {
    return {
      hasComparison: false,
      grossDiff: 0,
      allowancesDiff: 0,
      deductionsDiff: 0,
      netDiff: 0,
    };
  }

  if (!previousRecord) {
    return {
      hasComparison: false,
      currentPeriod: currentRecord.periodLabel || currentRecord.period,
      currentNet: safeNum(currentRecord.netSalary),
      grossDiff: 0,
      allowancesDiff: 0,
      deductionsDiff: 0,
      netDiff: 0,
    };
  }

  const currGross = safeNum(currentRecord.grossSalary);
  const prevGross = safeNum(previousRecord.grossSalary);
  const grossDiff = currGross - prevGross;

  const currAllow = safeNum(currentRecord.totalAllowances);
  const prevAllow = safeNum(previousRecord.totalAllowances);
  const allowancesDiff = currAllow - prevAllow;

  const currDeduct = safeNum(currentRecord.totalDeductions);
  const prevDeduct = safeNum(previousRecord.totalDeductions);
  const deductionsDiff = currDeduct - prevDeduct;

  const currNet = safeNum(currentRecord.netSalary);
  const prevNet = safeNum(previousRecord.netSalary);
  const netDiff = currNet - prevNet;

  return {
    hasComparison: true,
    currentPeriod: currentRecord.periodLabel || currentRecord.period,
    previousPeriod: previousRecord.periodLabel || previousRecord.period,
    currentNet: currNet,
    previousNet: prevNet,
    grossDiff,
    allowancesDiff,
    deductionsDiff,
    netDiff,
  };
}
