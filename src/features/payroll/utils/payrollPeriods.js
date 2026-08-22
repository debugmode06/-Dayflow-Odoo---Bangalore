/**
 * Utility functions for Payroll Period Management
 * Format: "YYYY-MM" (e.g., "2026-08")
 */

export function getCurrentPeriodKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getPeriodLabel(periodKey) {
  if (!periodKey || typeof periodKey !== 'string') return 'Current Period';
  const [yearStr, monthStr] = periodKey.split('-');
  if (!yearStr || !monthStr) return periodKey;

  const date = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function getRecentPeriods(count = 12) {
  const periods = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const key = `${year}-${month}`;
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    periods.push({ key, label });
  }

  return periods;
}
