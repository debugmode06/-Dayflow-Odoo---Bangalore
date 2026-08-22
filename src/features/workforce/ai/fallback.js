/**
 * Generates a deterministic fallback insight when AI is unavailable or fails.
 */
export const getFallbackInsight = (pulseData) => {
  const { score, status, signals, reasons } = pulseData;

  if (score === null) {
    return 'Insufficient data to generate a workforce insight.';
  }

  let insight = `Workforce health is currently ${status}. `;

  if (signals.attendance.score && signals.attendance.score >= 80) {
    insight += 'Attendance remains the strongest workforce signal. ';
  }

  if (reasons.warnings.length > 0) {
    insight += `However, some areas require attention, particularly: ${reasons.warnings[0].toLowerCase()}. `;
  }

  insight += 'Availability should be monitored alongside current leave activity.';

  return insight;
};
