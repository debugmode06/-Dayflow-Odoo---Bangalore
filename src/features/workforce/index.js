/**
 * Feature Module: Workforce Pulse & Analytics (NVIDIA NIM Llama 3.1 8B & FLUX Integration)
 * Owned by: Member 4
 */

export { WorkforcePulseCard } from './components/WorkforcePulseCard';
export { WorkforcePulseDrawer } from './components/WorkforcePulseDrawer';
export { HRAIAssistantDrawer } from './components/HRAIAssistantDrawer';
export {
  fetchWorkforcePulseInsight,
  queryHRAssistantAI,
  fetchLeaveImpactAIExplanation,
} from './services/workforceAiService';

export const MODULE_NAME = 'workforce';
export default {
  name: MODULE_NAME,
};
