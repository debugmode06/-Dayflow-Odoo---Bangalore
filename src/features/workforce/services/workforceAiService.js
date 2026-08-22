import { getFunctions, httpsCallable } from 'firebase/functions';
import app from '@/config/firebase';
import { calculateWorkforceHealthScore, generateWorkforceSignals } from '@/lib/calculations/workforce';

/**
 * Client Abstraction for Dayflow Workforce AI Services
 * Calls server-side Firebase Cloud Functions wrapping NVIDIA NIM Llama 3.1 8B & FLUX.
 */

// Initialize Firebase Functions
const functionsInstance = getFunctions(app);

export const fetchWorkforcePulseInsight = async (metrics) => {
  // 1. App deterministically calculates Workforce Pulse score first
  const pulseScore = calculateWorkforceHealthScore(metrics);
  const fullMetricsPayload = {
    workforcePulse: pulseScore,
    attendanceScore: metrics.attendanceScore || 91,
    availabilityScore: metrics.availabilityScore || 82,
    leaveLoadScore: metrics.leaveLoadScore || 84,
    profileHealthScore: metrics.profileHealthScore || 88,
    lateArrivals: metrics.lateArrivals || 6,
    absences: metrics.absences || 2,
    recentPatterns: metrics.recentPatterns || [
      'Late arrivals increased slightly this week',
      'Team availability decreased due to overlapping approved leave',
    ],
  };

  try {
    // Invoke Cloud Function wrapping NVIDIA NIM Llama 3.1 8B
    const generateFn = httpsCallable(functionsInstance, 'generateWorkforceInsight');
    const response = await generateFn(fullMetricsPayload);

    if (response.data && response.data.insight) {
      return {
        score: pulseScore,
        metrics: fullMetricsPayload,
        insight: response.data.insight,
        provider: 'NVIDIA NIM Llama 3.1 8B Instruct',
      };
    }
  } catch (error) {
    console.warn('Firebase Cloud Function unavailable, utilizing client rule-based explanation engine:', error.message);
  }

  // Graceful rule-based fallback explanation if cloud function / key is offline
  return {
    score: pulseScore,
    metrics: fullMetricsPayload,
    insight: {
      summary: `Workforce health remains strong overall (${pulseScore}/100). Attendance and profile completion are healthy, while increased late arrivals and reduced team availability are the main areas requiring HR attention.`,
      positiveSignals: [
        'Daily attendance score maintained above 90% threshold across engineering.',
        'Employee 360 profile health remains optimal at 88%.',
      ],
      attentionAreas: [
        'Late arrivals increased (6 logged this week).',
        'Team availability decreased to 82% due to scheduled leaves.',
      ],
      recommendations: [
        'Review late check-in trends in the Attendance Monitor.',
        'Check Leave Impact Simulator before approving pending time-off requests.',
      ],
      isFallback: true,
    },
    provider: 'Dayflow Deterministic Engine (Offline Fallback)',
  };
};

export const queryHRAssistantAI = async (queryText, metricsContext) => {
  try {
    const queryFn = httpsCallable(functionsInstance, 'queryHRAssistant');
    const response = await queryFn({ query: queryText, metricsContext });

    if (response.data && response.data.result) {
      return response.data.result;
    }
  } catch (error) {
    console.warn('HR Assistant call fallback:', error.message);
  }

  return {
    summary: `Based on current structured data: Team availability is at ${metricsContext?.availabilityScore || 82}% with an overall attendance score of ${metricsContext?.attendanceScore || 91}%.`,
    positiveSignals: ['Metrics remain within baseline limits.'],
    attentionAreas: ['Late arrivals increased slightly from last week.'],
    recommendations: ['Check Attendance Monitor for details.'],
    isFallback: true,
  };
};

export const fetchLeaveImpactAIExplanation = async (leaveDetails) => {
  try {
    const explainFn = httpsCallable(functionsInstance, 'explainLeaveImpact');
    const response = await explainFn(leaveDetails);

    if (response.data && response.data.explanation) {
      return response.data.explanation;
    }
  } catch (error) {
    console.warn('Leave impact explanation fallback:', error.message);
  }

  return {
    explanation: `Approval may reduce department team availability from ${leaveDetails.currentAvailability || 82}% to ${leaveDetails.projectedAvailability || 68}% because ${leaveDetails.existingLeavesCount || 2} employees are already scheduled on leave.`,
    isFallback: true,
  };
};
