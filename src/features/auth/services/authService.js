import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendEmailVerification,
  reload
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, runTransaction } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { DEFAULT_ROLE } from '../utils/roles';
import { mapAuthError } from '../utils/authErrors';

import { withFallback, mockHelpers } from '@/lib/demoMode';

/**
 * Log in a user with email and password
 */
export const login = async (email, password) => {
  return await withFallback(
    async () => {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    },
    async () => {
      // Demo Mode Fallback — match against primary email OR emailAliases
      const users = mockHelpers.getCollection('users');
      const normalizedEmail = email.toLowerCase().trim();
      const user = users.find(u => {
        const primaryMatch = u.email.toLowerCase() === normalizedEmail;
        const aliasMatch = Array.isArray(u.emailAliases) && 
          u.emailAliases.some(alias => alias.toLowerCase() === normalizedEmail);
        return primaryMatch || aliasMatch;
      });
      
      if (!user) {
        throw new Error("Invalid email or password. (Demo Mode)");
      }
      // Accept any non-empty password in demo mode for convenience
      if (!password || password.length < 3) {
        throw new Error("Invalid email or password. (Demo Mode)");
      }

      localStorage.setItem('demo_user_uid', user.uid);
      window.dispatchEvent(new Event('demo_auth_change'));
      return { uid: user.uid, email: user.email, emailVerified: true };
    },
    'auth_login'
  );
};

/**
 * Sign up a new employee and create their Firestore profile
 */
export const signup = async (email, password, employeeId) => {
  const trimmedId = employeeId.trim();
  
  try {
    // 1. Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Ensure Auth token is propagated to Firestore SDK before executing transaction
    await user.getIdToken(true);

    try {
      // 2. Transactionally ensure Employee ID uniqueness and create profile
      await runTransaction(db, async (transaction) => {
        const empRef = doc(db, 'employeeIds', trimmedId);
        const empDoc = await transaction.get(empRef);
        
        if (empDoc.exists()) {
          throw new Error('DUPLICATE_EMP_ID');
        }
        
        const userRef = doc(db, 'users', user.uid);
        
        transaction.set(empRef, { uid: user.uid });
        transaction.set(userRef, {
          uid: user.uid,
          employeeId: trimmedId,
          email: email.trim(),
          role: DEFAULT_ROLE,
          emailVerified: false,
          status: 'active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
    } catch (transactionError) {
      // If transaction fails, clean up the created auth user
      await user.delete();
      
      if (transactionError.message === 'DUPLICATE_EMP_ID') {
        throw new Error(`An account with Employee ID ${trimmedId} already exists.`);
      }
      throw transactionError;
    }

    // 3. Send email verification
    await sendEmailVerification(user);

    return user;
  } catch (error) {
    console.error('Signup error details:', error);
    throw new Error(error.message.includes('Employee ID') ? error.message : mapAuthError(error));
  }
};

/**
 * Log out the current user
 */
export const logout = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
};

/**
 * Resend the verification email to the currently authenticated user
 */
export const resendVerification = async (user) => {
  const currentUser = auth.currentUser || user;
  if (!currentUser || !currentUser.email) throw new Error('No user authenticated.');
  try {
    await sendEmailVerification(currentUser);
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
};

/**
 * Reload the current user to check if email verification status changed
 */
export const refreshVerification = async (user) => {
  const currentUser = auth.currentUser || user;
  if (!currentUser) throw new Error('No user authenticated.');
  try {
    await reload(currentUser);
    return currentUser.emailVerified;
  } catch (error) {
    throw new Error(mapAuthError(error));
  }
};
