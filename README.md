<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Oladoye Author Media

A modern, full-featured author website and content management platform built with React, TypeScript, Tailwind CSS v4, and Supabase. Showcase books, publish blog posts, manage subscribers, and keep your audience engaged — all from a clean admin dashboard.

---

## ✨ Features

- **Book Catalog** — Browse featured and full book listings with cover images, genres, and descriptions
- **Blog** — Write and publish articles with rich Markdown content
- **Author Profile** — Configurable bio, photo, tagline, and social links
- **Newsletter Subscription** — Built-in subscriber capture and email notifications via Nodemailer
- **Admin Dashboard** — Protected admin panel to manage books, blog posts, subscribers, and site settings
- **Responsive Design** — Fully mobile-friendly UI with a hamburger nav menu on small screens
- **AI Integration** — Powered by Google Gemini AI (`@google/genai`) for content assistance
- **Smooth Animations** — Page transitions and hover effects with Motion (Framer Motion)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, React Router v7 |
| Styling | Tailwind CSS v4 (with custom design tokens) |
| Backend / DB | Supabase (Postgres + Auth) |
| Build Tool | Vite 6 |
| Icons | Lucide React |
| Animations | Motion (Framer Motion) |
| Email | Nodemailer |
| AI | Google Gemini (`@google/genai`) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later
- A [Supabase](https://supabase.com) project
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RayBen445/Oladoye-Author-Media.git
   cd Oladoye-Author-Media
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Copy the example env file and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

   | Variable | Description |
   |----------|-------------|
   | `VITE_SUPABASE_URL` | Your Supabase project URL |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
   | `GEMINI_API_KEY` | Your Google Gemini API key |
   | `EMAIL_*` | SMTP credentials for Nodemailer |

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173` (or the port shown in your terminal).

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (API + Vite) |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | TypeScript type-check |

---

## 🗂 Project Structure

```
src/
├── components/       # Shared UI components (Navbar, Footer, Newsletter, …)
├── hooks/            # Custom React hooks (useBooks, useBlogPosts, useSiteSettings, …)
├── lib/              # Supabase client & utilities
├── pages/            # Route-level page components
│   └── admin/        # Admin-only pages (Dashboard, Books, Blog, Settings, …)
├── App.tsx           # Root component with routing
├── main.tsx          # React entry point
└── index.css         # Global styles & Tailwind theme tokens
api/                  # Express API server (email, Gemini proxy, …)
```

---

## 🔐 Admin Access

Navigate to `/login` and sign in with your Supabase admin credentials. All `/admin/*` routes are protected and require authentication.

---

## 🌐 Deployment

This project is configured for deployment on **Vercel** (`vercel.json` included). After setting your environment variables in the Vercel dashboard, deploy with:

```bash
vercel --prod
```

---

## 📄 License

This project is private. All rights reserved © Oladoye Author Media.

