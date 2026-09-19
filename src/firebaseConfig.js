import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBBvRkFb5Uv3DposoVi_oH5OVQlTbzD5_E",
  authDomain: "estora-e7142.firebaseapp.com",
  projectId: "estora-e7142",
  storageBucket: "estora-e7142.firebasestorage.app",
  messagingSenderId: "279043942090",
  appId: "1:279043942090:web:7d3be13d2c50da068ab633",
  measurementId: "G-8BKN5SJ63E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services for use across Estora
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);