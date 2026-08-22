/**
 * Controlled Llama 3.1 8B System Prompts for Dayflow HRMS
 */

export const DAYFLOW_SYSTEM_PROMPT = `
You are the Dayflow Workforce Intelligence Assistant.

You explain structured workforce metrics to HR professionals.
You must never invent facts or statistics that were not supplied.
You must only reason from the supplied metrics.
You do not make employment decisions.
You do not approve or reject leave.
You do not modify payroll.
You provide concise, professional, explainable insights.

FORMAT YOUR RESPONSE AS VALID JSON WITH THE FOLLOWING EXACT KEYS:
{
  "summary": "Concise 1-2 sentence workforce health summary",
  "positiveSignals": ["Signal 1", "Signal 2"],
  "attentionAreas": ["Area requiring HR attention 1", "Area 2"],
  "recommendations": ["Actionable HR review recommendation 1", "Recommendation 2"]
}
`.trim();

export const buildWorkforcePulsePrompt = (metrics) => {
  const {
    workforcePulse = 86,
    attendanceScore = 91,
    availabilityScore = 82,
    leaveLoadScore = 84,
    profileHealthScore = 88,
    lateArrivals = 6,
    absences = 2,
    recentPatterns = [],
  } = metrics;

  return `
Analyze the following structured Dayflow workforce metrics:

METRICS:
- Workforce Pulse Score: ${workforcePulse}/100
- Attendance Score: ${attendanceScore}/100
- Team Availability Score: ${availabilityScore}/100
- Leave Load Score: ${leaveLoadScore}/100
- Employee Profile Health Score: ${profileHealthScore}/100
- Late Arrival Count: ${lateArrivals}
- Absence Count: ${absences}
- Observed Operational Patterns: ${recentPatterns.length > 0 ? recentPatterns.join('; ') : 'Normal operations'}

Generate a concise HR brief explaining why the Workforce Pulse has a score of ${workforcePulse}. Do not invent missing facts. Output JSON only.
`.trim();
};

export const buildHRAssistantPrompt = (query, contextMetrics) => {
  return `
Answer the following natural-language HR query based ONLY on the supplied metrics context.

HR QUERY: "${query}"

CONTEXT METRICS:
${JSON.stringify(contextMetrics, null, 2)}

Provide a direct, explainable answer in JSON format:
{
  "answer": "Clear explanation referencing the metrics",
  "keyDrivers": ["Metric factor 1", "Metric factor 2"],
  "suggestedActions": ["Suggested HR review step"]
}
`.trim();
};

export const buildLeaveImpactPrompt = (leaveDetails) => {
  const {
    department = 'Engineering',
    requestedDays = 3,
    currentAvailability = 82,
    projectedAvailability = 68,
    existingLeavesCount = 2,
    impactLevel = 'MEDIUM',
  } = leaveDetails;

  return `
Explain the operational workforce impact of a leave application for HR decision-makers:

LEAVE DETAILS:
- Department: ${department}
- Duration: ${requestedDays} days
- Current Team Availability: ${currentAvailability}%
- Projected Availability if Approved: ${projectedAvailability}%
- Concurrent Employees on Leave: ${existingLeavesCount}
- Pre-Calculated Impact Rating: ${impactLevel}

Generate a concise 1-paragraph explanation of the staffing impact. Do NOT make the approval decision (HR makes the final decision). Output JSON format:
{
  "explanation": "Human-readable impact explanation",
  "staffingRisk": "Risk overview",
  "recommendation": "Objective suggestion for HR review"
}
`.trim();
};
