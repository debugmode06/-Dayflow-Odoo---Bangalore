/**
 * Validation & Fallback Engine for NVIDIA NIM Llama 3.1 8B
 */

export const sanitizeInputMetrics = (rawMetrics = {}) => {
  // Strip any potential PII or salary fields before sending to AI
  const clean = { ...rawMetrics };
  delete clean.salary;
  delete clean.baseSalary;
  delete clean.taxId;
  delete clean.password;
  delete clean.ssn;
  delete clean.email;
  delete clean.address;
  delete clean.bankAccount;

  return clean;
};

export const parseAndValidateLlamaResponse = (rawResponseText, fallbackContext = {}) => {
  if (!rawResponseText) return generateLlamaFallback(fallbackContext);

  try {
    // Attempt parsing JSON from markdown response or raw string
    const jsonMatch = rawResponseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        summary: parsed.summary || parsed.explanation || parsed.answer || 'Workforce metrics summarized successfully.',
        positiveSignals: Array.isArray(parsed.positiveSignals) ? parsed.positiveSignals : ['Attendance and profile health remain within baseline.'],
        attentionAreas: Array.isArray(parsed.attentionAreas) ? parsed.attentionAreas : (parsed.keyDrivers || ['Review recent late arrival trends.']),
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : (parsed.suggestedActions || ['Verify department schedule.']),
        isFallback: false,
      };
    }
  } catch (err) {
    console.warn('Llama response parsing warning, using fallback wrapper:', err);
  }

  return generateLlamaFallback(fallbackContext);
};

export const generateLlamaFallback = (metrics = {}) => {
  const pulse = metrics.workforcePulse || 86;
  const attendance = metrics.attendanceScore || 91;
  const availability = metrics.availabilityScore || 82;

  return {
    summary: `Workforce health remains stable at ${pulse}/100. Core attendance rate is at ${attendance}%, with team availability hovering at ${availability}%.`,
    positiveSignals: [
      'Core department staffing remains above minimal operational threshold.',
      'Employee profile completion is healthy across departments.',
    ],
    attentionAreas: [
      metrics.lateArrivals > 3 ? `${metrics.lateArrivals} late arrivals logged this week requiring HR review.` : 'Team availability warrants periodic scheduling review.',
    ],
    recommendations: [
      'Monitor weekly attendance trends in HR Command Center.',
      'Cross-check upcoming overlapping leave requests.',
    ],
    isFallback: true,
  };
};
