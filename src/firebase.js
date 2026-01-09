import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAD3y3HNjlsSO7xykkqLWqofxU5U_6hW_Y",
  authDomain: "aichaku-924d0.firebaseapp.com",
  projectId: "aichaku-924d0",
  storageBucket: "aichaku-924d0.firebasestorage.app",
  messagingSenderId: "745993610184",
  appId: "1:745993610184:web:97ea4b13fef74d43d396fd"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);