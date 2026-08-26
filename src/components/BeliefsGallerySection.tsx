import { useEffect, useRef, useState } from 'react'
import { Parallax, ParallaxItem, PrallaxContainer } from './ui/parallax'
import media1 from '../assets/firemidia/1.webp'
import media2 from '../assets/firemidia/2.webp'
import media3 from '../assets/firemidia/3.webp'
import media4 from '../assets/firemidia/4.webp'
import media5 from '../assets/firemidia/5.webp'
import media6 from '../assets/firemidia/6.webp'
import media7 from '../assets/firemidia/7.webp'
import media8 from '../assets/firemidia/8.webp'
import media9 from '../assets/firemidia/9.webp'
import media10 from '../assets/firemidia/10.webp'
import media12 from '../assets/firemidia/12.webp'
import media13 from '../assets/firemidia/13.webp'
import media14 from '../assets/firemidia/14.webp'
import media15 from '../assets/firemidia/15.webp'
import media16 from '../assets/firemidia/16.webp'
import video1 from '../assets/firemidia/video1.webm'
import video2 from '../assets/firemidia/video2.webm'
import video3 from '../assets/firemidia/video3.webm'

const parallaxMedia = [
  { src: media1, type: 'image' },
  { src: media2, type: 'image' },
  { src: video1, type: 'video' },
  { src: media3, type: 'image' },
  { src: media4, type: 'image' },
  { src: media5, type: 'image' },
  { src: video2, type: 'video' },
  { src: media6, type: 'image' },
  { src: media7, type: 'image' },
  { src: media8, type: 'image' },
  { src: media9, type: 'image' },
  { src: video3, type: 'video' },
  { src: media10, type: 'image' },
  { src: media12, type: 'image' },
  { src: media13, type: 'image' },
  { src: media14, type: 'image' },
  { src: media15, type: 'image' },
  { src: media16, type: 'image' },
]

const parallaxStarts = [220, 520, 780, 440, 700, 320]
const parallaxEnds = [-220, 20, 60, -80, 100, -140]

type BeliefsGallerySectionProps = {
  isIntroFinished: boolean
}

function BeliefsGallerySection({ isIntroFinished }: BeliefsGallerySectionProps) {
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

  const showDefinition = isIntroFinished && progress < 0.995

  return (
    <>
      <div
        className={`pointer-events-none fixed inset-0 z-[60] flex items-center justify-center px-6 transition-opacity duration-300 ${
          showDefinition ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="flex w-[min(92vw,70rem)] flex-col items-center justify-center text-center">
          <h2 className="m-0 max-w-[65.625rem] font-sans text-[clamp(3rem,4.5vw,4.75rem)] font-extrabold leading-[0.93] tracking-[-0.055em] text-[#17110f]">
            NÃO É SÓ SOBRE O QUE
            <br />
            ACREDITAMOS
          </h2>

          <p className="mt-7 max-w-[58.75rem] font-sans text-[clamp(1rem,1.2vw,1.25rem)] font-normal leading-normal tracking-[-0.015em] text-[#17110f]">
            É sobre como vivemos. Caminhamos juntos, compartilhando a vida,
            crescendo em comunhão e criando espaço para que ninguém precise
            caminhar sozinho.
          </p>
        </div>
      </div>

      <section ref={sectionRef} className="relative bg-fire">
        <Parallax className="overflow-hidden bg-transparent text-charcoal">
          <PrallaxContainer className="relative flex flex-wrap justify-between gap-x-4 gap-y-48 pb-[40vh] md:gap-x-6 md:gap-y-64">
            {parallaxMedia.map((media, index) => (
              <ParallaxItem
                key={media.src}
                className="group relative z-[70] h-[24rem] w-11/12 overflow-hidden border border-charcoal/20 bg-charcoal/15 md:h-[26rem] md:w-[30%]"
                start={parallaxStarts[index % parallaxStarts.length] ?? 220}
                end={parallaxEnds[index % parallaxEnds.length] ?? -220}
              >
                {media.type === 'video' ? (
                  <video
                    className="size-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    src={media.src}
                    aria-hidden="true"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <img
                    className="size-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    src={media.src}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                  />
                )}
              </ParallaxItem>
            ))}
          </PrallaxContainer>
        </Parallax>
      </section>
    </>
  )
}

export default BeliefsGallerySection
