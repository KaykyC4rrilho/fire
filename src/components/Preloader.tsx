import preloaderVideo from '../assets/preloader.webm'
import { Typewriter } from './ui/typewriter'

const PRELOADER_MESSAGES = ['Você foi comissionado(a).', 'O fogo continua em você.']

function Preloader() {
  return (
    <section
      className="relative isolate grid min-h-[100svh] w-full place-items-center overflow-hidden bg-charcoal text-cream"
      aria-label="Carregando Movimento Fire"
    >
      <video
        className="absolute inset-0 -z-20 size-full object-cover"
        src={preloaderVideo}
        autoPlay
        muted
        playsInline
        loop
        aria-hidden="true"
      />
      <div className="flex w-[min(90vw,72rem)] flex-col items-center justify-center text-center">
        <div
          className="bg-gradient-to-t from-fire via-burnt-gold to-cream bg-clip-text font-sans text-[clamp(3.8rem,9vw,9rem)] font-extralight leading-[0.96] tracking-[-0.07em] text-transparent [filter:drop-shadow(0_0_0.8rem_rgba(255,122,67,0.38))_drop-shadow(0_0_2.8rem_rgba(216,140,82,0.2))]"
          style={{ animation: 'preloaderFlameText 1.7s ease-in-out infinite alternate' }}
        >
          <Typewriter
            words={PRELOADER_MESSAGES}
            speed={68}
            delayBetweenWords={700}
            fadeDuration={300}
            loop={false}
            cursor
            cursorChar="|"
          />
        </div>
      </div>
    </section>
  )
}

export default Preloader
