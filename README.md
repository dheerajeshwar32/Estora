# ESTORA. Premium Real Estate Discovery Platform

![ESTORA Cover](https://github.com/dheerajeshwar32/Estora/blob/main/public/favicon.svg)

A high-performance, modern web application built for luxury property discovery, comparison, and lead generation. This project was developed as a comprehensive Web Development Internship submission, exceeding all standard and advanced PDR (Project Design Requirements).

## 🚀 Project Objective
To develop a professional, responsive Real Estate Website simulating a real-world premium property agency. The platform seamlessly handles property search, filtering, detailed galleries, dynamic map integrations, AI-assisted natural language search, and high-conversion site-visit scheduling.

## 💎 Core Features
- **Modern UI/UX & Responsive Design**: Pixel-perfect layouts using Tailwind CSS v4 with deep dark-mode support and custom CSS variables. Includes ultra-premium Apple-style 3D hover tilt physics and magnetic buttons via Framer Motion.
- **AI-Powered Semantic Search**: Integrated Gemini AI natural language search. Users can type "I want a 3BHK in Mumbai under 5 crores with a pool" and the AI instantly filters the database.
- **Advanced Property Comparison**: Select up to 3 saved properties and compare their specifications, amenities, and pricing side-by-side in a dedicated modal (Advanced PDR Feature).
- **Interactive Map Integration**: Live Google Maps iframe dynamically pinpointing property locations with adaptive CSS filters for dark/light modes.
- **Cinematic Image Lightbox**: Fully swipeable (Framer Motion drag physics) fullscreen gallery for property media.
- **EMI Calculator**: Dynamic JavaScript mortgage calculator integrated directly into property detail pages.
- **Lead Generation & Booking**: Multi-step animated scheduling modal allowing users to book in-person or virtual tours directly to Firestore.
- **Agent Dashboard**: A secure, authenticated admin panel built on Firebase to manage listings, upload images, and analyze inquiries via custom CSS bar charts.
- **Saved Wishlist**: Persisted saved properties utilizing LocalStorage and Firebase Cloud sync.
- **Interactive FAQ Accordion**: Expandable FAQ sections addressing common buyer queries.

## 🛠️ Technologies Used
* **Frontend**: React 19 (Vite), React Router DOM v7
* **Styling**: Tailwind CSS v4, Custom CSS Variables
* **Animations**: Framer Motion
* **Icons**: Lucide React
* **Backend / Database**: Firebase (Firestore, Authentication, Storage)
* **AI Integration**: Google Gemini API (via Vercel Serverless Functions)
* **Hosting**: Vercel

## 💻 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dheerajeshwar32/Estora.git
   cd estora
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Firebase and Gemini credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

## 📁 Project Folder Structure
```text
estora/
├── src/
│   ├── components/       # Reusable UI components (Cards, Modals, Nav, Footer)
│   ├── context/          # Global state management (Auth, App/Theme)
│   ├── pages/            # Core views (Listings, Detail, Admin)
│   ├── App.jsx           # Routing & Layout Wrapper
│   ├── index.css         # Tailwind directives & Theme Variables
│   ├── firebaseConfig.js # Firebase initialization
├── api/                  # Vercel Serverless Functions (ai-search.js)
├── public/               # Static assets
├── index.html            # Entry point
└── package.json          # Dependencies
```

---
*Built with ❤️ for the Web Development Internship Program*
