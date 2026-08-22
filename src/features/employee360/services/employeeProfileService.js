import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, auth } from '@/config/firebase';
import { PROTECTED_FIELDS } from '../utils/profilePermissions';

/**
 * Fetch a user's full profile from Firestore users/{uid}.
 *
 * If the document does not exist (e.g. signup transaction failed), a minimal
 * profile document is auto-created using Firebase Auth metadata so the user
 * can immediately use the app.
 *
 * Error mapping:
 *   permission-denied → Firestore rules not deployed / user not authenticated
 *   missing document  → auto-created from Firebase Auth data
 */
export const fetchEmployeeProfile = async (uid) => {
  if (!uid) throw new Error('No UID provided.');

  const docRef = doc(db, 'users', uid);

  try {
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }

    // ── Document missing: auto-create from Firebase Auth ──────────────────
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.uid !== uid) {
      throw new Error('Profile document not found and cannot be created for another user.');
    }

    console.info('[Employee360] Profile document missing — auto-creating from Firebase Auth data.');

    const profileData = {
      uid,
      email: currentUser.email || '',
      displayName: currentUser.displayName || '',
      role: 'employee',
      status: 'active',
      emailVerified: currentUser.emailVerified,
      employeeId: '',         // Will be filled when HR assigns it
      phone: '',
      address: '',
      department: '',
      designation: '',
      joiningDate: '',
      profilePicture: currentUser.photoURL || null,
      documents: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, profileData);
    console.info('[Employee360] Profile document created for UID:', uid);

    // Return the created profile (serverTimestamp not yet resolved — use local date)
    return {
      id: uid,
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (err) {
    if (err?.code === 'permission-denied') {
      console.error(
        '[Employee360] Firestore permission denied reading users/' + uid + '.\n' +
        'Deploy firestore.rules: firebase deploy --only firestore:rules'
      );
      throw new Error(
        'permission-denied: Firestore rules not yet deployed. ' +
        'Run: firebase deploy --only firestore:rules'
      );
    }
    throw err;
  }
};

/**
 * Update the allowed fields of a user's profile.
 * Firestore rules are the REAL security gate — this function
 * strips protected fields as a defense-in-depth measure.
 *
 * @param {string} uid - UID of the user profile to update
 * @param {object} updates - Fields to update
 */
export const updateEmployeeProfile = async (uid, updates) => {
  if (!uid) throw new Error('No UID provided.');

  // Strip protected fields client-side (Firestore rules also enforce this)
  const safeUpdates = { ...updates };
  PROTECTED_FIELDS.forEach((f) => delete safeUpdates[f]);

  if (Object.keys(safeUpdates).length === 0) {
    throw new Error('No valid fields to update.');
  }

  safeUpdates.updatedAt = serverTimestamp();

  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, safeUpdates);
};

/**
 * Upload a profile picture to Firebase Storage.
 * Path: profile-pictures/{uid}/avatar.{ext}
 *
 * @param {string} uid - Owner UID
 * @param {File} file - Image file
 * @param {function} onProgress - Called with progress 0–100
 * @returns {Promise<string>} - Download URL
 */
export const uploadProfilePicture = (uid, file, onProgress) => {
  return new Promise((resolve, reject) => {
    const ext = file.name.split('.').pop();
    const storageRef = ref(storage, `profile-pictures/${uid}/avatar.${ext}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (onProgress) onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};

/**
 * Upload an employee document to Firebase Storage.
 * Path: employee-documents/{uid}/{docName}
 *
 * @param {string} uid
 * @param {File} file
 * @param {string} category - e.g. 'ID Proof', 'Offer Letter'
 * @param {function} onProgress
 * @returns {Promise<{url, name, size, type, category, uploadedAt}>}
 */
export const uploadEmployeeDocument = (uid, file, category, onProgress) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `employee-documents/${uid}/${timestamp}_${safeName}`;
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (onProgress) onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url,
            storagePath: path,
            name: file.name,
            size: file.size,
            type: file.type,
            category: category || 'General',
            uploadedAt: new Date().toISOString(),
          });
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};

/**
 * Delete an employee document from Firebase Storage.
 */
export const deleteEmployeeDocument = async (storagePath) => {
  if (!storagePath) throw new Error('No storage path provided.');
  const storageRef = ref(storage, storagePath);
  await deleteObject(storageRef);
};

/**
 * Fetch attendance summary for a specific employee.
 * Integration boundary: reads from 'attendance' collection.
 * Does NOT implement attendance business logic.
 *
 * @param {string} uid - Employee UID
 * @returns {Promise<{present, absent, halfDay, late, total, percentage} | null>}
 */
export const fetchAttendanceSummary = async (uid) => {
  if (!uid) return null;
  try {
    const colRef = collection(db, 'attendance');
    const q = query(colRef, where('userId', '==', uid), orderBy('date', 'desc'), limit(30));
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const records = snap.docs.map((d) => d.data());
    const total = records.length;
    const present = records.filter((r) => r.status === 'present' || r.status === 'checked-out').length;
    const absent = records.filter((r) => r.status === 'absent').length;
    const halfDay = records.filter((r) => r.status === 'half-day').length;
    const late = records.filter((r) => r.isLate === true).length;
    const percentage = total > 0 ? Math.round(((present + halfDay * 0.5) / total) * 100) : 0;

    return { present, absent, halfDay, late, total, percentage };
  } catch {
    return null; // Attendance module may not be deployed yet
  }
};

/**
 * Fetch recent leave records for a specific employee.
 * Integration boundary: reads from 'leaves' collection.
 * Does NOT implement leave business logic.
 *
 * @param {string} uid - Employee UID
 * @returns {Promise<Array>}
 */
export const fetchLeaveHistory = async (uid) => {
  if (!uid) return [];
  try {
    const colRef = collection(db, 'leaves');
    const q = query(colRef, where('userId', '==', uid), orderBy('createdAt', 'desc'), limit(10));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return []; // Leave module may not be deployed yet
  }
};

/**
 * Fetch HR-authorized employee profile.
 * HR reads any employee's users/{uid} document.
 * Firestore rules allow this for HR/Admin.
 *
 * @param {string} targetUid
 */
export const fetchEmployeeProfileAsHR = async (targetUid) => {
  return fetchEmployeeProfile(targetUid);
};

/**
 * Fetch list of all employees for HR view.
 * Reads 'users' collection with role='employee'.
 */
export const fetchAllEmployees = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return [];
  try {
    const colRef = collection(db, 'users');
    const q = query(colRef, where('role', '==', 'employee'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
};
