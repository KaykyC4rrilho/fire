import {
  createSupabaseContext,
  type SupabaseContext,
} from '@supabase/server'
import type { Database } from '../server/database.types.js'

type SubmissionOrigin = 'conference' | 'participation' | 'manual'
type SubmissionRow = Database['public']['Tables']['submissions']['Row']

const submissionColumns =
  'id, name, phone, is_christian, origin, conference_slug, created_at, updated_at'
const knownConferences = new Set(['sobretodaacarne'])

function jsonError(message: string, status: number, code?: string) {
  return Response.json(
    { error: { message, ...(code ? { code } : {}) } },
    { status },
  )
}

async function readBody(request: Request) {
  try {
    const body: unknown = await request.json()
    return body && typeof body === 'object'
      ? (body as Record<string, unknown>)
      : null
  } catch {
    return null
  }
}

function parseName(value: unknown) {
  if (typeof value !== 'string') return null
  const name = value.trim().replace(/\s+/g, ' ')
  return name.length >= 2 && name.length <= 120 ? name : null
}

function parsePhone(value: unknown) {
  if (typeof value !== 'string') return null
  const digits = value.replace(/\D/g, '')
  if (digits.length !== 10 && digits.length !== 11) return null

  const areaCode = digits.slice(0, 2)
  const prefix = digits.slice(2, digits.length - 4)
  const suffix = digits.slice(-4)
  return `(${areaCode}) ${prefix}-${suffix}`
}

function parseChristian(value: unknown) {
  if (value === true || value === 'sim') return true
  if (value === false || value === 'nao') return false
  return null
}

function parseOrigin(value: unknown): SubmissionOrigin | null {
  return value === 'conference' ||
    value === 'participation' ||
    value === 'manual'
    ? value
    : null
}

function parseConferenceSlug(origin: SubmissionOrigin, value: unknown) {
  if (origin !== 'conference') return null
  if (typeof value !== 'string' || !knownConferences.has(value)) return undefined
  return value
}

function serializeSubmission(row: SubmissionRow) {
  return {
    id: String(row.id),
    name: row.name,
    phone: row.phone,
    isChristian: row.is_christian,
    origin: row.origin,
    conferenceSlug: row.conference_slug,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function databaseFailure(operation: string, error: { message: string }) {
  console.error(`Supabase ${operation} failed:`, error.message)
  return jsonError('Não foi possível concluir a operação.', 500, 'DATABASE_ERROR')
}

async function createSubmission(
  body: Record<string, unknown>,
  context: SupabaseContext<Database>,
  isAdminRequest: boolean,
) {
  const name = parseName(body.name)
  const phone = parsePhone(body.phone)
  const isChristian = parseChristian(body.isChristian)
  const origin = parseOrigin(body.origin)

  if (!name || !phone || isChristian === null || !origin) {
    return jsonError('Confira os dados informados e tente novamente.', 400, 'INVALID_DATA')
  }

  if (origin === 'manual' && !isAdminRequest) {
    return jsonError('Origem inválida.', 400, 'INVALID_ORIGIN')
  }

  if (origin !== 'manual' && isAdminRequest) {
    return jsonError('Cadastros do painel devem usar origem manual.', 400, 'INVALID_ORIGIN')
  }

  const conferenceSlug = parseConferenceSlug(origin, body.conferenceSlug)
  if (origin === 'conference' && conferenceSlug === undefined) {
    return jsonError('Conferência inválida.', 400, 'INVALID_CONFERENCE')
  }

  const { data, error } = await context.supabaseAdmin
    .from('submissions')
    .insert({
      name,
      phone,
      is_christian: isChristian,
      origin,
      conference_slug: conferenceSlug,
    })
    .select(submissionColumns)
    .single()

  if (error) return databaseFailure('insert', error)

  return Response.json({ submission: serializeSubmission(data) }, { status: 201 })
}

async function listSubmissions(
  request: Request,
  context: SupabaseContext<Database>,
) {
  const url = new URL(request.url)
  const requestedLimit = Number(url.searchParams.get('limit') ?? 100)
  const limit = Number.isInteger(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 200)
    : 100
  const beforeId = Number(url.searchParams.get('beforeId'))

  let query = context.supabaseAdmin
    .from('submissions')
    .select(submissionColumns)
    .order('id', { ascending: false })
    .limit(limit)

  if (Number.isSafeInteger(beforeId) && beforeId > 0) {
    query = query.lt('id', beforeId)
  }

  const origin = parseOrigin(url.searchParams.get('origin'))
  if (origin) query = query.eq('origin', origin)

  const christian = url.searchParams.get('christian')
  if (christian === 'sim' || christian === 'nao') {
    query = query.eq('is_christian', christian === 'sim')
  }

  const { data, error } = await query
  if (error) return databaseFailure('select', error)

  return Response.json({
    submissions: data.map(serializeSubmission),
    nextCursor: data.length === limit ? String(data.at(-1)?.id) : null,
  })
}

async function updateSubmission(
  body: Record<string, unknown>,
  context: SupabaseContext<Database>,
) {
  const id = Number(body.id)
  const name = parseName(body.name)
  const phone = parsePhone(body.phone)
  const isChristian = parseChristian(body.isChristian)

  if (!Number.isSafeInteger(id) || id <= 0 || !name || !phone || isChristian === null) {
    return jsonError('Confira os dados informados e tente novamente.', 400, 'INVALID_DATA')
  }

  const { data, error } = await context.supabaseAdmin
    .from('submissions')
    .update({ name, phone, is_christian: isChristian })
    .eq('id', id)
    .select(submissionColumns)
    .maybeSingle()

  if (error) return databaseFailure('update', error)
  if (!data) return jsonError('Cadastro não encontrado.', 404, 'NOT_FOUND')

  return Response.json({ submission: serializeSubmission(data) })
}

async function deleteSubmission(
  request: Request,
  context: SupabaseContext<Database>,
) {
  const id = Number(new URL(request.url).searchParams.get('id'))
  if (!Number.isSafeInteger(id) || id <= 0) {
    return jsonError('Identificador inválido.', 400, 'INVALID_ID')
  }

  const { data, error } = await context.supabaseAdmin
    .from('submissions')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle()

  if (error) return databaseFailure('delete', error)
  if (!data) return jsonError('Cadastro não encontrado.', 404, 'NOT_FOUND')

  return new Response(null, { status: 204 })
}

async function handler(request: Request) {
  const method = request.method.toUpperCase()
  const body = method === 'POST' || method === 'PATCH' ? await readBody(request) : null

  if ((method === 'POST' || method === 'PATCH') && !body) {
    return jsonError('Corpo da requisição inválido.', 400, 'INVALID_BODY')
  }

  const isManualCreation = method === 'POST' && body?.origin === 'manual'
  const isPublicCreation = method === 'POST' && !isManualCreation
  const { data: context, error: authError } = await createSupabaseContext<Database>(
    request,
    { auth: isPublicCreation ? 'publishable' : 'user' },
  )

  if (authError) {
    return jsonError(authError.message, authError.status, authError.code)
  }

  const adminRequest = !isPublicCreation

  if (method === 'POST') {
    return createSubmission(body!, context, adminRequest)
  }
  if (method === 'GET') return listSubmissions(request, context)
  if (method === 'PATCH') return updateSubmission(body!, context)
  if (method === 'DELETE') return deleteSubmission(request, context)

  return new Response(null, {
    status: 405,
    headers: { Allow: 'GET, POST, PATCH, DELETE' },
  })
}

export default { fetch: handler }
