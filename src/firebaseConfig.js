import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBvRkFb5Uv3DposoVi_oH5OVQlTbzD5_E",
  authDomain: "estora-e7142.firebaseapp.com",
  projectId: "estora-e7142",
  storageBucket: "estora-e7142.firebasestorage.app",
  messagingSenderId: "279043942090",
  appId: "1:279043942090:web:7d3be13d2c50da068ab633",
  measurementId: "G-8BKN5SJ63E"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Lazy-load Firebase Storage only when needed (used only by AdminDashboard)
export const getFirebaseStorage = () => {
  return import("firebase/storage").then(({ getStorage }) => getStorage(app));
};