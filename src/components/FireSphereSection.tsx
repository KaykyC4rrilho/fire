import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { FireSphere } from './ui/fire-sphere'
import { Parallax, ParallaxItem, PrallaxContainer } from './ui/parallax'

const revealBase =
  'transition-all duration-1000 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100'

const parallaxPhotos = [
  'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?q=80&w=1593&auto=format&fit=crop&ixlib=rb-4.1.0',
  'https://images.unsplash.com/photo-1666053691228-5f2c957b1755?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0',
  'https://images.unsplash.com/photo-1705693346612-bbc9f38f1621?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0',
  'https://images.unsplash.com/photo-1534270804882-6b5048b1c1fc?q=80&w=706&auto=format&fit=crop&ixlib=rb-4.1.0',
  'https://images.unsplash.com/photo-1643451481461-f73ff49a3f93?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0',
]

function FireSphereSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const parallaxSectionRef = useRef<HTMLElement | null>(null)

  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [parallaxProgress, setParallaxProgress] = useState(0)
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
      {
        threshold: 0.05,
      },
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

      const scrollableDistance = Math.max(
        rect.height - viewportHeight,
        1,
      )

      const progress = Math.min(
        Math.max(-rect.top / scrollableDistance, 0),
        1,
      )

      setScrollProgress(progress)
      setIsMobileViewport(window.innerWidth < 640)
    }

    const onScroll = () => {
      window.cancelAnimationFrame(raf)
      raf = window.requestAnimationFrame(updateScrollProgress)
    }

    updateScrollProgress()

    window.addEventListener('scroll', onScroll, {
      passive: true,
    })

    window.addEventListener('resize', onScroll)

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    let raf = 0

    const updateParallaxProgress = () => {
      if (!parallaxSectionRef.current) return

      const rect =
        parallaxSectionRef.current.getBoundingClientRect()

      const viewportHeight = window.innerHeight || 1

      const scrollableDistance = Math.max(
        rect.height - viewportHeight,
        1,
      )

      const progress = Math.min(
        Math.max(-rect.top / scrollableDistance, 0),
        1,
      )

      setParallaxProgress(progress)
    }

    const onScroll = () => {
      window.cancelAnimationFrame(raf)

      raf = window.requestAnimationFrame(
        updateParallaxProgress,
      )
    }

    updateParallaxProgress()

    window.addEventListener('scroll', onScroll, {
      passive: true,
    })

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

  const clampProgress = (value: number) =>
    Math.min(Math.max(value, 0), 1)



  const mobileGrowProgress = clampProgress(
    (scrollProgress - 0.9) / 0.1,
  )

  const tabletGrowProgress = clampProgress(
    (scrollProgress - 0.24) / 0.76,
  )

  const desktopGrowProgress = clampProgress(
    (scrollProgress - 0.1) / 0.78,
  )

  const desktopFillProgress = clampProgress(
    (scrollProgress - 0.42) / 0.44,
  )

  const mobileFillProgress = clampProgress(
    (scrollProgress - 0.91) / 0.08,
  )

  const fireFillProgress = isMobileViewport
    ? mobileFillProgress
    : desktopFillProgress

  const finalCoverProgress = clampProgress(
    (scrollProgress - (isMobileViewport ? 0.985 : 0.92)) /
      (isMobileViewport ? 0.015 : 0.08),
  )

  const fireScaleStyle = {
    '--fire-scale-mobile':
      2.15 + mobileGrowProgress * 8,

    '--fire-scale-tablet':
      1.7 + tabletGrowProgress * 5,

    '--fire-scale-desktop':
      1 + desktopGrowProgress * 5.4,

    '--fire-opacity':
      0.7 + fireFillProgress * 0.3,

    '--fire-final-cover':
      finalCoverProgress,

    '--fire-cover-radius': isMobileViewport
      ? `${18 + mobileGrowProgress * 145}vmax`
      : `${14 + desktopGrowProgress * 125}vmax`,

    '--fire-cover-x':
      isMobileViewport ? '50vw' : '73vw',

    '--fire-cover-y':
      isMobileViewport ? '78vh' : '50vh',

    '--fire-cover-opacity':
      fireFillProgress,
  } as CSSProperties

  const fireFinished =
    finalCoverProgress >= 0.999

  const showDefinition =
    fireFinished && parallaxProgress < 0.995

  return (
    <>
      {}

      <section
        ref={sectionRef}
        className="
          relative
          isolate
          h-[360svh]
          overflow-clip
          bg-black
          text-cream

          sm:h-[260svh]
          lg:h-[220svh]
        "
        aria-labelledby="intro-title"
      >
        <div
          className="
            sticky
            top-0
            flex
            min-h-[100svh]
            items-center
            overflow-hidden
            px-6
            py-16

            sm:px-10

            lg:px-16
            lg:py-20
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              inset-[-2px]
              z-40
              bg-fire
              opacity-[var(--fire-cover-opacity)]
            "
            style={{
              ...fireScaleStyle,
              clipPath:
                'circle(var(--fire-cover-radius) at var(--fire-cover-x) var(--fire-cover-y))',
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-[-2px]
              z-50
              bg-fire
              opacity-[var(--fire-final-cover)]
            "
            style={fireScaleStyle}
          />

          <div
            className="
              relative
              z-10
              mx-auto
              grid
              w-full
              max-w-[90rem]
              grid-cols-1
              items-center
              gap-12

              lg:grid-cols-2
              lg:gap-8
            "
          >
            <article
              className="
                relative
                z-20
                flex
                w-full
                flex-col
                justify-center

                lg:pr-10
                xl:pr-16
              "
            >
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

              <div
                className="
                  mt-10
                  flex
                  max-w-[38rem]
                  flex-col
                  gap-7
                  font-sans
                  text-lg
                  font-light
                  leading-relaxed
                  text-rose-beige

                  sm:text-xl

                  lg:text-[clamp(1.05rem,1.25vw,1.35rem)]
                "
              >
                <p
                  className={`${revealBase} ${revealClass} delay-300`}
                >
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
              className="
                relative
                flex
                h-[20rem]
                w-full
                items-center
                justify-center

                sm:h-[28rem]

                lg:h-[75svh]
                lg:min-h-[36rem]
                lg:max-h-[52rem]
              "
              style={fireScaleStyle}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black to-transparent lg:hidden" />

              <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 hidden w-20 bg-gradient-to-r from-black to-transparent lg:block" />

              <FireSphere
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-[1%]
                  z-30
                  h-[76rem]
                  w-[76rem]
                  max-w-none
                  -translate-x-1/2
                  -translate-y-1/2
                  scale-[var(--fire-scale-mobile)]
                  opacity-[var(--fire-opacity)]

                  sm:h-[44rem]
                  sm:w-[44rem]
                  sm:scale-[var(--fire-scale-tablet)]

                  lg:top-1/2
                  lg:h-[clamp(40rem,50vw,54rem)]
                  lg:w-[clamp(40rem,50vw,54rem)]
                  lg:scale-[var(--fire-scale-desktop)]
                "
                style={fireScaleStyle}
                bloomStrength={0}
                bloomRadius={0}
                bloomThreshold={0}
                color0={[255, 122, 67]}
                color1={[255, 122, 67]}
                fillProgress={fireFillProgress}
                canvasFillProgress={fireFillProgress}
                maxPixelRatio={1.35}
                antialias
                segments={48}
                animate
              />
            </div>
          </div>
        </div>
      </section>

      {}

      <div
        className={`
          pointer-events-none
          fixed
          inset-0
          z-[60]

          flex
          items-center
          justify-center

          px-6

          transition-opacity
          duration-300

          ${
            showDefinition
              ? 'visible opacity-100'
              : 'invisible opacity-0'
          }
        `}
      >
        <div
          style={{
            width: 'min(92vw, 1120px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              margin: 0,
              maxWidth: '1050px',
              fontFamily: 'inherit',
              fontSize: 'clamp(3rem, 4.5vw, 4.75rem)',
              fontWeight: 800,
              lineHeight: 0.93,
              letterSpacing: '-0.055em',
              color: '#17110f',
              textAlign: 'center',
            }}
          >
            NÃO É SÓ SOBRE O QUE
            <br />
            ACREDITAMOS
          </h2>

          <p
            style={{
              margin: '28px 0 0',
              maxWidth: '940px',
              fontFamily: 'inherit',
              fontSize: 'clamp(1rem, 1.2vw, 1.25rem)',
              fontWeight: 400,
              lineHeight: 1.5,
              letterSpacing: '-0.015em',
              color: '#17110f',
              textAlign: 'center',
            }}
          >
        É sobre como vivemos. Caminhamos juntos, compartilhando a vida, crescendo em comunhão e criando espaço para que ninguém precise caminhar sozinho.
          </p>
        </div>
      </div>

      {}

      <section
        ref={parallaxSectionRef}
        className="relative bg-fire"
      >
        <Parallax
          className="
            overflow-hidden
            bg-transparent
            text-charcoal
          "
        >
          <PrallaxContainer
            className="
              relative
              flex
              flex-wrap
              justify-between
              gap-4
              pb-[40vh]
            "
          >
            {parallaxPhotos.map((src, index) => (
              <ParallaxItem
                key={src}
                className="
                  group
                  relative
                  z-[70]

                  h-[24rem]
                  w-11/12

                  overflow-hidden
                  border
                  border-charcoal/20
                  bg-charcoal/15

                  md:h-[26rem]
                  md:w-[30%]
                "
                start={[220, 520, 780, 440, 700][index]}
                end={[-220, 20, 60, -80, 100][index]}
              >
                <img
                  className="
                    size-full
                    object-cover
                    object-center
                    grayscale
                    contrast-125
                    mix-blend-multiply

                    transition-transform
                    duration-700

                    group-hover:scale-105
                  "
                  src={src}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-fire/72 mix-blend-color" />
                <div className="absolute inset-0 bg-charcoal/20" />
              </ParallaxItem>
            ))}
          </PrallaxContainer>
        </Parallax>
      </section>
    </>
  )
}

export default FireSphereSection
