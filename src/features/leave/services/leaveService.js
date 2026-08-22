import app, { db } from '@/config/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  serverTimestamp, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { withFallback, mockHelpers } from '@/lib/demoMode';

const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

export const applyForLeave = async (userId, userName, leaveData) => {
  return await withFallback(
    async () => {
      const leaveRef = collection(db, 'leaves');
      return await addDoc(leaveRef, {
        userId,
        userName,
        ...leaveData,
        status: 'pending',
        hrComment: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    },
    async () => {
      return mockHelpers.addDocument('leaves', {
        userId,
        userName,
        ...leaveData,
        status: 'pending',
        hrComment: '',
      });
    },
    'leaves'
  );
};

export const subscribeToEmployeeLeaves = (userId, callback) => {
  if (IS_DEMO_MODE) {
    const notify = () => {
      const allLeaves = mockHelpers.queryCollection('leaves', { userId });
      const sorted = allLeaves.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      callback(sorted);
    };
    notify();
    window.addEventListener('demo_store_changed', notify);
    return () => window.removeEventListener('demo_store_changed', notify);
  }

  const q = query(
    collection(db, 'leaves'), 
    where('userId', '==', userId)
  );
  return onSnapshot(q, (snapshot) => {
    let leaves = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort on client to avoid requiring a Firestore composite index
    leaves.sort((a, b) => {
      const dateA = a.createdAt ? (a.createdAt.seconds || 0) : 0;
      const dateB = b.createdAt ? (b.createdAt.seconds || 0) : 0;
      return dateB - dateA;
    });

    callback(leaves);
  }, (error) => {
    console.error("Snapshot error:", error);
    callback([]);
  });
};

export const fetchSanitizedLeaves = async () => {
  return await withFallback(
    async () => {
      const functionsInstance = getFunctions(app);
      const getSanitizedFn = httpsCallable(functionsInstance, 'getSanitizedLeaves');
      const response = await getSanitizedFn();
      return response.data.leaves || [];
    },
    async () => {
      return mockHelpers.getCollection('leaves');
    },
    'leaves'
  );
};

export const subscribeToAllLeaves = (callback) => {
  if (IS_DEMO_MODE) {
    const notify = () => {
      const allLeaves = mockHelpers.getCollection('leaves');
      const sorted = allLeaves.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      callback(sorted);
    };
    notify();
    window.addEventListener('demo_store_changed', notify);
    return () => window.removeEventListener('demo_store_changed', notify);
  }

  const q = query(collection(db, 'leaves'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const leaves = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(leaves);
  });
};

export const updateLeaveStatus = async (leaveId, status, hrComment = '') => {
  return await withFallback(
    async () => {
      const leaveRef = doc(db, 'leaves', leaveId);
      return await updateDoc(leaveRef, {
        status,
        hrComment,
        updatedAt: serverTimestamp(),
      });
    },
    async () => {
      return mockHelpers.updateDocument('leaves', leaveId, {
        status,
        hrComment,
        updatedAt: new Date().toISOString()
      });
    },
    'leaves'
  );
};
