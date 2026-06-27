# 🪙 Online Coin Toss

A premium, cinematic coin toss experience built with React + Vite, Three.js, Framer Motion, and GSAP.

## ✨ Features

- Realistic 3D gold coin with metallic shading and reflections
- Cinematic toss animation with countdown, arc physics, and particle effects
- Dark / Light theme toggle (persisted in localStorage)
- Live toss statistics with animated charts
- Web Audio API sound effects (no audio files required)
- Fully responsive — desktop, tablet, mobile
- Keyboard shortcut: `Space` to toss
- Mobile vibration on result
- Confetti & win/loss effects
- Accessible markup with aria-labels

## 🚀 Getting Started

```bash
npm install
npm run dev        # Development server → http://localhost:5173
npm run build      # Production build  → dist/
npm run preview    # Preview production build locally
```

## 📦 Deployment

### Netlify (recommended — one click)

1. Push to GitHub
2. Connect repo on [netlify.com](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Done — `netlify.toml` handles everything else

### Vercel

1. Push to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Framework preset: **Vite**
4. Done — `vercel.json` handles SPA routing and caching headers

### GitHub Pages

Push to `main` — the included GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys automatically.

> **Note:** For GitHub Pages subdirectory deploys, set `base` in `vite.config.js`:
> ```js
> base: '/your-repo-name/'
> ```

## 🛠 Tech Stack

| Library | Purpose |
|---|---|
| React 19 + Vite 8 | UI framework + build tool |
| Tailwind CSS v4 | Utility-first styling |
| Framer Motion | UI animations |
| GSAP | Splash screen timeline |
| React Three Fiber + Drei | 3D coin rendering |
| Three.js | WebGL engine |
| React Icons | Icon set |
| React Confetti | Win confetti burst |
| Howler.js | Sound management (Web Audio fallback) |

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Coin3D.jsx    # Three.js 3D coin
│   ├── ChoiceCard.jsx
│   ├── CountdownOverlay.jsx
│   ├── ParticleBackground.jsx
│   ├── ResultScreen.jsx
│   ├── SplashScreen.jsx
│   └── Statistics.jsx
├── hooks/
│   ├── useTheme.jsx  # Dark/light theme context
│   ├── useToss.js    # Toss phase state machine
│   ├── useStats.js   # localStorage statistics
│   └── useWindowSize.js
├── pages/
│   └── HomePage.jsx
└── utils/
    ├── sounds.js     # Web Audio procedural sounds
    └── stats.js      # localStorage helpers
```
