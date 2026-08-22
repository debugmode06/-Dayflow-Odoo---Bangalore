// Constants for Workforce Pulse calculations

export const PULSE_WEIGHTS = {
  ATTENDANCE: 0.35,
  AVAILABILITY: 0.30,
  LEAVE_HEALTH: 0.20,
  PROFILE_HEALTH: 0.15,
};

export const STATUS_THRESHOLDS = {
  EXCELLENT: 90,
  HEALTHY: 75,
  WATCH: 60,
  NEEDS_ATTENTION: 0,
};

export const PULSE_LABELS = {
  EXCELLENT: 'EXCELLENT',
  HEALTHY: 'HEALTHY',
  WATCH: 'WATCH',
  NEEDS_ATTENTION: 'NEEDS ATTENTION',
};

export const PENALTIES = {
  LATE_ARRIVAL: 3,
  ABSENCE: 5,
  HALF_DAY: 2,
};

export const LEAVE_THRESHOLDS = {
  NORMAL: { SCORE: 90, LABEL: 'Normal leave activity' },
  MODERATE: { SCORE: 75, LABEL: 'Moderate leave pressure' },
  HIGH: { SCORE: 55, LABEL: 'High leave pressure' },
};

export const MINIMUM_DATA_RULES = {
  REQUIRED_PROFILE_FIELDS: ['department', 'designation', 'email', 'name', 'joiningDate'],
};
