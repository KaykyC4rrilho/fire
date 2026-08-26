import type { LeadSubmissionData } from '../types/lead'

type ApiErrorResponse = {
  error?: {
    message?: string
  }
}

export async function submitLead(data: LeadSubmissionData) {
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!publishableKey) {
    throw new Error('A chave pública do formulário não está configurada.')
  }

  const response = await fetch('/api/submissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: publishableKey,
    },
    body: JSON.stringify(data),
  })

  if (response.ok) return

  const payload = (await response.json().catch(() => null)) as ApiErrorResponse | null
  const fallbackMessage = import.meta.env.DEV
    ? `A API do formulário respondeu com HTTP ${response.status}.`
    : 'Não foi possível enviar seus dados. Tente novamente.'

  throw new Error(
    payload?.error?.message ?? fallbackMessage,
  )
}
