import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWKOZaWNsiu3gTvwXh96zqsjl8fjPkskw",
  authDomain: "weeding-2ca61.firebaseapp.com",
  projectId: "weeding-2ca61",
  storageBucket: "weeding-2ca61.firebasestorage.app",
  messagingSenderId: "864815501682",
  appId: "1:864815501682:web:c00ea5c0c0eff4594c4deb",
  measurementId: "G-MGRPXZ39J5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
