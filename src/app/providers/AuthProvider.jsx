import React, { createContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { logout } from '@/features/auth/services/authService';
import LoadingScreen from '@/components/feedback/LoadingScreen';
import { DEFAULT_ROLE } from '@/features/auth/utils/roles';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await logout();
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      // onAuthStateChanged will handle setting user to null
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setIsEmailVerified(firebaseUser.emailVerified);
        
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setProfile(userData);
            setRole(userData.role || DEFAULT_ROLE);
          } else {
            console.warn('User profile not found in Firestore for UID:', firebaseUser.uid);
            setProfile(null);
            setRole(DEFAULT_ROLE);
          }
          
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
            photoURL: firebaseUser.photoURL,
            logout: handleLogout
          });
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            logout: handleLogout
          });
          setRole(DEFAULT_ROLE);
        }
      } else {
        setUser(null);
        setProfile(null);
        setRole(null);
        setIsEmailVerified(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [handleLogout]);



  const value = {
    user,
    profile,
    role,
    isAuthenticated: !!user,
    isEmailVerified,
    loading,
  };

  if (loading) {
    return <LoadingScreen message="Authenticating..." />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
