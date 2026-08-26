import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient

  const url = import.meta.env.VITE_SUPABASE_URL
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (!url || !publishableKey) {
    throw new Error('As variáveis públicas do Supabase não estão configuradas.')
  }

  browserClient = createClient(url, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return browserClient
}
