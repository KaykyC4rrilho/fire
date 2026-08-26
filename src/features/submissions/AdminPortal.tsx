import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from '../../lib/supabase-browser'
import AdminLogin from './AdminLogin'
import SubmissionsDashboard from './SubmissionsDashboard'

function AdminPortal() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [configurationError, setConfigurationError] = useState('')

  useEffect(() => {
    try {
      const client = getSupabaseBrowserClient()

      void client.auth.getSession().then(({ data, error }) => {
        if (error) {
          setConfigurationError(error.message)
          setSession(null)
          return
        }
        setSession(data.session)
      })

      const { data } = client.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession)
      })

      return () => data.subscription.unsubscribe()
    } catch (error) {
      setConfigurationError(
        error instanceof Error ? error.message : 'Supabase não configurado.',
      )
      setSession(null)
    }
  }, [])

  if (session === undefined) {
    return <main className="min-h-[100svh] bg-[#080706]" />
  }

  if (configurationError) {
    return (
      <main className="grid min-h-[100svh] place-items-center bg-[#080706] px-5 text-cream">
        <p className="max-w-lg border border-[#a84d45]/60 p-6 text-[#e27e72]">
          {configurationError}
        </p>
      </main>
    )
  }

  if (!session) return <AdminLogin />

  return (
    <SubmissionsDashboard
      accessToken={session.access_token}
      userEmail={session.user.email ?? 'Administrador'}
      onSignOut={() => getSupabaseBrowserClient().auth.signOut()}
    />
  )
}

export default AdminPortal
