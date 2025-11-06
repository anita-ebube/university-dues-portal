// firebase/firebaseConfig.js
export const firebaseConfig = {
  apiKey: "AIzaSyBgq0yKqg5fLFsNKTdP-W52jlLeP3S1-_U",
  authDomain: "nacos-receipt-portal.firebaseapp.com",
  projectId: "nacos-receipt-portal",
  storageBucket:"nacos-receipt-portal.appspot.com",
  messagingSenderId: "44149249787",
  appId: "1:44149249787:web:831f484cd81ed349d7825e",
  measurementId: "G-5X00NGRH7R"
};

import { initializeApp } from "firebase/app";
import { getAuth} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 

// Optional: Keep your helper function if needed
export async function uploadImage(file, userId) {
  const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
  const { doc, setDoc } = await import('firebase/firestore');
  
  const storageRef = ref(storage, `images/${userId}/${file.name}`);
  await uploadBytes(storageRef, file);

  const downloadURL = await getDownloadURL(storageRef);

  await setDoc(doc(db, "users", userId), { profileImage: downloadURL }, { merge: true });
  
  console.log("Image uploaded:", downloadURL);
}