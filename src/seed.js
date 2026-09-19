import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig.js";

const dummyListings = [
  {
    title: "Luxury Villa near VIT",
    description: "Spacious 4-bedroom villa with a private garden, perfect for families. Located in a premium gated community.",
    price: 15000000,
    location: "Vellore, Tamil Nadu",
    bedrooms: 4,
    bathrooms: 4,
    propertyType: "villa",
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],
    agentContact: "Dheeraj Eshwar"
  },
  {
    title: "Seaview Apartment in ECR",
    description: "Modern 3BHK high-rise apartment overlooking the ocean. Includes access to clubhouse and infinity pool.",
    price: 12500000,
    location: "Chennai, Tamil Nadu",
    bedrooms: 3,
    bathrooms: 3,
    propertyType: "apartment",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
    agentContact: "Jami Karthikeya"
  },
  {
    title: "Cozy Independent House",
    description: "Well-maintained 2-bedroom house with covered parking and easy access to local markets and transit.",
    price: 7500000,
    location: "Bangalore, Karnataka",
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "house",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"],
    agentContact: "G. Surya Prakash"
  },
  {
    title: "Prime Commercial Plot",
    description: "2400 sq.ft plot on the main highway, excellent investment opportunity for commercial development.",
    price: 9000000,
    location: "Hyderabad, Telangana",
    bedrooms: 0,
    bathrooms: 0,
    propertyType: "plot",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
    agentContact: "Dheeraj Eshwar"
  },
  {
    title: "Urban Studio Apartment",
    description: "Fully furnished studio designed for young professionals. Walking distance to IT parks.",
    price: 4500000,
    location: "Pune, Maharashtra",
    bedrooms: 1,
    bathrooms: 1,
    propertyType: "apartment",
    images: ["https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800"],
    agentContact: "Jami Karthikeya"
  },
  {
    title: "Heritage Villa",
    description: "Beautifully restored 5-bedroom heritage villa featuring traditional architecture and a central courtyard.",
    price: 25000000,
    location: "Kochi, Kerala",
    bedrooms: 5,
    bathrooms: 4,
    propertyType: "villa",
    images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"],
    agentContact: "G. Surya Prakash"
  },
  {
    title: "Suburban Family House",
    description: "Quiet neighborhood, recently renovated kitchen, and a large backyard. Great schools nearby.",
    price: 8500000,
    location: "Coimbatore, Tamil Nadu",
    bedrooms: 3,
    bathrooms: 2,
    propertyType: "house",
    images: ["https://images.unsplash.com/photo-1570129477492-45c003eaa271?w=800"],
    agentContact: "Dheeraj Eshwar"
  },
  {
    title: "Residential Corner Plot",
    description: "East-facing corner plot in a rapidly developing residential layout. Ready for immediate construction.",
    price: 3200000,
    location: "Vellore, Tamil Nadu",
    bedrooms: 0,
    bathrooms: 0,
    propertyType: "plot",
    images: ["https://images.unsplash.com/photo-1524813686514-a57563d77965?w=800"],
    agentContact: "Jami Karthikeya"
  },
  {
    title: "Penthouse with City Skyline",
    description: "Luxurious top-floor penthouse with premium fittings, smart home automation, and a massive terrace.",
    price: 35000000,
    location: "Mumbai, Maharashtra",
    bedrooms: 4,
    bathrooms: 5,
    propertyType: "apartment",
    images: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800"],
    agentContact: "G. Surya Prakash"
  },
  {
    title: "Compact 2BHK Flat",
    description: "Affordable and newly painted 2BHK flat. Close to metro station and shopping malls.",
    price: 5500000,
    location: "Noida, UP",
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "apartment",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1de24220e8?w=800"],
    agentContact: "Dheeraj Eshwar"
  },
  {
    title: "Modern Minimalist Villa",
    description: "Architect-designed villa emphasizing natural light and open spaces. Includes a private pool.",
    price: 28000000,
    location: "Bangalore, Karnataka",
    bedrooms: 4,
    bathrooms: 5,
    propertyType: "villa",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
    agentContact: "Jami Karthikeya"
  },
  {
    title: "Duplex Townhouse",
    description: "Spacious duplex with wooden flooring, modular kitchen, and dedicated power backup.",
    price: 11000000,
    location: "Chennai, Tamil Nadu",
    bedrooms: 3,
    bathrooms: 3,
    propertyType: "house",
    images: ["https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=800"],
    agentContact: "G. Surya Prakash"
  }
];

export const seedDatabase = async () => {
  console.log("Starting database seed...");
  try {
    const listingsRef = collection(db, "listings");
    for (const listing of dummyListings) {
      await addDoc(listingsRef, {
        ...listing,
        createdAt: serverTimestamp()
      });
      console.log(`Added: ${listing.title}`);
    }
    console.log("✅ Successfully seeded 12 listings!");
  } catch (error) {
    console.error("Error seeding database: ", error);
  }
};