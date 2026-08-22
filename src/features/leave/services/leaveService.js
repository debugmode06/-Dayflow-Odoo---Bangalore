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

export const applyForLeave = async (userId, userName, leaveData) => {
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
};

export const subscribeToEmployeeLeaves = (userId, callback) => {
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
  try {
    const functionsInstance = getFunctions(app);
    const getSanitizedFn = httpsCallable(functionsInstance, 'getSanitizedLeaves');
    const response = await getSanitizedFn();
    return response.data.leaves || [];
  } catch (error) {
    console.error('Error fetching sanitized leaves:', error);
    return [];
  }
};

export const subscribeToAllLeaves = (callback) => {
  const q = query(collection(db, 'leaves'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const leaves = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(leaves);
  });
};

export const updateLeaveStatus = async (leaveId, status, hrComment = '') => {
  const leaveRef = doc(db, 'leaves', leaveId);
  return await updateDoc(leaveRef, {
    status,
    hrComment,
    updatedAt: serverTimestamp(),
  });
};
