import React, { createContext, useState, useEffect } from 'react';
import { subscribeToAuthChanges, logoutUser } from '@/lib/firebase/auth';
import { getDocument } from '@/lib/firebase/firestore';
import LoadingScreen from '@/components/feedback/LoadingScreen';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('employee'); // 'employee' | 'hr' | 'admin'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user metadata/role from Firestore /users/{uid}
        try {
          const userDoc = await getDocument('users', firebaseUser.uid);
          const userRole = userDoc?.role || 'employee';
          setRole(userRole);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || userDoc?.name || firebaseUser.email?.split('@')[0],
            photoURL: firebaseUser.photoURL || userDoc?.avatarUrl,
            employeeId: userDoc?.employeeId || 'EMP-1001',
          });
        } catch (err) {
          console.warn('Could not fetch user profile from Firestore:', err);
          // Still set user from real Firebase Auth; Firestore role lookup failed
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          });
          setRole('employee');
        }
      } else {
        // No active Firebase Auth session — clear user state
        setUser(null);
        setRole('employee');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const value = {
    user: user ? { ...user, logout: handleLogout } : null,
    role,
    setRole, // Enabled for smooth demo role switching
    isAuthenticated: !!user,
    loading,
  };

  if (loading) {
    return <LoadingScreen message="Initializing Dayflow security context..." />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
