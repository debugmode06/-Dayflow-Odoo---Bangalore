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
    case 'auth/configuration-not-found':
    case 'auth/operation-not-allowed':
    case 'auth/admin-restricted-operation':
      return 'Email/Password sign-in is disabled in your Firebase Console. Please enable Email/Password provider under Authentication > Sign-in method.';
    case 'auth/invalid-api-key':
      return 'Invalid Firebase API key. Please check your .env configuration.';
    case 'permission-denied':
      return 'Firestore permission denied. Please check database security rules.';
    default:
      console.warn('Unhandled Auth Error:', error.code, error.message);
      return error.message ? `Authentication error: ${error.message}` : `An authentication error occurred (${error.code || 'unknown'}).`;
  }
};
