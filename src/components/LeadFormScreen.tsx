import fireArtwork from '../assets/FIRE.svg'
import type { LeadSource, LeadSubmissionData } from '../types/lead'
import LeadForm from './LeadForm'

type LeadFormScreenProps = {
  source: LeadSource
  onContinue: (data: LeadSubmissionData) => void
}

function LeadFormScreen({ source, onContinue }: LeadFormScreenProps) {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-black text-cream">
      <div
        className="pointer-events-none absolute -left-32 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-fire/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-[100svh] w-full max-w-[100rem] lg:grid-cols-[1.08fr_0.92fr]">
        <section className="flex flex-col justify-start border-b border-cream/10 px-6 py-8 sm:px-10 sm:py-10 lg:justify-between lg:border-b-0 lg:border-r lg:px-16 lg:py-12">
          <img
            className="h-auto w-16 select-none sm:w-20"
            src={fireArtwork}
            width="1091"
            height="835"
            alt="Movimento Fire"
          />

          <div className="my-6 max-w-[49rem] sm:my-14 lg:my-12">
            <p className="font-sans text-xs font-medium uppercase tracking-[0.4em] text-fire sm:text-sm">
              Sobre toda a carne
            </p>

            <h1 className="mt-4 font-sans text-[clamp(2.4rem,11vw,4rem)] font-extrabold leading-[0.88] tracking-[-0.075em] text-cream sm:mt-7 sm:text-[clamp(3.5rem,6.4vw,7.5rem)] sm:leading-[0.82]">
              Você chegou
              <br />
              até aqui por
              <br />
              <span className="text-fire">um propósito.</span>
            </h1>
          </div>

          <div className="max-w-[36rem] border-l border-fire/35 pl-4 font-sans text-xs font-light leading-relaxed text-rose-beige sm:pl-5 sm:text-lg">
            <p>
              Antes de continuar, queremos conhecer um pouco mais sobre você.
              <br />
              <span className="text-cream/85">Preencha seus dados para seguir nessa experiência.</span>
            </p>
          </div>
        </section>

        <section className="flex items-center px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-12 xl:px-20">
          <LeadForm
            onSubmit={(data) => onContinue({ ...data, ...source })}
          />
        </section>
      </div>
    </main>
  )
}

export default LeadFormScreen
