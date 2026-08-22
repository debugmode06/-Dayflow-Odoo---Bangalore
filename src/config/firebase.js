import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBOartxwsVNON0U4J05Rs9PUKqQ5LRIJW8",
  authDomain: "dayflow-795a9.firebaseapp.com",
  projectId: "dayflow-795a9",
  storageBucket: "dayflow-795a9.firebasestorage.app",
  messagingSenderId: "1048114120357",
  appId: "1:1048114120357:web:ccceeec198ca0eaeb46f4c",
  measurementId: "G-L1WRNMR7M7",
};

const app = initializeApp(firebaseConfig);

export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;