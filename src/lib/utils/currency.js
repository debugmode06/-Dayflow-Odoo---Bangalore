/**
 * Currency formatting utility helpers for Dayflow HRMS
 */

export const formatCurrency = (amount, currencyCode = 'USD', locale = 'en-US') => {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const calculateTaxDeductions = (baseSalary, taxRate = 0.2) => {
  if (!baseSalary) return 0;
  return Math.round(baseSalary * taxRate);
};
