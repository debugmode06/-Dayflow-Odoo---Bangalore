/**
 * Leave Impact Simulator - Core Intelligence Engine
 * 
 * Provides deterministic calculations for workforce availability and leave impact.
 */

export const IMPACT_THRESHOLDS = {
  LOW: 80,    // Projected availability >= 80%
  MEDIUM: 60, // Projected availability >= 60% and < 80%
  HIGH: 0     // Projected availability < 60%
};

/**
 * Safely parse a date string (YYYY-MM-DD) into a UTC Date object to avoid timezone shifts.
 */
const parseDateSafe = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return null;
  const parts = dateString.split('-');
  if (parts.length !== 3) return null;
  
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed
  const day = parseInt(parts[2], 10);
  
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  
  return new Date(Date.UTC(year, month, day));
};

/**
 * Calculates inclusive calendar days between two dates.
 */
export const calculateLeaveDuration = (startDate, endDate) => {
  const start = parseDateSafe(startDate);
  const end = parseDateSafe(endDate);
  
  if (!start || !end) return 0;
  if (end < start) return 0;
  
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays + 1; // Inclusive of start day
};

/**
 * Finds existing leave records that overlap with the requested dates.
 * Excludes rejected leaves and leaves by the requesting employee.
 */
export const findOverlappingLeaves = (requestedStart, requestedEnd, existingLeaves = [], requestingUserId = null) => {
  const reqStart = parseDateSafe(requestedStart);
  const reqEnd = parseDateSafe(requestedEnd);
  
  if (!reqStart || !reqEnd || reqEnd < reqStart) return [];
  if (!Array.isArray(existingLeaves)) return [];

  return existingLeaves.filter(leave => {
    // Ignore invalid records
    if (!leave.startDate || !leave.endDate) return false;
    
    // Exclude rejected requests
    if (leave.status === 'rejected') return false;
    
    // Exclude the requester's own existing requests from overlap calculations
    if (requestingUserId && leave.userId === requestingUserId) return false;

    const existStart = parseDateSafe(leave.startDate);
    const existEnd = parseDateSafe(leave.endDate);
    
    if (!existStart || !existEnd) return false;

    // Overlap condition: existStart <= reqEnd AND existEnd >= reqStart
    return existStart <= reqEnd && existEnd >= reqStart;
  });
};

/**
 * Determines the impact level based on projected availability.
 */
export const determineImpactLevel = (projectedAvailability) => {
  if (projectedAvailability >= IMPACT_THRESHOLDS.LOW) return 'LOW';
  if (projectedAvailability >= IMPACT_THRESHOLDS.MEDIUM) return 'MEDIUM';
  return 'HIGH';
};

/**
 * Generates a human-readable, deterministic explanation of the impact.
 */
export const generateExplanation = (duration, overlappingCount, currentAvail, projectedAvail) => {
  const durationText = duration === 1 ? '1 day' : `${duration} days`;
  const overlapText = overlappingCount === 1 ? '1 employee is' : `${overlappingCount} employees are`;
  const diffText = (projectedAvail - currentAvail).toFixed(1);
  
  let explanation = `${durationText} requested. `;
  
  if (overlappingCount > 0) {
    explanation += `${overlapText} already unavailable during this period. `;
  } else {
    explanation += 'No other employees are on leave during this period. ';
  }
  
  explanation += `Projected workforce availability would change from ${currentAvail.toFixed(1)}% to ${projectedAvail.toFixed(1)}%. `;
  
  if (projectedAvail < IMPACT_THRESHOLDS.LOW) {
    explanation += 'Review recommended.';
  } else {
    explanation += 'Impact is minimal.';
  }
  
  return explanation.trim();
};

/**
 * Main intelligence function to calculate workforce impact of a leave request.
 */
export const calculateLeaveImpact = ({
  requestedStartDate,
  requestedEndDate,
  requestingUserId = null,
  existingLeaves = [],
  totalEmployees = 100 // Fallback workforce size if not provided by context
}) => {
  const safeTotal = Math.max(1, parseInt(totalEmployees, 10) || 100);
  const duration = calculateLeaveDuration(requestedStartDate, requestedEndDate);
  
  // If invalid dates, return safe empty object
  if (duration === 0) {
    return {
      leaveDuration: 0,
      overlappingLeaveCount: 0,
      currentUnavailableCount: 0,
      projectedUnavailableCount: 0,
      currentAvailability: 100,
      projectedAvailability: 100,
      availabilityChange: 0,
      impactLevel: 'LOW',
      overlapDetected: false,
      explanation: 'Invalid date range provided.'
    };
  }

  const overlappingLeaves = findOverlappingLeaves(requestedStartDate, requestedEndDate, existingLeaves, requestingUserId);
  const overlappingCount = overlappingLeaves.length;
  
  const currentUnavailableCount = overlappingCount;
  const projectedUnavailableCount = currentUnavailableCount + 1; // Existing + Requesting Employee
  
  // Calculate availability percentages
  // Ensure we don't go below 0% availability
  const safeCurrentUnavailable = Math.min(currentUnavailableCount, safeTotal);
  const safeProjectedUnavailable = Math.min(projectedUnavailableCount, safeTotal);

  const currentAvailability = ((safeTotal - safeCurrentUnavailable) / safeTotal) * 100;
  const projectedAvailability = ((safeTotal - safeProjectedUnavailable) / safeTotal) * 100;
  
  // Percentage points change
  const availabilityChange = projectedAvailability - currentAvailability;
  
  const impactLevel = determineImpactLevel(projectedAvailability);
  
  const explanation = generateExplanation(
    duration, 
    overlappingCount, 
    currentAvailability, 
    projectedAvailability
  );

  return {
    leaveDuration: duration,
    overlappingLeaveCount: overlappingCount,
    currentUnavailableCount: safeCurrentUnavailable,
    projectedUnavailableCount: safeProjectedUnavailable,
    currentAvailability,
    projectedAvailability,
    availabilityChange,
    impactLevel,
    overlapDetected: overlappingCount > 0,
    explanation
  };
};
