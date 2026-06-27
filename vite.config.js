import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    // Target modern browsers — smaller output
    target: 'es2020',
    // Warn threshold (Three.js chunk is large by nature)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Split vendor chunks for better caching
        manualChunks: {
          'vendor-react':  ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-gsap':   ['gsap'],
          'vendor-three':  ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-ui':     ['react-icons', 'react-confetti'],
        },
      },
    },
  },

  // Faster dev server
  server: {
    port: 5173,
    strictPort: false,
  },

  // Resolve aliases for cleaner imports
  resolve: {
    alias: { '@': '/src' },
  },
})
