import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './hooks/useTheme'
import SplashScreen from './components/SplashScreen'
import HomePage from './pages/HomePage'

export default function App() {
  const [splashDone, setSplashDone] = useState(false)

  return (
    <ThemeProvider>
      <AnimatePresence mode="wait">
        {!splashDone
          ? <SplashScreen key="splash" onDone={() => setSplashDone(true)} />
          : <HomePage key="home" />
        }
      </AnimatePresence>
    </ThemeProvider>
  )
}
