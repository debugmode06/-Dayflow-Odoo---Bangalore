/**
 * Profile field validation utilities.
 * Client-side validation — NOT a security boundary.
 * Firestore Rules enforce real security.
 */

const PHONE_REGEX = /^[+]?[\d\s\-().]{7,20}$/;
const NAME_REGEX = /^[a-zA-Z\s'-]{2,80}$/;

export const validateName = (value) => {
  const v = (value || '').trim();
  if (!v) return 'Name is required.';
  if (!NAME_REGEX.test(v)) return 'Name must be 2–80 characters (letters, spaces, hyphens).';
  return null;
};

export const validatePhone = (value) => {
  const v = (value || '').trim();
  if (!v) return null; // optional
  if (!PHONE_REGEX.test(v)) return 'Enter a valid phone number (7–20 digits, may include +, -, spaces).';
  return null;
};

export const validateAddress = (value) => {
  const v = (value || '').trim();
  if (!v) return null; // optional
  if (v.length < 5) return 'Address must be at least 5 characters.';
  if (v.length > 300) return 'Address must be under 300 characters.';
  return null;
};

export const validateDepartment = (value) => {
  const v = (value || '').trim();
  if (!v) return 'Department is required.';
  if (v.length < 2) return 'Department must be at least 2 characters.';
  if (v.length > 100) return 'Department must be under 100 characters.';
  return null;
};

export const validateDesignation = (value) => {
  const v = (value || '').trim();
  if (!v) return 'Designation is required.';
  if (v.length < 2) return 'Designation must be at least 2 characters.';
  if (v.length > 100) return 'Designation must be under 100 characters.';
  return null;
};

export const validateJoiningDate = (value) => {
  if (!value) return null; // optional
  const date = new Date(value);
  if (isNaN(date.getTime())) return 'Enter a valid date.';
  if (date > new Date()) return 'Joining date cannot be in the future.';
  return null;
};

export const validateSalaryAmount = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const num = parseFloat(value);
  if (isNaN(num)) return 'Must be a valid number.';
  if (num < 0) return 'Cannot be negative.';
  if (num > 10_000_000) return 'Value seems too large. Please check.';
  return null;
};

/**
 * Validate an employee profile edit form.
 * Returns an object of { fieldName: errorMessage }.
 */
export const validateProfileForm = (fields, isHR = false) => {
  const errors = {};

  if (isHR && fields.name !== undefined) {
    const e = validateName(fields.name);
    if (e) errors.name = e;
  }

  if (fields.phone !== undefined) {
    const e = validatePhone(fields.phone);
    if (e) errors.phone = e;
  }

  if (fields.address !== undefined) {
    const e = validateAddress(fields.address);
    if (e) errors.address = e;
  }

  if (isHR && fields.department !== undefined) {
    const e = validateDepartment(fields.department);
    if (e) errors.department = e;
  }

  if (isHR && fields.designation !== undefined) {
    const e = validateDesignation(fields.designation);
    if (e) errors.designation = e;
  }

  if (isHR && fields.joiningDate !== undefined) {
    const e = validateJoiningDate(fields.joiningDate);
    if (e) errors.joiningDate = e;
  }

  return errors;
};

/**
 * Validate a profile picture file.
 */
export const validateProfilePicture = (file) => {
  if (!file) return 'No file selected.';
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_SIZE_MB = 5;

  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Profile picture must be JPEG, PNG, or WebP.';
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `File size must be under ${MAX_SIZE_MB}MB.`;
  }
  return null;
};

/**
 * Validate a document file for upload.
 */
export const validateDocumentFile = (file) => {
  if (!file) return 'No file selected.';
  const ALLOWED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const MAX_SIZE_MB = 10;

  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Supported formats: PDF, JPEG, PNG, DOC, DOCX.';
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `File size must be under ${MAX_SIZE_MB}MB.`;
  }
  return null;
};
