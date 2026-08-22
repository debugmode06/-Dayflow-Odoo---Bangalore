/**
 * Whitelisted Prompts & Validation for NVIDIA NIM FLUX Image Generation
 */

export const ALLOWED_VISUAL_TYPES = {
  'onboarding': 'Create a premium minimal HR technology illustration for a modern enterprise employee onboarding experience. Clean light background, sophisticated SaaS visual language, subtle professional shapes, elegant composition, no text, no watermark.',
  'empty-attendance': 'Create a modern minimalist SaaS dashboard empty state illustration for daily attendance tracking. Soft neutral background, crisp clean geometry, professional Apple-inspired design aesthetic, no text.',
  'empty-leave': 'Create a modern minimalist HR illustration for time-off and leave management. Soft neutral background, balanced calendar elements, elegant corporate visual language, no text.',
  'empty-payroll': 'Create a sleek corporate financial HR illustration representing payroll overview and compensation structure. Clean white and slate aesthetic, elegant visual flow, no text.',
  'dashboard': 'Create a premium executive HR analytics dashboard header graphic. Soft neutral background, subtle glowing data nodes, clean Apple-like minimalist aesthetic, no text.',
  'success': 'Create an elegant enterprise success checkmark illustration for HR workflow approvals. Clean light background, refined gradient accents, soft depth, no text.',
};

export const getPromptForVisualType = (type) => {
  if (!type || !ALLOWED_VISUAL_TYPES[type]) {
    throw new Error(`Invalid visual asset type "${type}". Allowed types: ${Object.keys(ALLOWED_VISUAL_TYPES).join(', ')}`);
  }
  return ALLOWED_VISUAL_TYPES[type];
};
