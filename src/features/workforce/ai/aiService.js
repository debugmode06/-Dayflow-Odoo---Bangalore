import { fetchWorkforcePulseInsight } from '../services/workforceAiService';

/**
 * NVIDIA NIM Llama 3.1 8B Client Service Bridge for Dayflow
 */
export const getWorkforceAIExplanation = async (metrics) => {
  const result = await fetchWorkforcePulseInsight(metrics);
  return result.insight;
};

export default getWorkforceAIExplanation;
