export const mapAuthError = (error) => {
  if (!error || !error.code) {
    return 'An unexpected authentication error occurred. Please try again.';
  }

  switch (error.code) {
    case 'auth/invalid-email':
      return 'The email address is invalid.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact HR.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 8 characters.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful login attempts. Please try again later.';
    case 'permission-denied':
      return 'You do not have permission to access this resource.';
    default:
      console.warn('Unhandled Auth Error:', error.code, error.message);
      return 'An authentication error occurred. Please try again.';
  }
};
