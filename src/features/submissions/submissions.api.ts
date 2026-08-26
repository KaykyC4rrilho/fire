import type { Submission, SubmissionDraft } from './submission.types'

type SubmissionResponse = {
  submission: Submission
}

type SubmissionsResponse = {
  submissions: Submission[]
  nextCursor: string | null
}

type ErrorResponse = {
  error?: {
    message?: string
  }
}

async function apiRequest<T>(
  accessToken: string,
  init: RequestInit = {},
  query = '',
) {
  const response = await fetch(`/api/submissions${query}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ErrorResponse | null
    throw new Error(
      payload?.error?.message ?? `A API respondeu com HTTP ${response.status}.`,
    )
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export async function fetchSubmissions(
  accessToken: string,
  signal?: AbortSignal,
) {
  const response = await apiRequest<SubmissionsResponse>(accessToken, { signal })
  return response.submissions
}

export async function createSubmission(
  accessToken: string,
  draft: SubmissionDraft,
) {
  const response = await apiRequest<SubmissionResponse>(accessToken, {
    method: 'POST',
    body: JSON.stringify({
      ...draft,
      origin: 'manual',
      conferenceSlug: null,
    }),
  })
  return response.submission
}

export async function updateSubmission(
  accessToken: string,
  id: string,
  draft: SubmissionDraft,
) {
  const response = await apiRequest<SubmissionResponse>(accessToken, {
    method: 'PATCH',
    body: JSON.stringify({ id, ...draft }),
  })
  return response.submission
}

export async function deleteSubmission(accessToken: string, id: string) {
  await apiRequest<void>(
    accessToken,
    { method: 'DELETE' },
    `?id=${encodeURIComponent(id)}`,
  )
}
