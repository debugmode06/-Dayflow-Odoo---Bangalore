/**
 * Date and time formatting utility helpers for Dayflow HRMS
 */

export const formatDate = (dateInput, options = {}) => {
  if (!dateInput) return '—';
  const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
  if (isNaN(date.getTime())) return 'Invalid date';

  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
};

export const formatTime = (timeInput) => {
  if (!timeInput) return '—';
  const date = timeInput.toDate ? timeInput.toDate() : new Date(timeInput);
  if (isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

export const calculateDurationHours = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const start = startTime.toDate ? startTime.toDate() : new Date(startTime);
  const end = endTime.toDate ? endTime.toDate() : new Date(endTime);
  
  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return 0;

  const hours = diffMs / (1000 * 60 * 60);
  return Math.round(hours * 10) / 10; // Round to 1 decimal place
};

export const calculateDaysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};
