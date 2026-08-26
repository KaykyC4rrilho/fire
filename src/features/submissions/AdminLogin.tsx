import { type FormEvent, useState } from 'react'
import fireArtwork from '../../assets/FIRE.svg'
import { getSupabaseBrowserClient } from '../../lib/supabase-browser'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const { error } = await getSupabaseBrowserClient().auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) throw error
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message !== 'Invalid login credentials'
          ? error.message
          : 'E-mail ou senha inválidos.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-[100svh] place-items-center bg-[#080706] px-5 py-12 text-cream">
      <section className="w-full max-w-[30rem] border border-cream/15 bg-[#0b0a09] p-7 shadow-[0_2rem_8rem_rgba(0,0,0,0.55)] sm:p-10">
        <img
          className="h-auto w-16 select-none"
          src={fireArtwork}
          width="1091"
          height="835"
          alt="Movimento Fire"
        />

        <p className="mt-12 text-xs font-medium uppercase tracking-[0.28em] text-fire">
          Área administrativa
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-[-0.055em] sm:text-5xl">
          Acessar cadastros
        </h1>
        <p className="mt-3 text-sm font-light leading-relaxed text-cream/50">
          Entre com o usuário administrador criado no Supabase.
        </p>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-cream">E-mail</span>
            <input
              className="mt-3 min-h-12 w-full border border-cream/15 bg-transparent px-4 text-cream outline-none transition-colors placeholder:text-cream/25 focus:border-fire"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="voce@exemplo.com"
              required
              autoFocus
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-cream">Senha</span>
            <input
              className="mt-3 min-h-12 w-full border border-cream/15 bg-transparent px-4 text-cream outline-none transition-colors placeholder:text-cream/25 focus:border-fire"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Sua senha"
              required
            />
          </label>

          {errorMessage ? (
            <p className="text-sm text-[#e27e72]" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <button
            className="min-h-13 w-full border border-fire bg-fire px-6 text-sm font-semibold uppercase tracking-[0.15em] text-[#17110f] transition-colors hover:bg-transparent hover:text-fire disabled:cursor-wait disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default AdminLogin
