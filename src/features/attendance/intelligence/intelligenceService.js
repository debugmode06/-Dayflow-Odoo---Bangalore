import { calculateAttendanceMetrics, compareMetrics } from './attendanceMetrics';
import { calculateAttendanceScore } from './scoreCalculator';
import { detectPatterns } from './patternDetector';

/**
 * Pure function pipeline to process raw records into intelligence.
 * @param {Array} currentPeriodRecords 
 * @param {Array} previousPeriodRecords 
 */
export const generateIntelligence = (currentPeriodRecords = [], previousPeriodRecords = []) => {
  // 1. Base Metrics
  const currentMetrics = calculateAttendanceMetrics(currentPeriodRecords);
  const previousMetrics = calculateAttendanceMetrics(previousPeriodRecords);

  // 2. Score (based on current period)
  const scoreData = calculateAttendanceScore(currentMetrics);

  // 3. Comparison
  const comparison = compareMetrics(currentMetrics, previousMetrics);

  // 4. Pattern Detection
  const patterns = detectPatterns(comparison, currentMetrics);

  return {
    metrics: currentMetrics,
    score: scoreData,
    comparison,
    patterns
  };
};
