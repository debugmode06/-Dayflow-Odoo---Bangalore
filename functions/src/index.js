import { onCall, HttpsError } from 'firebase-functions/v2/https';
import admin from 'firebase-admin';
import { generateWorkforcePulseInsight, answerHRAssistantQuery, explainLeaveImpactLlama } from './ai/llama/llamaService.js';
import { generateVisualAssetFlux } from './ai/flux/fluxService.js';

if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * 1. Generate Workforce Pulse Explanation via NVIDIA NIM Llama 3.1 8B
 */
export const generateWorkforceInsight = onCall({ cors: true }, async (request) => {
  // Authentication Guard
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated to invoke Dayflow AI functions.');
  }

  const { data } = request;
  if (!data || typeof data !== 'object') {
    throw new HttpsError('invalid-argument', 'Invalid or missing structured workforce metrics payload.');
  }

  // Generate explainable insight using Llama 3.1 8B
  const insight = await generateWorkforcePulseInsight(data);
  return {
    success: true,
    insight,
    provider: 'nvidia-nim-llama-3.1-8b',
  };
});

/**
 * 2. Natural-Language HR Assistant Query via NVIDIA NIM Llama 3.1 8B
 */
export const queryHRAssistant = onCall({ cors: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required.');
  }

  const { query, metricsContext } = request.data || {};
  if (!query || typeof query !== 'string') {
    throw new HttpsError('invalid-argument', 'Natural-language query string is required.');
  }

  const result = await answerHRAssistantQuery(query, metricsContext || {});
  return {
    success: true,
    result,
    provider: 'nvidia-nim-llama-3.1-8b',
  };
});

/**
 * 3. Leave Impact Explanation via NVIDIA NIM Llama 3.1 8B
 */
export const explainLeaveImpact = onCall({ cors: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required.');
  }

  const leaveDetails = request.data || {};
  const explanation = await explainLeaveImpactLlama(leaveDetails);
  return {
    success: true,
    explanation,
    provider: 'nvidia-nim-llama-3.1-8b',
  };
});

/**
 * 4. Generate Premium Visual Asset via NVIDIA NIM FLUX
 */
export const generateVisualAsset = onCall({ cors: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required.');
  }

  const { type } = request.data || {};
  if (!type) {
    throw new HttpsError('invalid-argument', 'Visual asset type is required.');
  }

  const asset = await generateVisualAssetFlux(type);
  return {
    success: true,
    asset,
    provider: 'nvidia-nim-flux',
  };
});
