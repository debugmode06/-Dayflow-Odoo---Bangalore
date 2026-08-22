import { DAYFLOW_SYSTEM_PROMPT, buildWorkforcePulsePrompt, buildHRAssistantPrompt, buildLeaveImpactPrompt } from './llamaPrompts.js';
import { sanitizeInputMetrics, parseAndValidateLlamaResponse, generateLlamaFallback } from './llamaValidation.js';

/**
 * Invoke NVIDIA NIM Llama 3.1 8B Instruct via OpenAI-compatible REST API
 */
export const invokeNvidiaLlama = async (promptText) => {
  const apiKey = process.env.NVIDIA_NIM_API_KEY;
  const endpoint = process.env.NVIDIA_LLM_ENDPOINT || 'https://integrate.api.nvidia.com/v1/chat/completions';
  const model = process.env.NVIDIA_LLM_MODEL || 'meta/llama-3.1-8b-instruct';

  if (!apiKey || apiKey === 'your_nvidia_nim_api_key_here') {
    console.info('NVIDIA NIM API key not configured on server. Returning rule-based fallback.');
    return null;
  }

  const payload = {
    model,
    messages: [
      { role: 'system', content: DAYFLOW_SYSTEM_PROMPT },
      { role: 'user', content: promptText },
    ],
    temperature: 0.2,
    top_p: 0.7,
    max_tokens: 1024,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`NVIDIA NIM Llama API Error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const choice = data.choices?.[0]?.message?.content;
  return choice || null;
};

export const generateWorkforcePulseInsight = async (metrics) => {
  const cleanMetrics = sanitizeInputMetrics(metrics);
  const prompt = buildWorkforcePulsePrompt(cleanMetrics);

  try {
    const rawOutput = await invokeNvidiaLlama(prompt);
    return parseAndValidateLlamaResponse(rawOutput, cleanMetrics);
  } catch (error) {
    console.warn('Failed to generate Llama insight, falling back:', error.message);
    return generateLlamaFallback(cleanMetrics);
  }
};

export const answerHRAssistantQuery = async (query, metricsContext) => {
  const cleanMetrics = sanitizeInputMetrics(metricsContext);
  const prompt = buildHRAssistantPrompt(query, cleanMetrics);

  try {
    const rawOutput = await invokeNvidiaLlama(prompt);
    return parseAndValidateLlamaResponse(rawOutput, cleanMetrics);
  } catch (error) {
    console.warn('HR Assistant Llama query failed:', error.message);
    return generateLlamaFallback(cleanMetrics);
  }
};

export const explainLeaveImpactLlama = async (leaveDetails) => {
  const prompt = buildLeaveImpactPrompt(leaveDetails);

  try {
    const rawOutput = await invokeNvidiaLlama(prompt);
    return parseAndValidateLlamaResponse(rawOutput, leaveDetails);
  } catch (error) {
    console.warn('Leave Impact Llama explanation failed:', error.message);
    return generateLlamaFallback(leaveDetails);
  }
};
