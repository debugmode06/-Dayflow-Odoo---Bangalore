import { payrollService } from './payrollService';

const PERMITTED_TRANSITIONS = {
  DRAFT: ['CALCULATED'],
  CALCULATED: ['APPROVED'],
  APPROVED: ['PAID'],
  PAID: [],
};

export async function transitionPayrollStatus(recordId, currentStatus = 'DRAFT', newStatus, performedBy = 'HR_ADMIN') {
  const allowedNext = PERMITTED_TRANSITIONS[currentStatus?.toUpperCase()] || [];
  if (!allowedNext.includes(newStatus.toUpperCase())) {
    throw new Error(
      `Invalid workflow transition: cannot move from ${currentStatus} to ${newStatus}. Allowed transitions: ${allowedNext.join(', ') || 'None (Finalized)'}`
    );
  }

  return await payrollService.updatePayrollStatus(recordId, newStatus.toUpperCase(), performedBy);
}
