/**
 * Thresholds established in Phase 1 Audit
 */
const THRESHOLDS = {
  LATE_INCREASE_PCT: 33,
  ABSENCE_MIN_COUNT: 2,
  PERFECT_PUNCTUALITY_DAYS: 10
};

const SEVERITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
};

/**
 * Detects patterns by analyzing the comparison between two periods
 * @param {Object} comparison - Output from compareMetrics()
 * @param {Object} currentMetrics - Output from calculateAttendanceMetrics()
 * @returns {Array} Array of pattern objects
 */
export const detectPatterns = (comparison, currentMetrics) => {
  const patterns = [];

  // 1. LATE_TREND (Increasing)
  if (comparison.lateCount.trend === 'INCREASING' && comparison.lateCount.percentageChange >= THRESHOLDS.LATE_INCREASE_PCT) {
    patterns.push({
      id: 'late-arrivals-increased',
      type: 'LATE_TREND',
      severity: SEVERITY.MEDIUM,
      title: 'Late arrivals increased',
      metric: 'lateCount',
      currentValue: comparison.lateCount.current,
      previousValue: comparison.lateCount.previous,
      difference: comparison.lateCount.difference,
      percentageChange: comparison.lateCount.percentageChange,
      evidence: [
        `${comparison.lateCount.current} late arrival(s) in current period`,
        `${comparison.lateCount.previous} late arrival(s) in previous period`
      ],
      explanation: `Late arrivals increased by ${comparison.lateCount.percentageChange}% compared with the previous period.`
    });
  }

  // 2. LATE_TREND (Decreasing/Improving)
  if (comparison.lateCount.trend === 'DECREASING') {
    patterns.push({
      id: 'late-arrivals-decreased',
      type: 'PUNCTUALITY_IMPROVEMENT',
      severity: SEVERITY.LOW, // Low severity = Positive
      title: 'Punctuality improved',
      metric: 'lateCount',
      currentValue: comparison.lateCount.current,
      previousValue: comparison.lateCount.previous,
      difference: Math.abs(comparison.lateCount.difference),
      percentageChange: Math.abs(comparison.lateCount.percentageChange),
      evidence: [
        `${comparison.lateCount.current} late arrival(s) currently, down from ${comparison.lateCount.previous}`
      ],
      explanation: 'You have fewer late arrivals this period.'
    });
  }

  // 3. PERFECT_PUNCTUALITY
  if (currentMetrics.lateCount === 0 && currentMetrics.totalDays >= THRESHOLDS.PERFECT_PUNCTUALITY_DAYS) {
    patterns.push({
      id: 'perfect-punctuality',
      type: 'STRONG_PUNCTUALITY',
      severity: SEVERITY.LOW,
      title: 'Consistent punctuality',
      metric: 'onTimePercentage',
      currentValue: 100,
      previousValue: 100,
      difference: 0,
      percentageChange: 0,
      evidence: [
        `0 late arrivals over ${currentMetrics.totalDays} recorded days`
      ],
      explanation: 'Excellent punctuality pattern maintained.'
    });
  }

  // 4. CHRONIC_ABSENCE
  if (currentMetrics.absentCount >= THRESHOLDS.ABSENCE_MIN_COUNT) {
    patterns.push({
      id: 'chronic-absence',
      type: 'ABSENCE_TREND',
      severity: SEVERITY.HIGH,
      title: 'Absence frequency warning',
      metric: 'absentCount',
      currentValue: currentMetrics.absentCount,
      previousValue: comparison.absentCount.previous,
      difference: comparison.absentCount.difference,
      percentageChange: comparison.absentCount.percentageChange,
      evidence: [
        `${currentMetrics.absentCount} undocumented absences in current period`
      ],
      explanation: 'Unusual absence frequency detected.'
    });
  }

  return patterns;
};
