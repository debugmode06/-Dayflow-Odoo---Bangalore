/**
 * Calculates the workforce availability score.
 * 
 * @param {Array} employees - Array of employee records.
 * @param {number} absentToday - Total number of absent employees today.
 * @param {number} onLeaveToday - Total number of employees on leave today.
 * @returns {Object} { score, breakdown, explanation }
 */
export const calculateAvailabilityScore = (employees = [], absentToday = 0, onLeaveToday = 0) => {
  const totalEmployees = employees.length;

  if (totalEmployees === 0) {
    return {
      score: null,
      breakdown: { available: 0, total: 0 },
      explanation: 'No employees found to calculate availability.',
      status: 'neutral'
    };
  }

  const availableEmployees = totalEmployees - absentToday - onLeaveToday;
  // Prevent negative availability if data is skewed
  const clampedAvailable = Math.max(0, availableEmployees);
  
  const rawScore = (clampedAvailable / totalEmployees) * 100;
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  let explanation = '';
  let status = 'stable';

  if (score >= 90) {
    explanation = 'Healthy workforce availability.';
    status = 'up';
  } else if (score >= 75) {
    explanation = 'Adequate workforce availability, but slightly reduced.';
    status = 'stable';
  } else {
    explanation = 'Availability is low due to absences and leaves.';
    status = 'down';
  }

  return {
    score,
    breakdown: {
      available: clampedAvailable,
      total: totalEmployees,
      absent: absentToday,
      onLeave: onLeaveToday
    },
    explanation,
    status
  };
};
