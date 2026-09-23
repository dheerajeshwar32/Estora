import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

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
const db = getFirestore(app);

async function patchDatabase() {
  console.log("Fetching all listings...");
  const snapshot = await getDocs(collection(db, 'listings'));
  
  for (const document of snapshot.docs) {
    const data = document.data();
    const updates = {};
    
    if (!data.transactionType) updates.transactionType = Math.random() > 0.3 ? 'buy' : 'rent';
    if (!data.area) {
      if (data.propertyType === 'apartment') updates.area = Math.floor(Math.random() * 2000) + 800;
      else if (data.propertyType === 'villa' || data.propertyType === 'house') updates.area = Math.floor(Math.random() * 5000) + 2000;
      else if (data.propertyType === 'commercial') updates.area = Math.floor(Math.random() * 20000) + 2000;
      else updates.area = Math.floor(Math.random() * 10000) + 1000;
    }
    if (!data.status) updates.status = Math.random() > 0.1 ? 'available' : 'sold';
    if (!data.propertyId) updates.propertyId = 'EST-' + Math.floor(Math.random() * 90000 + 10000);
    
    if (Object.keys(updates).length > 0) {
      await updateDoc(doc(db, 'listings', document.id), updates);
      console.log(`Updated ${document.id} with ${JSON.stringify(updates)}`);
    }
  }
  console.log("Done patching database!");
}

patchDatabase().catch(console.error);

