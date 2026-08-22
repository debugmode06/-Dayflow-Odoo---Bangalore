import { buildInsightPrompt } from './promptBuilder';
import { getFallbackInsight } from './fallback';

/**
 * Interface to interact with a secure backend/Firebase Function endpoint for AI.
 * Falls back to deterministic insight if AI fails or is not yet connected.
 */
export const fetchAIInsight = async (pulseData) => {
  try {
    // We intentionally DO NOT call Gemini or OpenAI directly from the client.
    // In a production app, we would POST to our secure Firebase Function:
    // const response = await fetch('https://us-central1-dayflow.cloudfunctions.net/generateInsight', { ... });
    
    // Simulate backend call latency
    await new Promise(resolve => setTimeout(resolve, 800));

    // Since the secure backend endpoint is not provided/connected in this scope,
    // we safely route to the fallback insight logic as requested.
    // In a real environment, if the fetch succeeded, we'd return response.json().insight
    throw new Error('AI Backend Endpoint not configured');
    
  } catch (error) {
    console.warn('AI Insight fetch failed, using deterministic fallback:', error.message);
    return getFallbackInsight(pulseData);
  }
};
