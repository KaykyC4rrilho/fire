import { useEffect, useMemo, useState } from 'react'
import fireArtwork from '../../assets/FIRE.svg'
import SubmissionEditor from './SubmissionEditor'
import SubmissionsTable from './SubmissionsTable'
import {
  createSubmission,
  deleteSubmission,
  fetchSubmissions,
  updateSubmission,
} from './submissions.api'
import type {
  Submission,
  SubmissionDraft,
  SubmissionFilter,
} from './submission.types'

const filters: Array<{ label: string; value: SubmissionFilter }> = [
  { label: 'Todos', value: 'all' },
  { label: 'Cristãos', value: 'christian' },
  { label: 'Não cristãos', value: 'notChristian' },
]

function normalizeSearch(value: string) {
  return value.toLocaleLowerCase('pt-BR').trim()
}

export type SubmissionsDashboardProps = {
  accessToken: string
  userEmail: string
  onSignOut: () => void
}

function SubmissionsDashboard({
  accessToken,
  userEmail,
  onSignOut,
}: SubmissionsDashboardProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<SubmissionFilter>('all')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editorSubmission, setEditorSubmission] = useState<Submission | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Submission | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetchSubmissions(accessToken, controller.signal)
      .then(setSubmissions)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setErrorMessage(
            error instanceof Error ? error.message : 'Não foi possível carregar os cadastros.',
          )
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [accessToken])

  const filteredSubmissions = useMemo(() => {
    const normalizedQuery = normalizeSearch(query)
    const queryDigits = query.replace(/\D/g, '')

    return submissions.filter((submission) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'christian' && submission.isChristian) ||
        (filter === 'notChristian' && !submission.isChristian)
      const matchesSearch =
        !normalizedQuery ||
        normalizeSearch(submission.name).includes(normalizedQuery) ||
        (queryDigits.length > 0 &&
          submission.phone.replace(/\D/g, '').includes(queryDigits))

      return matchesFilter && matchesSearch
    })
  }, [filter, query, submissions])

  const openCreate = () => {
    setEditorSubmission(null)
    setIsEditorOpen(true)
  }

  const openEdit = (submission: Submission) => {
    setEditorSubmission(submission)
    setIsEditorOpen(true)
  }

  const closeEditor = () => {
    setIsEditorOpen(false)
    setEditorSubmission(null)
  }

  const saveSubmission = async (draft: SubmissionDraft) => {
    try {
      setErrorMessage('')
      const savedSubmission = editorSubmission
        ? await updateSubmission(accessToken, editorSubmission.id, draft)
        : await createSubmission(accessToken, draft)

      setSubmissions((current) =>
        editorSubmission
          ? current.map((submission) =>
              submission.id === savedSubmission.id ? savedSubmission : submission,
            )
          : [savedSubmission, ...current],
      )
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Não foi possível salvar o cadastro.',
      )
      return
    }

    closeEditor()
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return

    try {
      setErrorMessage('')
      await deleteSubmission(accessToken, pendingDelete.id)
      setSubmissions((current) =>
        current.filter((submission) => submission.id !== pendingDelete.id),
      )
      setPendingDelete(null)
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Não foi possível excluir o cadastro.',
      )
    }
  }

  return (
    <main className="min-h-[100svh] bg-[#080706] text-cream">
      <header className="border-b border-cream/10 px-5 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[96rem] items-center justify-between">
          <a
            href="/"
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fire"
            aria-label="Movimento Fire — voltar para o site"
          >
            <img
              className="h-auto w-14 select-none sm:w-16"
              src={fireArtwork}
              width="1091"
              height="835"
              alt="Movimento Fire"
            />
          </a>

          <div className="flex items-center gap-5">
            <div className="hidden text-right sm:block">
              <p className="text-[0.65rem] uppercase tracking-[0.18em] text-cream/35">
                Conectado como
              </p>
              <p className="mt-1 max-w-52 truncate text-xs text-cream/65">{userEmail}</p>
            </div>
            <button
              type="button"
              className="border border-cream/15 px-4 py-2.5 font-sans text-xs font-medium uppercase tracking-[0.14em] text-cream/60 transition-colors hover:border-fire hover:text-fire"
              onClick={() => void onSignOut()}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[96rem] px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        <div className="flex flex-col gap-8 border-b border-cream/10 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-sans text-[clamp(3rem,5vw,5.5rem)] font-extrabold leading-none tracking-[-0.065em] text-cream">
              Cadastros
            </h1>
            <p className="mt-3 font-sans text-base font-light text-rose-beige sm:text-lg">
              Pessoas cadastradas.
            </p>
          </div>

          <button
            type="button"
            className="group inline-flex min-h-12 items-center justify-center gap-4 self-start border border-fire bg-fire px-6 font-sans text-sm font-semibold text-[#17110f] transition-colors hover:bg-transparent hover:text-fire sm:self-auto"
            onClick={openCreate}
          >
            Novo cadastro
            <svg
              className="size-4 transition-transform duration-300 group-hover:rotate-90"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4 py-7 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block w-full lg:max-w-[28rem]">
            <span className="sr-only">Buscar cadastros</span>
            <svg
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-cream/40"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
              <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <input
              className="min-h-12 w-full border border-cream/15 bg-transparent pl-12 pr-4 font-sans text-sm text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-fire"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nome ou telefone"
            />
          </label>

          <div className="grid grid-cols-3 border border-cream/15" aria-label="Filtrar cadastros">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                className={`min-h-12 border-r border-cream/15 px-4 font-sans text-xs font-medium transition-colors last:border-r-0 sm:px-6 sm:text-sm ${
                  filter === item.value
                    ? 'bg-fire text-[#17110f]'
                    : 'text-cream/60 hover:text-cream'
                }`}
                onClick={() => setFilter(item.value)}
                aria-pressed={filter === item.value}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {errorMessage ? (
          <p className="mb-5 border border-[#a84d45]/60 p-4 text-sm text-[#e27e72]" role="alert">
            {errorMessage}
          </p>
        ) : null}

        {isLoading ? (
          <p className="border-y border-cream/10 py-20 text-center text-sm text-cream/50">
            Carregando cadastros...
          </p>
        ) : (
          <SubmissionsTable
            submissions={filteredSubmissions}
            onEdit={openEdit}
            onDelete={setPendingDelete}
          />
        )}

        <p className="mt-4 font-sans text-xs font-light text-cream/35">
          Exibindo {filteredSubmissions.length} de {submissions.length}{' '}
          {submissions.length === 1 ? 'cadastro' : 'cadastros'}
        </p>
      </div>

      <SubmissionEditor
        isOpen={isEditorOpen}
        submission={editorSubmission}
        onClose={closeEditor}
        onSave={saveSubmission}
      />

      {pendingDelete ? (
        <div className="fixed inset-0 z-[110] grid place-items-center bg-black/75 px-5">
          <div
            className="w-full max-w-[30rem] border border-cream/15 bg-[#0b0a09] p-6 text-cream shadow-[0_2rem_6rem_rgba(0,0,0,0.5)] sm:p-8"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-description"
          >
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#e27e72]">
              Excluir cadastro
            </p>
            <h2 id="delete-title" className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
              Tem certeza?
            </h2>
            <p id="delete-description" className="mt-3 text-sm font-light leading-relaxed text-cream/55">
              O cadastro de {pendingDelete.name} será removido desta visualização.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="min-h-12 border border-cream/20 text-sm font-medium text-cream/70 transition-colors hover:border-cream/50 hover:text-cream"
                onClick={() => setPendingDelete(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="min-h-12 border border-[#a84d45] bg-[#a84d45] text-sm font-semibold text-cream transition-colors hover:bg-transparent hover:text-[#e27e72]"
                onClick={confirmDelete}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default SubmissionsDashboard
