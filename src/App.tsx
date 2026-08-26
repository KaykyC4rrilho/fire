import { lazy, Suspense, useEffect, useState } from 'react'
import Hero from './components/Hero'
import LeadFormScreen from './components/LeadFormScreen'
import Preloader from './components/Preloader'
import { submitLead } from './lib/submissions'
import type { LeadSource, LeadSubmissionData } from './types/lead'

const PRELOADER_DURATION = 6000
const TRANSITION_DURATION = 900
const FireSphereSection = lazy(() => import('./components/FireSphereSection'))
const AdminPortal = lazy(
  () => import('./features/submissions/AdminPortal'),
)

const isConferenceEntry = () =>
  new URLSearchParams(window.location.search).get('conferencia') ===
  'sobretodaacarne'

const isParticipationEntry = () =>
  window.location.pathname.replace(/\/+$/, '') === '/participar'

const shouldShowLeadForm = () =>
  isConferenceEntry() || isParticipationEntry()

const getLeadSource = (): LeadSource =>
  isConferenceEntry()
    ? { origin: 'conference', conferenceSlug: 'sobretodaacarne' }
    : { origin: 'participation', conferenceSlug: null }

const isAdminEntry = () =>
  window.location.pathname.replace(/\/+$/, '') === '/admin'

function App() {
  const isAdmin = isAdminEntry()
  const [hasEnteredExperience, setHasEnteredExperience] = useState(
    () => !shouldShowLeadForm(),
  )
  const [showPreloader, setShowPreloader] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleLeadContinue = async (data: LeadSubmissionData) => {
    await submitLead(data)
    setHasEnteredExperience(true)
  }

  useEffect(() => {
    if (isAdmin || !hasEnteredExperience) return

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
  }, [hasEnteredExperience, isAdmin])

  if (isAdmin) {
    return (
      <Suspense fallback={<main className="min-h-[100svh] bg-black" />}>
        <AdminPortal />
      </Suspense>
    )
  }

  if (!hasEnteredExperience) {
    return (
      <LeadFormScreen
        source={getLeadSource()}
        onContinue={handleLeadContinue}
      />
    )
  }

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
