import { type CSSProperties, useEffect, useRef, useState } from 'react'
import BeliefsGallerySection from './BeliefsGallerySection'
import CommissionSection from './CommissionSection'
import Footer from './Footer'
import ManifestoSection from './ManifestoSection'
import { FireSphere } from './ui/fire-sphere'

const revealBase =
  'transition-all duration-1000 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100'

const clampProgress = (value: number) => Math.min(Math.max(value, 0), 1)

function FireSphereSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobileViewport, setIsMobileViewport] = useState(false)

  useEffect(() => {
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.05 },
    )

    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let raf = 0

    const updateScrollProgress = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const scrollableDistance = Math.max(rect.height - viewportHeight, 1)
      const progress = Math.min(Math.max(-rect.top / scrollableDistance, 0), 1)

      setScrollProgress(progress)
      setIsMobileViewport(window.innerWidth < 640)
    }

    const onScroll = () => {
      window.cancelAnimationFrame(raf)
      raf = window.requestAnimationFrame(updateScrollProgress)
    }

    updateScrollProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const revealClass = isVisible
    ? 'translate-y-0 opacity-100'
    : 'translate-y-8 opacity-0'

  const fireConsumeProgress = clampProgress(
    (scrollProgress - (isMobileViewport ? 0.05 : 0.12)) /
      (isMobileViewport ? 0.9 : 0.8),
  )
  const sphereFadeProgress = clampProgress(
    (fireConsumeProgress - 0.015) / 0.12,
  )
  const contentFadeProgress = clampProgress(
    (fireConsumeProgress - 0.14) / 0.18,
  )

  const fireTransitionStyle = {
    '--fire-opacity': 0.82 + fireConsumeProgress * 0.18,
  } as CSSProperties

  const originalSphereStyle = {
    '--fire-scale-mobile': 2.15,
    '--fire-scale-tablet': 1.7,
    '--fire-scale-desktop': 1,
    '--fire-opacity': 0.7 * (1 - sphereFadeProgress),
  } as CSSProperties

  const contentFadeStyle = {
    opacity: 1 - contentFadeProgress,
  } as CSSProperties

  const fireFinished = fireConsumeProgress >= 0.999

  return (
    <>
      <section
        ref={sectionRef}
        className="relative isolate h-[240svh] overflow-clip bg-black text-cream sm:h-[260svh] lg:h-[220svh]"
        aria-labelledby="intro-title"
      >
        <div className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
          <FireSphere
            className="pointer-events-none absolute inset-0 z-30 size-full opacity-[var(--fire-opacity)]"
            style={fireTransitionStyle}
            bloomStrength={0}
            bloomRadius={0}
            bloomThreshold={0}
            color0={[255, 122, 67]}
            color1={[255, 122, 67]}
            fillProgress={0}
            canvasFillProgress={0}
            consumeProgress={fireConsumeProgress}
            showSphere={false}
            maxPixelRatio={1.35}
            antialias
            segments={48}
            animate
          />

          <div
            className="relative z-10 mx-auto grid w-full max-w-[90rem] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8"
            style={contentFadeStyle}
          >
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
                  Fire é sobre pessoas que entendem que a fé não termina em um
                  culto, em um evento ou dentro de quatro paredes.
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

            <div
              className="relative flex h-[20rem] w-full items-center justify-center sm:h-[28rem] lg:h-[75svh] lg:min-h-[36rem] lg:max-h-[52rem]"
              style={originalSphereStyle}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black to-transparent lg:hidden" />
              <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 hidden w-20 bg-gradient-to-r from-black to-transparent lg:block" />

              <FireSphere
                className="pointer-events-none absolute left-1/2 top-[1%] z-30 h-[76rem] w-[76rem] max-w-none -translate-x-1/2 -translate-y-1/2 scale-[var(--fire-scale-mobile)] opacity-[var(--fire-opacity)] sm:h-[44rem] sm:w-[44rem] sm:scale-[var(--fire-scale-tablet)] lg:top-1/2 lg:h-[clamp(40rem,50vw,54rem)] lg:w-[clamp(40rem,50vw,54rem)] lg:scale-[var(--fire-scale-desktop)]"
                style={originalSphereStyle}
                bloomStrength={0}
                bloomRadius={0}
                bloomThreshold={0}
                color0={[255, 122, 67]}
                color1={[255, 122, 67]}
                fillProgress={0}
                canvasFillProgress={0}
                consumeProgress={0}
                maxPixelRatio={1.35}
                antialias
                segments={48}
                animate
              />
            </div>
          </div>
        </div>
      </section>

      <BeliefsGallerySection isIntroFinished={fireFinished} />
      <ManifestoSection />
      <CommissionSection />
      <Footer />
    </>
  )
}

export default FireSphereSection
