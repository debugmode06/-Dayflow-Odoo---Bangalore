import { LEAVE_THRESHOLDS } from './constants';

/**
 * Calculates the Leave Health Score.
 * Evaluates overlapping leaves and pending requests.
 * 
 * @param {Array} employees - Total employee records.
 * @param {Array} leavesToday - Leaves approved for today.
 * @param {Array} pendingLeaves - Total pending leave requests.
 * @returns {Object} { score, breakdown, explanation }
 */
export const calculateLeaveHealthScore = (employees = [], leavesToday = [], pendingLeaves = []) => {
  const totalEmployees = employees.length;

  if (totalEmployees === 0) {
    return {
      score: null,
      breakdown: { overlapping: 0, pending: 0 },
      explanation: 'No employees to evaluate leave load.',
      status: 'neutral'
    };
  }

  const overlappingCount = leavesToday.length;
  const pendingCount = pendingLeaves.length;
  
  // Calculate pressure ratio (overlapping + half of pending weight / total employees)
  // E.g. 5 on leave + 2 pending out of 100 = (5 + 1) / 100 = 0.06 (6% pressure)
  const pressureRatio = (overlappingCount + (pendingCount * 0.5)) / totalEmployees;

  let scoreObj = LEAVE_THRESHOLDS.NORMAL;
  let status = 'stable';
  
  if (pressureRatio > 0.15) {
    // High pressure if > 15% of workforce is involved in leave activity
    scoreObj = LEAVE_THRESHOLDS.HIGH;
    status = 'down';
  } else if (pressureRatio > 0.05) {
    // Moderate pressure if > 5%
    scoreObj = LEAVE_THRESHOLDS.MODERATE;
    status = 'stable';
  } else {
    scoreObj = LEAVE_THRESHOLDS.NORMAL;
    status = 'up';
  }

  let explanation = scoreObj.LABEL;
  if (pendingCount > 5) {
    explanation += `. High number of pending leaves (${pendingCount}) requires attention.`;
    status = 'down';
  }

  return {
    score: scoreObj.SCORE,
    breakdown: {
      overlapping: overlappingCount,
      pending: pendingCount,
      totalEmployees
    },
    explanation,
    status
  };
};
