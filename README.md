# The Holy Quran • قرآن مجید مع اردو ترجمہ

<p align="center">
  <img src="public/pwa-192x192.png" alt="Holy Quran App Logo" width="128" height="128" />
</p>

<p align="center">
  <strong>Complete Holy Quran with Authentic Urdu Translation</strong><br />
  A high-performance, mobile-first Progressive Web App (PWA) with full offline support, visual coordinate bookmarking, and instant search.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/PWA-100%25_Offline-059669?style=flat-square&logo=pwa&logoColor=white" alt="PWA Ready" />
  <img src="https://img.shields.io/badge/License-MIT-amber.svg?style=flat-square" alt="License MIT" />
</p>

---

## ✨ Features

- **📖 Tajweed Quran with Urdu Translation**: High-resolution, readable pages formatted in the traditional 16-line subcontinental script with authentic Urdu translation under each line.
- **⚡ 100% Offline Capability**: Built with Workbox Service Workers and Dexie.js (IndexedDB). Cache the complete Quran once and read uninterrupted without an active internet connection.
- **📌 Precision Visual Coordinate Bookmarking**: Long-press or right-click anywhere on a Quran page to place a pinpoint bookmark directly on an Ayah. Assign custom titles, notes, and color tags.
- **🔍 Intelligent Instant Search & Fuzzy Alias Matching**:
  - Jump directly by **Surah Name** (e.g., `Yasin`, `Al-Baqarah`, `Kahf`, `Rehman`, `Waqiah`).
  - Search by **Ayah Reference** (e.g., `2:255`, `18:10`, `36:58`).
  - Search by **Juz / Para** (1–30) or direct **Page Number** (1–729).
- **🎨 Reading Modes & Visual Themes**:
  - **Themes**: Dark Midnight (high-contrast night reading), Warm Parchment (Sepia for paper-like comfort), and Light Classic.
  - **View Modes**: Single Page, Dual Spread (desktop/tablet), and Continuous Vertical Scroll.
- **🧘 Zen Mode**: One-tap full-screen distraction-free reading experience.
- **🌐 Bilingual Interface**: Instant one-click toggle between English and Urdu (اردو) with Noto Nastaliq Urdu typography.
- **📱 Installable Progressive Web App (PWA)**: Add to Home Screen on iOS, Android, macOS, and Windows with native app-like standalone performance.
- **🛡️ Error Boundary & Safe State Recovery**: Resilient application lifecycle with safe fallback rendering and state reset protection.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Local Database**: [Dexie.js](https://dexie.org/) (Client-side IndexedDB for bookmark pins and reading state)
- **Offline / PWA**: [Vite Plugin PWA](https://vite-pwa-org.netlify.app/) + Workbox
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linter**: [Oxlint](https://oxc.rs/)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ahmadtahacodes/holyquran-withurdutranslation.git
   cd holyquran-withurdutranslation
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 📦 Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with HMR and dev PWA support. |
| `npm run build` | Compiles TypeScript and builds production-optimized assets in `dist/`. |
| `npm run preview` | Previews the production build locally. |
| `npm run lint` | Runs Oxlint across source files for lightning-fast linting. |

---

## 📁 Project Structure

```
├── public/
│   ├── pages/                   # Quran page image assets (1 to 729)
│   ├── apple-touch-icon.png     # iOS touch icon
│   ├── favicon.ico              # Multi-resolution favicon
│   ├── favicon.svg              # Scalable vector icon
│   ├── manifest.webmanifest     # Web App Manifest
│   ├── pwa-192x192.png          # PWA standard icon
│   └── pwa-512x512.png          # PWA splash/high-res icon
├── src/
│   ├── components/
│   │   ├── BookmarkManager.tsx  # Bookmark list & management
│   │   ├── BookmarkModal.tsx    # Pinpoint coordinate bookmark modal
│   │   ├── ErrorBoundary.tsx    # React error boundary with fallback UI
│   │   ├── Header.tsx           # Responsive header bar
│   │   ├── HomeScreen.tsx       # Quran dashboard & quick navigation
│   │   ├── MobileNavbar.tsx     # Mobile bottom navigation bar
│   │   ├── NavigationDrawer.tsx # Surah / Juz index drawer
│   │   ├── OfflineManager.tsx   # Offline precaching manager
│   │   ├── ReaderCanvas.tsx     # Interactive Quran reading surface & canvas
│   │   ├── SearchModal.tsx      # Instant search dialog
│   │   ├── SettingsModal.tsx    # Customization & reading preferences
│   │   └── WelcomeModal.tsx     # First-time user greeting & onboarding
│   ├── data/
│   │   └── quran_meta.json      # Metadata for all 114 Surahs, 30 Juz, and 729 pages
│   ├── db/
│   │   └── database.ts          # Dexie.js IndexedDB schema
│   ├── hooks/
│   │   ├── useBookmarks.ts      # Bookmark CRUD hook
│   │   ├── useReaderState.ts    # Page routing, view mode, history sync
│   │   ├── useTheme.ts          # Dark / Sepia / Light theme management
│   │   └── useUserProfile.ts    # User profile & onboarding state
│   ├── utils/
│   │   ├── i18n.ts              # English and Urdu UI localization
│   │   ├── pageFallback.ts      # Vector SVG generator for page fallbacks
│   │   └── searchIndex.ts       # Search indexing, phonetic aliases & parser
│   ├── App.tsx                  # Main application container
│   ├── index.css                # Global CSS & Tailwind styles
│   └── main.tsx                 # React DOM entry point & Service Worker registration
├── generate_icons.py            # Python PIL script to regenerate app icons
├── vite.config.ts               # Vite configuration with PWA & Tailwind plugins
└── package.json                 # Project dependencies and scripts
```

---

## 🤝 Contributing

Contributions, feedback, and feature suggestions are always welcome!
Feel free to open an [issue](https://github.com/ahmadtahacodes/holyquran-withurdutranslation/issues) or submit a pull request.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
