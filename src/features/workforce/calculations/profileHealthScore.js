import { MINIMUM_DATA_RULES } from './constants';

/**
 * Calculates the profile completeness score for the workforce.
 * 
 * @param {Array} employees - Array of employee records.
 * @returns {Object} { score, breakdown, explanation }
 */
export const calculateProfileHealthScore = (employees = []) => {
  const totalEmployees = employees.length;

  if (totalEmployees === 0) {
    return {
      score: null,
      breakdown: { incomplete: 0, total: 0 },
      explanation: 'No employees to evaluate profile health.',
      status: 'neutral'
    };
  }

  let totalPossibleFields = totalEmployees * MINIMUM_DATA_RULES.REQUIRED_PROFILE_FIELDS.length;
  let completedFields = 0;
  let completelyIncompleteProfiles = 0; // Profiles missing at least one required field

  employees.forEach(emp => {
    let empIncomplete = false;
    MINIMUM_DATA_RULES.REQUIRED_PROFILE_FIELDS.forEach(field => {
      if (emp[field] && String(emp[field]).trim() !== '') {
        completedFields++;
      } else {
        empIncomplete = true;
      }
    });
    if (empIncomplete) {
      completelyIncompleteProfiles++;
    }
  });

  const rawScore = (completedFields / totalPossibleFields) * 100;
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  let explanation = '';
  let status = 'stable';

  if (score >= 90) {
    explanation = completelyIncompleteProfiles > 0
      ? 'Employee profiles are mostly complete.'
      : 'All employee profiles are fully complete.';
    status = 'up';
  } else if (score >= 75) {
    explanation = `${completelyIncompleteProfiles} employee profiles are missing some required details.`;
    status = 'stable';
  } else {
    explanation = 'Multiple employee profiles are incomplete. Please update records.';
    status = 'down';
  }

  return {
    score,
    breakdown: {
      incompleteProfiles: completelyIncompleteProfiles,
      totalEmployees
    },
    explanation,
    status
  };
};
