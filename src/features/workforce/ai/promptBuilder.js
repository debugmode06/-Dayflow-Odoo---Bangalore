/**
 * Safely strips PII and builds a prompt for the AI.
 */
export const buildInsightPrompt = (pulseData) => {
  // Extract only aggregate data, completely ignoring employee IDs, names, etc.
  const safeData = {
    pulseScore: pulseData.score,
    pulseStatus: pulseData.status,
    attendanceScore: pulseData.signals.attendance.score,
    availabilityScore: pulseData.signals.availability.score,
    leaveHealthScore: pulseData.signals.leaveHealth.score,
    profileHealthScore: pulseData.signals.profileHealth.score,
    lates: pulseData.signals.attendance.breakdown.lates,
    absences: pulseData.signals.attendance.breakdown.absences,
    pendingLeaves: pulseData.signals.leaveHealth.breakdown.pending,
    overlappingLeaves: pulseData.signals.leaveHealth.breakdown.overlapping,
  };

  const prompt = `
    You are an expert HR analytics AI. Analyze the following aggregate workforce pulse data and provide a concise 3-4 sentence explanation of the workforce health.
    Do NOT state the exact scores (e.g., don't say "Attendance is 91").
    Do NOT calculate the official score.
    Do NOT invent data.
    Do NOT recommend firing, hiring, or making automated employment decisions.
    
    Data:
    ${JSON.stringify(safeData, null, 2)}
    
    Format:
    Provide a professional, human-readable summary. Recommend a focus area based on the metrics.
  `;

  return prompt;
};
