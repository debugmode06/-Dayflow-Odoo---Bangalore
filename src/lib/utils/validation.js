/**
 * Form validation helpers for Dayflow HRMS
 */

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.toLowerCase())) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
};

export const validateRequired = (value, fieldName = 'Field') => {
  if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
    return `${fieldName} is required`;
  }
  return null;
};
