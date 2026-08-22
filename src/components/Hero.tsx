import heroBackground from '../assets/hero.png'
import fireArtwork from '../assets/FIRE.svg'

const MOVEMENT_LETTERS = 'MOVIMENTO'.split('')

function Hero() {
  return (
    <section
      className="relative isolate grid min-h-[100svh] w-full place-items-center overflow-hidden bg-charcoal bg-cover bg-center bg-no-repeat max-[48rem]:bg-center"
      aria-labelledby="hero-title"
      style={{ backgroundImage: `url(${heroBackground})` }}
    >
      <div className="flex w-[min(92vw,52rem)] [--fire-artwork-width:clamp(18rem,29vw,34rem)] translate-y-[clamp(1rem,3.8vh,2.75rem)] flex-col items-center justify-center pt-[clamp(2rem,5vh,4rem)] text-center text-cream max-[48rem]:w-[96vw] max-[48rem]:translate-y-0 max-[48rem]:[--fire-artwork-width:clamp(17rem,82vw,21rem)] max-[48rem]:pt-4">
        <p
          className="relative z-2 mb-[clamp(2rem,6vh,4.75rem)] flex w-[var(--fire-artwork-width)] justify-between font-sans text-[clamp(0.72rem,1.25vw,1.22rem)] font-light leading-none tracking-normal text-cream max-[48rem]:mb-[clamp(1.25rem,3vh,1.75rem)]"
          aria-label="MOVIMENTO"
        >
          {MOVEMENT_LETTERS.map((letter, index) => (
            <span key={`${letter}-${index}`} aria-hidden="true">
              {letter}
            </span>
          ))}
        </p>

        <h1
          id="hero-title"
          className="relative m-0 grid w-fit place-items-center whitespace-nowrap text-cream leading-[0.78]"
          aria-label="FIRE"
        >
          <img
            className="block h-auto w-[var(--fire-artwork-width)] max-w-[92vw] select-none"
            src={fireArtwork}
            width="1091"
            height="835"
            alt=""
            aria-hidden="true"
          />
        </h1>
      </div>

      <div
        className="pointer-events-none absolute bottom-[clamp(1.25rem,4vh,2.5rem)] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-cream/75"
        aria-hidden="true"
      >
        <span className="h-10 w-px origin-top animate-pulse bg-gradient-to-b from-cream/80 to-transparent" />
        <span className="h-3 w-3 animate-bounce rotate-45 border-b border-r border-cream/80" />
      </div>
    </section>
  )
}

export default Hero
