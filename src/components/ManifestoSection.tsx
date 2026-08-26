import { useEffect, useRef, useState } from 'react'
import { FireSphere } from './ui/fire-sphere'

const exitConsumeOrigin: [number, number] = [0.02, 0.98]

function ManifestoSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0

    const updateProgress = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const scrollableDistance = Math.max(rect.height - viewportHeight, 1)

      setProgress(Math.min(Math.max(-rect.top / scrollableDistance, 0), 1))
    }

    const onScroll = () => {
      window.cancelAnimationFrame(raf)
      raf = window.requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const showManifesto = progress >= 0.985

  return (
    <section
      ref={sectionRef}
      className="relative h-[150svh] bg-black sm:h-[170svh]"
      aria-labelledby="manifesto-title"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-fire">
        <FireSphere
          className="pointer-events-none absolute inset-0 size-full"
          bloomStrength={0}
          bloomRadius={0}
          bloomThreshold={0}
          color0={[0, 0, 0]}
          color1={[0, 0, 0]}
          fillProgress={0}
          canvasFillProgress={0}
          consumeProgress={progress}
          consumeOrigin={exitConsumeOrigin}
          showSphere={false}
          maxPixelRatio={1.35}
          antialias
          segments={48}
          animate
        />

        <div
          className={`relative z-10 mx-auto flex h-full w-full max-w-[90rem] items-center justify-center px-6 py-8 transition-all duration-700 ease-out sm:px-10 sm:py-10 lg:px-16 ${
            showManifesto
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          }`}
        >
          <article className="relative isolate w-full max-w-[86rem]">
            <div
              className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[min(90vw,72rem)] -translate-x-1/2 rounded-full bg-fire/10 blur-[120px]"
              aria-hidden="true"
            />

            <div className="mb-6 flex w-full items-center gap-3" aria-hidden="true">
              <span className="size-1.5 rotate-45 bg-fire" />
              <span className="h-px flex-1 bg-gradient-to-r from-fire/70 via-fire/20 to-transparent" />
            </div>

            <h2
              id="manifesto-title"
              className="w-full font-sans text-[clamp(3.5rem,7vw,7.75rem)] font-extrabold uppercase leading-[0.78] tracking-[-0.07em] text-cream"
            >
              <span className="block text-left">O FOGO NÃO</span>
              <span className="mt-[0.14em] block text-right text-fire [text-shadow:0_0_3rem_rgba(255,122,67,0.2)]">
                PARA AQUI
              </span>
            </h2>

            <div className="mt-10 grid gap-8 text-left md:grid-cols-[minmax(0,0.8fr)_1px_minmax(0,1.2fr)] md:gap-10 lg:mt-12 lg:gap-14">
              <div>
                <p className="font-sans text-[clamp(1.6rem,2.4vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.04em] text-cream">
                  Você também faz parte dessa missão.
                </p>
                <p className="mt-6 font-sans text-base font-light leading-relaxed text-rose-beige sm:text-lg">
                  Fire não é algo para assistir de longe. É um chamado para
                  pessoas disponíveis.
                </p>
              </div>

              <div className="hidden h-full bg-fire/25 md:block" aria-hidden="true" />

              <div className="grid gap-8 font-sans text-base font-light leading-relaxed text-rose-beige sm:grid-cols-2 sm:text-lg">
                <p className="border-l border-fire/40 pl-5 text-cream/90">
                  Servir.
                  <br />
                  Amar.
                  <br />
                  Abrir a casa.
                  <br />
                  Caminhar junto.
                  <br />
                  Anunciar Jesus.
                </p>

                <div className="flex flex-col justify-between gap-6">
                  <p>Você conheceu o movimento.</p>
                  <p className="text-xl font-semibold leading-snug tracking-[-0.025em] text-cream sm:text-2xl">
                    Agora, pode fazer parte dele.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default ManifestoSection
