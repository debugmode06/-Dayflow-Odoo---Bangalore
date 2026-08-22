export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  return null;
};

export const validateEmployeeId = (employeeId) => {
  if (!employeeId) return 'Employee ID is required';
  const trimmed = employeeId.trim();
  if (trimmed.length < 3) return 'Employee ID must be at least 3 characters';
  // Example pattern: EMP-1234 or similar alphanumeric structure
  if (!/^[a-zA-Z0-9-]+$/.test(trimmed)) {
    return 'Employee ID can only contain letters, numbers, and hyphens';
  }
  return null;
};
