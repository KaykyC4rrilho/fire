import { type FormEvent, useEffect, useState } from 'react'
import { formatPhone } from '../../lib/phone'
import type { Submission, SubmissionDraft } from './submission.types'

type SubmissionEditorProps = {
  isOpen: boolean
  submission: Submission | null
  onClose: () => void
  onSave: (draft: SubmissionDraft) => void
}

function SubmissionEditor({
  isOpen,
  submission,
  onClose,
  onSave,
}: SubmissionEditorProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isChristian, setIsChristian] = useState(true)

  useEffect(() => {
    if (!isOpen) return

    setName(submission?.name ?? '')
    setPhone(submission?.phone ?? '')
    setIsChristian(submission?.isChristian ?? true)
  }, [isOpen, submission])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) return

    onSave({ name: name.trim(), phone, isChristian })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex justify-end" role="presentation">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/70"
        onClick={onClose}
        aria-label="Fechar painel"
      />

      <aside
        className="relative flex h-full w-full max-w-[34rem] flex-col border-l border-cream/15 bg-[#0b0a09] text-cream shadow-[-2rem_0_5rem_rgba(0,0,0,0.45)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="submission-editor-title"
      >
        <header className="flex items-center justify-between border-b border-cream/10 px-6 py-6 sm:px-8">
          <h2
            id="submission-editor-title"
            className="font-sans text-2xl font-semibold tracking-[-0.035em]"
          >
            {submission ? 'Editar cadastro' : 'Novo cadastro'}
          </h2>

          <button
            type="button"
            className="grid size-10 place-items-center border border-cream/15 text-cream/60 transition-colors hover:border-fire hover:text-fire"
            onClick={onClose}
            aria-label="Fechar"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="flex-1 space-y-8 overflow-y-auto px-6 py-8 sm:px-8">
            <label className="block font-sans">
              <span className="text-sm font-medium text-cream">Nome</span>
              <input
                className="mt-3 w-full border border-cream/15 bg-transparent px-4 py-3 text-base font-light text-cream outline-none transition-colors placeholder:text-cream/25 focus:border-fire"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nome completo"
                autoComplete="name"
                required
                autoFocus
              />
            </label>

            <label className="block font-sans">
              <span className="text-sm font-medium text-cream">Telefone</span>
              <input
                className="mt-3 w-full border border-cream/15 bg-transparent px-4 py-3 text-base font-light text-cream outline-none transition-colors placeholder:text-cream/25 focus:border-fire"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(formatPhone(event.target.value))}
                placeholder="(00) 00000-0000"
                autoComplete="tel"
                inputMode="tel"
                minLength={15}
                required
              />
            </label>

            <fieldset>
              <legend className="font-sans text-sm font-medium text-cream">
                Você é cristão(ã)?
              </legend>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {[
                  { label: 'Sim', value: true },
                  { label: 'Não', value: false },
                ].map((option) => (
                  <label
                    key={option.label}
                    className={`cursor-pointer border px-4 py-3 text-center font-sans text-sm font-medium transition-colors ${
                      isChristian === option.value
                        ? 'border-fire bg-fire text-[#17110f]'
                        : 'border-cream/15 text-cream/60 hover:border-fire/60'
                    }`}
                  >
                    <input
                      className="sr-only"
                      type="radio"
                      name="editorIsChristian"
                      checked={isChristian === option.value}
                      onChange={() => setIsChristian(option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <footer className="grid grid-cols-2 gap-3 border-t border-cream/10 px-6 py-6 sm:px-8">
            <button
              type="button"
              className="min-h-12 border border-cream/20 px-5 font-sans text-sm font-medium text-cream/70 transition-colors hover:border-cream/50 hover:text-cream"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-12 border border-fire bg-fire px-5 font-sans text-sm font-semibold text-[#17110f] transition-colors hover:bg-transparent hover:text-fire"
            >
              {submission ? 'Salvar alterações' : 'Criar cadastro'}
            </button>
          </footer>
        </form>
      </aside>
    </div>
  )
}

export default SubmissionEditor
