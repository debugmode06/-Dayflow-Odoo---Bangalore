import { db } from '@/config/firebase';
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
  });
};

export const subscribeToEmployeeLeaves = (userId, callback) => {
  const q = query(
    collection(db, 'leaves'), 
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const leaves = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(leaves);
  });
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
