import { generateWorkforcePulseInsight } from './llama/llamaService.js';

/**
 * Server-Side NVIDIA NIM Llama 3.1 8B Workforce Pulse Analysis
 * Ensures sensitive NVIDIA NIM API keys remain safely on the server backend.
 */
export const workforceInsightHandler = async (data) => {
  return await generateWorkforcePulseInsight(data);
};

export default workforceInsightHandler;
