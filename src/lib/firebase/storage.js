import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/config/firebase';

export const uploadFile = async (path, file) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
};

export const uploadProfilePicture = async (userId, file) => {
  const ext = file.name.split('.').pop();
  const path = `profile_pictures/${userId}/avatar.${ext}`;
  return await uploadFile(path, file);
};
