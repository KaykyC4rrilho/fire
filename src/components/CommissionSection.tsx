function CommissionSection() {
  return (
    <section
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-black px-6 py-16 sm:px-10 lg:px-16"
      aria-labelledby="commission-title"
    >
      <div
        className="pointer-events-none absolute -right-[0.05em] top-1/2 -translate-y-1/2 select-none font-sans text-[clamp(18rem,42vw,48rem)] font-black leading-none tracking-[-0.12em] text-transparent [-webkit-text-stroke:1px_rgba(255,122,67,0.13)]"
        aria-hidden="true"
      >
        SIM
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[90rem] border-t border-fire/25 pt-8 sm:pt-10">
        <p className="font-sans text-xs font-medium uppercase tracking-[0.38em] text-fire sm:text-sm">
          Você foi comissionada.
        </p>

        <h2
          id="commission-title"
          className="mt-8 max-w-[72rem] font-sans text-[clamp(4rem,8.5vw,9rem)] font-extrabold leading-[0.82] tracking-[-0.075em] text-cream"
        >
          Agora,
          <br />
          <span className="text-fire">viva a missão.</span>
        </h2>

        <div className="mt-12 flex max-w-[62rem] flex-col gap-8 border-l border-fire/35 pl-6 sm:mt-14 sm:flex-row sm:items-end sm:justify-between sm:gap-12 sm:pl-8">
          <p className="max-w-[34rem] font-sans text-lg font-light leading-relaxed text-rose-beige sm:text-xl">
            O Fire continua através de cada pessoa que decide dizer{' '}
            <strong className="font-semibold text-cream">sim</strong>.
          </p>

          <a
            href="/participar"
            className="group inline-flex min-h-14 shrink-0 items-center justify-center gap-5 self-start border border-fire bg-fire px-7 font-sans text-sm font-semibold uppercase tracking-[0.12em] text-[#17110f] transition-colors duration-300 hover:bg-transparent hover:text-fire focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fire sm:self-auto"
          >
            Quero fazer parte
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
          </a>
        </div>
      </div>
    </section>
  )
}

export default CommissionSection
