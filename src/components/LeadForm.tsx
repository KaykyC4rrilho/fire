import { type FormEvent, useState } from 'react'
import { formatPhone } from '../lib/phone'
import type { LeadFormData } from '../types/lead'

type LeadFormProps = {
  onSubmit: (data: LeadFormData) => void | Promise<void>
  buttonLabel?: string
}

function LeadForm({ onSubmit, buttonLabel = 'Continuar' }: LeadFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isChristian, setIsChristian] = useState<'sim' | 'nao' | ''>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim() || !isChristian || isSubmitting) return

    setSubmitError('')
    setIsSubmitting(true)

    try {
      await onSubmit({ name: name.trim(), phone, isChristian })
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Não foi possível enviar seus dados. Tente novamente.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="mb-10 flex items-center gap-3" aria-hidden="true">
        <span className="size-1.5 rotate-45 bg-fire" />
        <span className="h-px flex-1 bg-gradient-to-r from-fire/70 to-transparent" />
      </div>

      <div className="space-y-9">
        <label className="block font-sans">
          <span className="text-sm font-medium text-cream sm:text-base">
            Qual é o seu nome?
          </span>
          <input
            className="mt-3 w-full border-0 border-b border-cream/20 bg-transparent px-0 py-3 font-sans text-xl font-light text-cream outline-none transition-colors placeholder:text-cream/25 focus:border-fire sm:text-2xl"
            type="text"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Seu nome"
            autoComplete="name"
            required
          />
        </label>

        <label className="block font-sans">
          <span className="text-sm font-medium text-cream sm:text-base">
            Qual é o seu telefone?
          </span>
          <input
            className="mt-3 w-full border-0 border-b border-cream/20 bg-transparent px-0 py-3 font-sans text-xl font-light text-cream outline-none transition-colors placeholder:text-cream/25 focus:border-fire sm:text-2xl"
            type="tel"
            name="phone"
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
          <legend className="font-sans text-sm font-medium text-cream sm:text-base">
            Você é cristão(ã)?
          </legend>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {(['sim', 'nao'] as const).map((value) => (
              <label
                key={value}
                className={`cursor-pointer border px-5 py-4 font-sans text-sm font-medium uppercase tracking-[0.16em] transition-colors ${
                  isChristian === value
                    ? 'border-fire bg-fire text-[#17110f]'
                    : 'border-cream/20 text-cream/65 hover:border-fire/60 hover:text-cream'
                }`}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="isChristian"
                  value={value}
                  checked={isChristian === value}
                  onChange={() => setIsChristian(value)}
                  required
                />
                {value === 'sim' ? 'Sim' : 'Não'}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group mt-10 inline-flex min-h-14 w-full items-center justify-between border border-fire bg-fire px-6 font-sans text-sm font-semibold uppercase tracking-[0.16em] text-[#17110f] transition-colors duration-300 hover:bg-transparent hover:text-fire focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fire"
      >
        {isSubmitting ? 'Enviando...' : buttonLabel}
        <svg
          className="size-5 transition-transform duration-300 group-hover:translate-x-1"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 12h14m-5-5 5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <p
        className={`mt-4 font-sans text-sm text-[#e27e72] ${
          submitError ? 'block' : 'hidden'
        }`}
        role="alert"
        aria-live="polite"
      >
        {submitError}
      </p>

      <p className="mt-5 font-sans text-xs font-light leading-relaxed text-cream/35">
        Seus dados serão utilizados apenas para esta experiência e comunicações
        relacionadas ao evento.
      </p>
    </form>
  )
}

export default LeadForm
