import { lazy, Suspense, useEffect, useState } from 'react'
import Hero from './components/Hero'
import Preloader from './components/Preloader'

const PRELOADER_DURATION = 6000
const TRANSITION_DURATION = 900
const FireSphereSection = lazy(() => import('./components/FireSphereSection'))

function App() {
  const [showPreloader, setShowPreloader] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const transitionTimeout = window.setTimeout(() => {
      setIsTransitioning(true)
    }, PRELOADER_DURATION)

    const removeTimeout = window.setTimeout(() => {
      setShowPreloader(false)
    }, PRELOADER_DURATION + TRANSITION_DURATION)

    return () => {
      window.clearTimeout(transitionTimeout)
      window.clearTimeout(removeTimeout)
    }
  }, [])

  return (
    <main className="relative bg-charcoal">
      <div
        className={`transition-opacity duration-1000 ease-out ${
          isTransitioning || !showPreloader ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Hero />
        {!showPreloader && (
          <Suspense fallback={null}>
            <FireSphereSection />
          </Suspense>
        )}
      </div>

      {showPreloader && (
        <div
          className={`fixed inset-0 z-50 transition-opacity duration-[900ms] ease-in-out ${
            isTransitioning ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          aria-hidden={isTransitioning}
        >
          <Preloader />
        </div>
      )}
    </main>
  )
}

export default App
