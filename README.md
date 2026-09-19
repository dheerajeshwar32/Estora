# Estora

> A high-end, AI-powered real estate listings platform featuring natural language search and a secure, glassmorphic administrative dashboard.

![Estora Hero Placeholder](docs/hero-screenshot.png)

Estora is a modern real estate web application built as an internship capstone project. It redefines property discovery by allowing users to search for homes using natural language via the Gemini AI model, moving beyond traditional filter constraints. The platform also includes a fully secured, authenticated Admin portal for seamless property and image management.

## ✨ Key Features

* **AI-Powered Discovery:** Integrated Gemini API via a Vercel serverless function to translate natural language user prompts (e.g., "Find me a modern villa in Chennai") into targeted property queries.
* **Premium UI/UX:** Designed with a luxury dark navy glassmorphic aesthetic, featuring responsive grid layouts, Framer Motion staggered entrance animations, and skeleton loading states.
* **Secure Admin Dashboard:** A protected portal (Firebase Auth) enabling full CRUD operations for property listing management.
* **Cloud Storage Uploads:** Direct-to-cloud image file uploading with live progress tracking using Firebase Storage.

## 🛠 Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS v4, Framer Motion, Lucide React |
| **Backend & Database** | Firebase (Firestore, Auth, Storage), Vercel Serverless Functions |
| **AI Integration** | Google Gemini API (`@google/generative-ai`) |
| **Deployment** | Vercel (CI/CD pipeline) |

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone [https://github.com/dheerajeshwar32/Estora.git](https://github.com/dheerajeshwar32/Estora.git)
cd Estora
