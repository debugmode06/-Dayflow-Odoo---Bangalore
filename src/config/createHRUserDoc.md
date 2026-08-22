/**
 * One-time setup script: Creates HR user document in Firestore
 * Run ONCE from the browser console or as a Node script.
 *
 * USAGE (browser console on localhost:3000 after login):
 *
 *   1. Sign into Firebase with your HR account via the new /login page
 *   2. Open browser DevTools → Console
 *   3. Paste and run the snippet below — it reads your current UID and
 *      writes users/{uid} = { role: "hr" } to Firestore.
 *
 * ------------- BROWSER CONSOLE SNIPPET -------------
 *
 * import { getAuth } from "firebase/auth";
 * import { getFirestore, doc, setDoc } from "firebase/firestore";
 * const auth = getAuth();
 * const db = getFirestore();
 * const uid = auth.currentUser?.uid;
 * if (!uid) { console.error("Not logged in"); } else {
 *   await setDoc(doc(db, "users", uid), {
 *     role: "hr",
 *     name: "HR Admin",
 *     email: auth.currentUser.email,
 *   }, { merge: true });
 *   console.log("users/" + uid + " created with role: hr");
 * }
 *
 * ------------- OR use Firebase Console -------------
 *
 * 1. Go to https://console.firebase.google.com/project/dayflow-795a9/firestore
 * 2. Navigate to: users collection
 * 3. Create document with ID = your Firebase Auth UID
 * 4. Add field: role (string) = "hr"
 * 5. Add field: email (string) = your email
 *
 * After the document exists, the app will correctly load role:"hr"
 * and Firestore rules will allow HR dashboard + payroll reads.
 */
