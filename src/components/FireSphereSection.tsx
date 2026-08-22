import { useEffect, useRef, useState } from 'react'
import { FireSphere } from './ui/fire-sphere'

const revealBase =
  'transition-all duration-1000 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100'

function FireSphereSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.28,
      },
    )

    observer.observe(sectionRef.current)

    return () => observer.disconnect()
  }, [])

  const revealClass = isVisible
    ? 'translate-y-0 opacity-100'
    : 'translate-y-8 opacity-0'

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[100svh] overflow-hidden bg-black px-6 py-16 text-cream sm:px-10 lg:flex lg:items-center lg:px-16 lg:py-20"
      aria-labelledby="intro-title"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-[90rem] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
        {/* TEXTO */}
        <article className="relative z-20 flex w-full flex-col justify-center lg:pr-10 xl:pr-16">
          <p
            className={`${revealBase} ${revealClass} mb-6 font-sans text-xs font-light uppercase tracking-[0.42em] text-fire sm:text-sm lg:text-base`}
          >
            Mais do que um encontro
          </p>

          <h2
            id="intro-title"
            className={`${revealBase} ${revealClass} max-w-[40rem] font-sans text-5xl font-light leading-[0.95] tracking-[-0.075em] text-cream delay-150 sm:text-6xl lg:text-[clamp(3.5rem,4.6vw,5.5rem)]`}
          >
            Um movimento para quem decidiu viver o Evangelho.
          </h2>

          <div className="mt-10 flex max-w-[38rem] flex-col gap-7 font-sans text-lg font-light leading-relaxed text-rose-beige sm:text-xl lg:text-[clamp(1.05rem,1.25vw,1.35rem)]">
            <p className={`${revealBase} ${revealClass} delay-300`}>
              Fire é sobre pessoas que entendem que a fé não termina em um culto,
              em um evento ou dentro de quatro paredes.
            </p>

            <p
              className={`${revealBase} ${revealClass} text-cream/90 delay-[450ms]`}
            >
              É comunhão que fortalece.
              <br />
              Casas que se abrem.
              <br />
              Pessoas que oram.
              <br />
              E uma igreja que se move para alcançar outras pessoas.
            </p>

            <p
              className={`${revealBase} ${revealClass} max-w-[34rem] text-[clamp(1.35rem,1.8vw,1.8rem)] font-medium leading-snug text-cream delay-[600ms]`}
            >
              O que recebemos de Deus não termina em nós.
            </p>
          </div>
        </article>

        {/* FOGO */}
        <div className="relative flex h-[20rem] w-full items-center justify-center sm:h-[28rem] lg:h-[75svh] lg:min-h-[36rem] lg:max-h-[52rem]">
          {/* transição no mobile */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black to-transparent lg:hidden" />

          {/* transição suave entre as duas colunas */}
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 hidden w-20 bg-gradient-to-r from-black to-transparent lg:block" />

          <FireSphere
            className="
              pointer-events-none
              absolute
              left-1/2
              top-[1%]
              h-[76rem]
              w-[76rem]
              max-w-none
              -translate-x-1/2
              -translate-y-1/2
              scale-[2.15]
              opacity-70

              sm:h-[44rem]
              sm:w-[44rem]
              sm:scale-[1.7]

              lg:top-1/2
              lg:h-[clamp(40rem,50vw,54rem)]
              lg:w-[clamp(40rem,50vw,54rem)]
              lg:scale-100
            "
            bloomStrength={0}
            bloomRadius={0}
            bloomThreshold={0}
            color0={[255, 122, 67]}
            color1={[255, 122, 67]}
            maxPixelRatio={1}
            segments={28}
            animate
          />
        </div>
      </div>
    </section>
  )
}

export default FireSphereSection
