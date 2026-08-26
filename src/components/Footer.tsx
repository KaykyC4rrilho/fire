import fireArtwork from '../assets/FIRE.svg'

function Footer() {
  return (
    <footer className="border-t border-fire/15 bg-black px-6 py-10 text-cream sm:px-10 sm:py-12 lg:px-16">
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <a
              href="#hero-title"
              className="inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fire"
              aria-label="Movimento Fire — voltar ao início"
            >
              <img
                className="h-auto w-20 select-none sm:w-24"
                src={fireArtwork}
                width="1091"
                height="835"
                alt="Movimento Fire"
              />
            </a>

            <p className="mt-6 max-w-[28rem] font-sans text-sm font-light leading-relaxed text-rose-beige sm:text-base">
              Uma igreja que se move para alcançar outras pessoas.
            </p>

            <div className="mt-8 grid max-w-[36rem] gap-6 border-l border-fire/30 pl-5 font-sans sm:grid-cols-2 sm:gap-10">
              <div>
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-fire">
                  Quando
                </p>
                <p className="mt-2 text-sm font-light leading-relaxed text-cream/80 sm:text-base">
                  Toda sexta-feira, às 19h30
                </p>
              </div>

              <address className="not-italic">
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-fire">
                  Onde
                </p>
                <p className="mt-2 text-sm font-light leading-relaxed text-cream/80 sm:text-base">
                  Rua Sargento Silva Nunes, 560
                </p>
              </address>
            </div>
          </div>

          <nav aria-label="Navegação do rodapé">
            <ul className="flex flex-wrap gap-x-7 gap-y-3 font-sans text-xs font-medium uppercase tracking-[0.18em] text-cream/70 sm:text-sm">
              <li>
                <a className="transition-colors hover:text-fire" href="#hero-title">
                  Início
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-fire" href="#manifesto-title">
                  Manifesto
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-fire" href="#commission-title">
                  Missão
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-cream/10 pt-6 font-sans text-xs font-light uppercase tracking-[0.14em] text-cream/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Movimento Fire.</p>
          <a
            href="#hero-title"
            className="group inline-flex items-center gap-3 self-start transition-colors hover:text-fire sm:self-auto"
          >
            Voltar ao topo
            <span
              className="transition-transform duration-300 group-hover:-translate-y-1"
              aria-hidden="true"
            >
              ↑
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
