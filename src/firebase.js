import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY || "AIzaSyCpD1JpYkJ_ZCVNsIW05XYvFONoHHQE088",
  authDomain:
    process.env.REACT_APP_AUTH_DOMAIN || "calidads-45899.firebaseapp.com",
  projectId: process.env.REACT_APP_PROJECT_ID || "calidads-45899",
  storageBucket:
    process.env.REACT_APP_STORAGE_BUCKET || "calidads-45899.firebasestorage.app",
  messagingSenderId:
    process.env.REACT_APP_MESSAGING_SENDER_ID || "1085980840083",
  appId:
    process.env.REACT_APP_APP_ID || "1:1085980840083:web:c5facc09bc475c21d67d66"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
