/**
 * Prompt Builder for Workforce Pulse AI Explanation
 * Enforces privacy: Minimum structured data only, no PII or salary data!
 */

export const buildWorkforcePrompt = (metrics) => {
  const {
    attendanceScore = 95,
    availabilityPercentage = 90,
    leaveLoadCount = 3,
    recentAnomaliesCount = 1,
    departmentSummary = 'Engineering: 90% present, Product: 95% present',
  } = metrics;

  return `
You are the Workforce Intelligence Analyst for OdooSphere HRMS.
Analyze the following minimal aggregated workforce signals and provide a concise, high-level operational explanation for HR/Management.

WORKFORCE METRICS:
- Overall Attendance Score: ${attendanceScore}%
- Team Availability Rate: ${availabilityPercentage}%
- Concurrent Leave Load: ${leaveLoadCount} employees
- Anomaly Alerts (Late/Absent Patterns): ${recentAnomaliesCount}
- Department Breakdown: ${departmentSummary}

INSTRUCTIONS:
1. Provide a 2-sentence executive summary.
2. List 2 key positive operational signals.
3. Highlight up to 2 emerging workforce risks (if any).
4. Suggest 2 recommended review actions for HR.
Do NOT mention any specific individual's personal or financial details. Format response as JSON.
`.trim();
};

export default buildWorkforcePrompt;
