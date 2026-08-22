import heroBackground from './assets/hero.png'
import fireIcon from './assets/iconfire.png'
import './App.css'

function App() {
  return (
    <main>
      <section
        className="hero"
        aria-labelledby="hero-title"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="hero__content">
          <p className="hero__eyebrow">MOVIMENTO</p>

          <h1 id="hero-title" className="hero__title" aria-label="FIRE">
            <span className="hero__letters" aria-hidden="true">
              <span className="hero__letter hero__letter--f">F</span>
              <span className="hero__letter hero__letter--i">I</span>
              <img
                className="hero__fire"
                src={fireIcon}
                width="1254"
                height="1254"
                alt=""
              />
              <span className="hero__letter hero__letter--r">R</span>
              <span className="hero__letter hero__letter--e">E</span>
            </span>
          </h1>
        </div>
      </section>
    </main>
  )
}

export default App
