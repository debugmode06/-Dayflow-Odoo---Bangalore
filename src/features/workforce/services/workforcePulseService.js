import { dashboardService } from './dashboardService';
import { calculateWorkforcePulse } from '../calculations/workforcePulse';
import { fetchAIInsight } from '../ai/aiService';

class WorkforcePulseService {
  async getPulseData() {
    try {
      // Reuse existing dashboard data to prevent duplicate queries
      const stats = await dashboardService.getDashboardStats();
      
      const pulseData = {
        employees: stats.employees || [],
        attendanceRecords: stats.attendanceRecords || [],
        absentToday: stats.absentToday || 0,
        onLeaveToday: stats.onLeaveToday || 0,
        leavesToday: stats.leavesToday || [],
        pendingLeaves: stats.pendingLeaveRequests || []
      };

      // Calculate deterministic core signal scores
      const pulseResult = calculateWorkforcePulse(pulseData);

      // Fetch AI explanation based purely on the calculated deterministic data
      const aiInsight = await fetchAIInsight(pulseResult);

      return {
        ...pulseResult,
        aiInsight
      };

    } catch (error) {
      console.error('Failed to get workforce pulse data:', error);
      throw error;
    }
  }
}

export const workforcePulseService = new WorkforcePulseService();
