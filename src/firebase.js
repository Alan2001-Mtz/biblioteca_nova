import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpD1JpYkJ_ZCVNsIW05XYvFONoHHQE088",
  authDomain: "calidads-45899.firebaseapp.com",
  projectId: "calidads-45899",
  storageBucket: "calidads-45899.firebasestorage.app",
  messagingSenderId: "1085980840083",
  appId: "1:1085980840083:web:c5facc09bc475c21d67d66"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);