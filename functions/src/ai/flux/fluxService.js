import { getPromptForVisualType } from './fluxValidation.js';
import admin from 'firebase-admin';

/**
 * Invoke NVIDIA NIM FLUX REST API for visual asset generation
 */
export const generateVisualAssetFlux = async (visualType) => {
  const apiKey = process.env.NVIDIA_NIM_API_KEY;
  const endpoint = process.env.NVIDIA_FLUX_ENDPOINT || 'https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux-1-schnell';
  const prompt = getPromptForVisualType(visualType);

  if (!apiKey || apiKey === 'your_nvidia_nim_api_key_here') {
    console.info('NVIDIA NIM API key missing for FLUX. Returning fallback asset placeholder.');
    return {
      type: visualType,
      imageUrl: null,
      isFallback: true,
    };
  }

  const payload = {
    prompt,
    mode: 'base',
    aspect_ratio: '16:9',
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`NVIDIA NIM FLUX API Error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const b64Data = data.artifacts?.[0]?.base64 || data.images?.[0]?.b64_json;
  
  if (!b64Data) {
    throw new Error('NVIDIA NIM FLUX returned empty image payload.');
  }

  const imageBuffer = Buffer.from(b64Data, 'base64');
  
  // Save generated asset into Firebase Storage
  try {
    const bucket = admin.storage().bucket();
    const filePath = `ai-assets/${visualType}/${Date.now()}_flux.png`;
    const file = bucket.file(filePath);
    
    await file.save(imageBuffer, {
      metadata: {
        contentType: 'image/png',
        metadata: {
          generatedBy: 'nvidia-nim-flux',
          visualType,
        },
      },
    });

    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2099',
    });

    return {
      type: visualType,
      storagePath: filePath,
      imageUrl: signedUrl,
      isFallback: false,
    };
  } catch (storageError) {
    console.warn('Firebase Storage upload failed, returning base64 data URL:', storageError.message);
    return {
      type: visualType,
      imageUrl: `data:image/png;base64,${b64Data}`,
      isFallback: false,
    };
  }
};
