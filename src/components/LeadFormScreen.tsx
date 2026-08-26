import fireArtwork from '../assets/FIRE.svg'
import LeadForm, { type LeadFormData } from './LeadForm'

type LeadFormScreenProps = {
  onContinue: (data: LeadFormData) => void
}

function LeadFormScreen({ onContinue }: LeadFormScreenProps) {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-black text-cream">
      <div
        className="pointer-events-none absolute -left-32 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-fire/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-[100svh] w-full max-w-[100rem] lg:grid-cols-[1.08fr_0.92fr]">
        <section className="flex flex-col justify-between border-b border-cream/10 px-6 py-8 sm:px-10 sm:py-10 lg:border-b-0 lg:border-r lg:px-16 lg:py-12">
          <img
            className="h-auto w-16 select-none sm:w-20"
            src={fireArtwork}
            width="1091"
            height="835"
            alt="Movimento Fire"
          />

          <div className="my-16 max-w-[49rem] lg:my-12">
            <p className="font-sans text-xs font-medium uppercase tracking-[0.4em] text-fire sm:text-sm">
              Sobre toda a carne
            </p>

            <h1 className="mt-7 font-sans text-[clamp(3.5rem,6.4vw,7.5rem)] font-extrabold leading-[0.82] tracking-[-0.075em] text-cream">
              Você chegou
              <br />
              até aqui por
              <br />
              <span className="text-fire">um propósito.</span>
            </h1>
          </div>

          <div className="max-w-[36rem] border-l border-fire/35 pl-5 font-sans text-base font-light leading-relaxed text-rose-beige sm:text-lg">
            <p>Antes de continuar, queremos conhecer um pouco mais sobre você.</p>
            <p className="mt-2 text-cream/85">
              Preencha seus dados para seguir nessa experiência.
            </p>
          </div>
        </section>

        <section className="flex items-center px-6 py-12 sm:px-10 lg:px-14 xl:px-20">
          <LeadForm onSubmit={onContinue} />
        </section>
      </div>
    </main>
  )
}

export default LeadFormScreen
