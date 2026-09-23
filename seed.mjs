import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBvRkFb5Uv3DposoVi_oH5OVQlTbzD5_E",
  authDomain: "estora-e7142.firebaseapp.com",
  projectId: "estora-e7142",
  storageBucket: "estora-e7142.firebasestorage.app",
  messagingSenderId: "279043942090",
  appId: "1:279043942090:web:7d3be13d2c50da068ab633"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const newProperties = [
  {
    title: "The Sapphire Valley",
    location: "Whitefield, Bangalore",
    price: 35000000,
    propertyType: "villa",
    bedrooms: 4,
    bathrooms: 5,
    agentContact: "sarah.villas@estora.com",
    amenities: ["Smart Home", "Pool", "Clubhouse", "Security", "Parking"],
    description: "Sprawling premium villas nestled in 50 acres of lush greenery, offering the perfect blend of nature and smart-home technology. Each villa features a private heated pool, Italian marble flooring, and state-of-the-art home automation. Enjoy resort-style living with a 20,000 sq ft clubhouse right at your doorstep.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    title: "Estora Horizon Penthouse",
    location: "Marine Drive, Mumbai",
    price: 125000000,
    propertyType: "apartment",
    bedrooms: 5,
    bathrooms: 6,
    agentContact: "mumbai.elite@estora.com",
    amenities: ["Pool", "Gym", "Security", "Parking", "Smart Home", "Spa"],
    description: "A beacon of modern luxury architecture, this ultra-luxury penthouse offers panoramic ocean views of the Arabian Sea. Features a massive wrap-around terrace, private elevator, double-height ceilings, and premium imported fittings. The building includes 24/7 concierge, infinity pool, and a private resident's spa.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    title: "Oasis Commercial Park",
    location: "Cyber City, Gurgaon",
    price: 850000000,
    propertyType: "commercial",
    bedrooms: 0,
    bathrooms: 12,
    agentContact: "commercial@estora.com",
    amenities: ["Security", "Parking"],
    description: "Grade-A commercial spaces designed for the modern enterprise, featuring LEED-certified sustainable architecture. Includes smart access control, high-speed elevators, massive underground parking, and flexible floorplates to accommodate any corporate requirement. Ready for immediate fit-outs.",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    title: "Hillview Eco Estate",
    location: "Lonavala, Maharashtra",
    price: 22000000,
    propertyType: "house",
    bedrooms: 3,
    bathrooms: 3,
    agentContact: "retreats@estora.com",
    amenities: ["Pool", "Parking", "Clubhouse"],
    description: "Escape the city to this beautiful eco-friendly retreat home nestled in the hills of Lonavala. Features solar panels, rainwater harvesting, expansive decking, and floor-to-ceiling windows to enjoy the monsoon views. Perfect for a weekend getaway or a tranquil primary residence.",
    images: [
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1502672260266-1c1de2d9d06c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    title: "Burj Vista Apartments",
    location: "Downtown Dubai",
    price: 185000000,
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 3,
    agentContact: "international@estora.com",
    amenities: ["Gym", "Pool", "Security", "Parking", "Smart Home"],
    description: "Experience unparalleled luxury with direct views of the Burj Khalifa. This fully furnished premium apartment features designer interiors, smart lighting, automated curtains, and access to a massive podium deck with multiple pools and sports facilities.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    title: "Premium Lakefront Plot",
    location: "Kodaikanal, Tamil Nadu",
    price: 12000000,
    propertyType: "plot",
    bedrooms: 0,
    bathrooms: 0,
    agentContact: "land@estora.com",
    amenities: ["Security"],
    description: "A rare opportunity to own a massive 2-acre plot directly facing the serene Kodaikanal lake. Pre-approved for residential construction with road access, electricity, and water connections already in place. Build your dream mountain mansion here.",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200"
    ]
  }
];

async function seedData() {
  console.log("Connecting to Firebase...");
  try {
    const propsRef = collection(db, "listings");
    
    // Delete existing
    console.log("Fetching existing properties to clear...");
    const snapshot = await getDocs(propsRef);
    let deleted = 0;
    for (const document of snapshot.docs) {
      await deleteDoc(doc(db, "listings", document.id));
      deleted++;
    }
    console.log(`Deleted ${deleted} old properties.`);

    // Add new
    console.log("Seeding new rich properties...");
    let added = 0;
    for (const prop of newProperties) {
      await addDoc(propsRef, {
        ...prop,
        createdAt: serverTimestamp()
      });
      added++;
    }
    console.log(`Successfully added ${added} rich properties!`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
