/**
 * Leave calculations & Leave Impact Simulator for Dayflow HRMS
 */

export const DEFAULT_LEAVE_ALLOWANCE = {
  paid: 18,
  sick: 10,
  casual: 7,
  unpaid: 30,
};

export const calculateRemainingLeave = (totalAllowance = DEFAULT_LEAVE_ALLOWANCE, usedLeave = {}) => {
  return {
    paid: Math.max(0, (totalAllowance.paid || 0) - (usedLeave.paid || 0)),
    sick: Math.max(0, (totalAllowance.sick || 0) - (usedLeave.sick || 0)),
    casual: Math.max(0, (totalAllowance.casual || 0) - (usedLeave.casual || 0)),
    unpaid: Math.max(0, (totalAllowance.unpaid || 0) - (usedLeave.unpaid || 0)),
  };
};

export const simulateLeaveImpact = ({
  department,
  requestedStartDate,
  requestedEndDate,
  departmentTotalCount = 10,
  activeDepartmentLeaves = [],
}) => {
  const newLeaveCount = activeDepartmentLeaves.length + 1;
  const percentageAbsent = Math.round((newLeaveCount / departmentTotalCount) * 100);

  let impactLevel = 'low'; // low | medium | high | critical
  let recommendation = 'Safe to approve. Department staffing remains robust.';

  if (percentageAbsent > 40) {
    impactLevel = 'critical';
    recommendation = `CRITICAL: Over ${percentageAbsent}% of ${department} will be absent concurrently. Recommend review or coverage plan.`;
  } else if (percentageAbsent > 25) {
    impactLevel = 'high';
    recommendation = `HIGH IMPACT: ${percentageAbsent}% of ${department} absent. Verify project deadlines.`;
  } else if (percentageAbsent > 15) {
    impactLevel = 'medium';
    recommendation = `MODERATE: ${percentageAbsent}% department leave overlap.`;
  }

  return {
    department,
    concurrentAbsences: newLeaveCount,
    departmentTotalCount,
    percentageAbsent,
    impactLevel,
    recommendation,
  };
};
