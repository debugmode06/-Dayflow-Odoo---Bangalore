/**
 * Fallback Workforce Pulse Explanations when AI service is offline or rate limited.
 */

export const generateFallbackInsight = ({ attendanceScore = 95, availability = 90, pendingLeaves = 2 }) => {
  return {
    summary: `Workforce operates at ${attendanceScore}% attendance efficiency with ${availability}% active team availability.`,
    positiveSignals: [
      'Core department staffing remains above normal operational threshold.',
      'Leave requests are balanced across engineering and product schedules.',
    ],
    emergingRisks: [
      pendingLeaves > 3 ? `${pendingLeaves} leave requests pending HR authorization.` : 'No critical operational risks identified at this time.',
    ],
    recommendedReviews: [
      'Verify weekly attendance log entries.',
      'Check upcoming holiday shift schedules.',
    ],
    isFallback: true,
  };
};

export default generateFallbackInsight;
