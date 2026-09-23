# React + Vite
# ESTORA. Premium Real Estate Discover Platform

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.
A high-performance, modern web application built for property discovery, comparison, and lead generation. This project was developed as a comprehensive Web Development Internship submission, exceeding all standard and advanced PDR (Project Design Requirements).

Currently, two official plugins are available:
![ESTORA Cover](https://github.com/dheerajeshwar/estora/blob/main/public/cover-placeholder.png)

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)
## 🎯 Project Objective
To develop a professional, responsive Real Estate Website simulating a real-world property agency. The platform seamlessly handles property search, filtering, detailed galleries, dynamic map integrations, AI-assisted onboarding, and high-conversion site-visit scheduling.

## React Compiler
## 🌟 Core Features
- **Modern UI/UX & Responsive Design**: Pixel-perfect layouts using Tailwind CSS with deep dark-mode support and custom CSS variables for effortless theme switching. Includes Apple-style 3D hover tilt physics via Framer Motion.
- **Advanced Filtering & AI Search**: Multi-criteria search with dynamic sorting. Features an animated AI search typewriter onboarding effect.
- **Advanced Property Comparison**: Select up to 3 saved properties and compare them side-by-side in a dedicated modal (Advanced PDR Feature).
- **Interactive Map Integration**: Live Google Maps iframe dynamically pinpointing property locations with adaptive CSS filters for dark/light modes.
- **Cinematic Image Lightbox**: Fully swipeable (framer-motion drag physics) fullscreen gallery for property media.
- **EMI Calculator**: Dynamic JavaScript mortgage calculator integrated directly into property detail pages.
- **Lead Generation & Booking**: Multi-step animated scheduling modal allowing users to book in-person or virtual tours directly to Firestore.
- **Agent Dashboard**: A secure, authenticated admin panel built on Firebase to manage listings, upload images, and analyze inquiries via custom CSS bar charts.
- **Saved Wishlist**: Persisted saved properties utilizing LocalStorage and Firebase Cloud sync.
- **Interactive FAQ Accordion**: Expandable FAQ sections addressing common buyer queries.

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
## 🛠️ Technologies Used
* **Frontend**: React 18 (Vite), React Router DOM
* **Styling**: Tailwind CSS v4, Custom CSS Variables
* **Animations**: Framer Motion
* **Icons**: Lucide React
* **Backend / Database**: Firebase (Firestore, Authentication, Storage)
* **Hosting**: Vercel / Firebase Hosting

## Expanding the Oxlint configuration
## 🚀 Installation & Setup

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/estora.git
   cd estora
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

## 📂 Project Folder Structure
```text
estora/
├── src/
│   ├── components/       # Reusable UI components (Cards, Modals, Nav, Footer)
│   ├── context/          # Global state management (Auth, App/Theme)
│   ├── pages/            # Core views (Listings, Detail, Admin)
│   ├── App.jsx           # Routing & Layout Wrapper
│   ├── index.css         # Tailwind directives & Theme Variables
│   └── firebaseConfig.js # Firebase initialization
├── public/               # Static assets
├── index.html            # Entry point
└── package.json          # Dependencies
```

## 📈 Future Improvements
* **Mapbox Integration**: Replace iframe maps with Mapbox GL JS for custom cluster rendering.
* **3D Virtual Tours**: Integrate Matterport iframes for properties supporting VR.
* **Stripe Integration**: Allow users to pay a refundable deposit to reserve a property tour.

---
*Built with ❤️ for the Web Development Internship Program*
