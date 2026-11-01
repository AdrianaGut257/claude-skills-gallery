import { useState } from 'react'
import CupCanvas from './CupCanvas.jsx'
import { HOURS, TIMEZONE, formatHour } from './data.js'
import { Icon, LumbreMark } from './icons.jsx'
import Menu from './Menu.jsx'
import './lumbre.css'

const DRINK_CHOICES = [
  { id: 'espresso', label: 'Espresso' },
  { id: 'capuchino', label: 'Capuchino' },
  { id: 'mocha', label: 'Mocha' },
]

function Header() {
  return (
    <header className="lb-header">
      <a className="lb-logo" href="#/lumbre">
        <LumbreMark size={30} />
        <span>Lumbre</span>
      </a>
      <nav aria-label="Secciones">
        <a href="#/lumbre" onClick={(e) => jumpTo(e, 'menu')}>
          Carta
        </a>
        <a href="#/lumbre" onClick={(e) => jumpTo(e, 'visita')}>
          Horario
        </a>
        <a href="#/lumbre" onClick={(e) => jumpTo(e, 'marca')}>
          Marca
        </a>
      </nav>
    </header>
  )
}

// La galería usa el hash para las rutas, así que los anclajes se hacen con scroll.
function jumpTo(e, id) {
  e.preventDefault()
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

function Hero() {
  const [drink, setDrink] = useState('capuchino')

  return (
    <>
      <section className="lb-hero" aria-labelledby="lb-hero-title">
        <div className="lb-hero-text">
          <p className="lb-eyebrow lb-rise" style={{ '--d': 0 }}>
            <Icon name="flame" size={16} /> Tostadores en Cochabamba
          </p>
          <h1 id="lb-hero-title" className="lb-display lb-rise" style={{ '--d': 1 }}>
            Café de altura, tostado al calor de <em>la lumbre.</em>
          </h1>
          <p className="lb-lead lb-rise" style={{ '--d': 2 }}>
            Granos de los Yungas tostados cada lunes en pequeñas tandas. Se toma aquí, sin prisa, o se pide por
            WhatsApp y se recoge caliente.
          </p>
          <div className="lb-hero-actions lb-rise" style={{ '--d': 3 }}>
            <a className="lb-btn lb-btn-primary" href="#/lumbre" onClick={(e) => jumpTo(e, 'menu')}>
              Ver la carta
              <Icon name="arrowDown" size={18} />
            </a>
            <a className="lb-btn lb-btn-ghost" href="#/lumbre" onClick={(e) => jumpTo(e, 'visita')}>
              <Icon name="clock" size={18} />
              Horario
            </a>
          </div>
        </div>

        <div className="lb-hero-stage">
          <CupCanvas drink={drink} />
          <div className="lb-stage-ui">
            <div className="lb-drinks" role="group" aria-label="Bebida de la taza">
              {DRINK_CHOICES.map((d) => (
                <button key={d.id} type="button" aria-pressed={drink === d.id} onClick={() => setDrink(d.id)}>
                  {d.label}
                </button>
              ))}
            </div>
            <p className="lb-hint">
              <Icon name="drag" size={16} /> Arrastra para girar la taza
            </p>
          </div>
        </div>
      </section>

      <Menu onPickDrink={setDrink} />
    </>
  )
}

function House() {
  const facts = [
    { icon: 'mountain', k: '1.600 m', v: 'Altura media de las fincas de los Yungas que tostamos' },
    { icon: 'calendar', k: 'Cada lunes', v: 'Tostamos en tandas de 5 kilos para que nada espere en la estantería' },
    { icon: 'flame', k: '12 minutos', v: 'Lo que dura un tueste medio: dulce, redondo y sin amargor' },
  ]
  return (
    <section className="lb-house" aria-labelledby="lb-house-title">
      <div className="lb-wrap lb-house-grid">
        <div>
          <p className="lb-eyebrow">La casa</p>
          <h2 id="lb-house-title" className="lb-h2">
            Una barra, ocho mesas y el tostador a la vista.
          </h2>
        </div>
        <ul className="lb-facts">
          {facts.map((f) => (
            <li key={f.k}>
              <Icon name={f.icon} size={22} />
              <strong>{f.k}</strong>
              <span>{f.v}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// Hora actual en Bolivia: día de la semana y hora decimal.
function nowInBolivia(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (t) => parts.find((p) => p.type === t)?.value
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  return { day, hour: Number(get('hour')) + Number(get('minute')) / 60 }
}

function Visit() {
  const [now] = useState(() => nowInBolivia(new Date()))
  const today = HOURS.find((h) => h.day === now.day)
  const open = today && now.hour >= today.open && now.hour < today.close
  const status = open
    ? `Abierto ahora · cierra a las ${formatHour(today.close)}`
    : today && now.hour < today.open
      ? `Cerrado · abre hoy a las ${formatHour(today.open)}`
      : 'Cerrado · abre mañana'

  return (
    <section id="visita" className="lb-visit" aria-labelledby="lb-visit-title">
      <div className="lb-wrap lb-visit-grid">
        <div>
          <p className="lb-eyebrow">Ven a vernos</p>
          <h2 id="lb-visit-title" className="lb-h2">
            Abrimos temprano, cerramos con la última taza.
          </h2>
          <p className={`lb-status${open ? ' is-open' : ''}`}>
            <span className="lb-status-dot" aria-hidden="true" />
            {status}
          </p>
          <p className="lb-address">
            <Icon name="pin" size={18} />
            Cochabamba, Bolivia
          </p>
        </div>
        <table className="lb-hours">
          <caption className="lb-sr">Horario de apertura (hora de Bolivia)</caption>
          <tbody>
            {HOURS.map((h) => (
              <tr key={h.day} className={h.day === now.day ? 'is-today' : ''}>
                <th scope="row">
                  {h.label}
                  {h.day === now.day && <span className="lb-today">Hoy</span>}
                </th>
                <td>
                  {formatHour(h.open)} – {formatHour(h.close)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

const PALETTE = [
  { name: 'Brasa', hex: '#FFB347', ink: '#1A110C' },
  { name: 'Crema', hex: '#FFF1DC', ink: '#1A110C' },
  { name: 'Tueste', hex: '#7A3E2B', ink: '#FFF1DC' },
  { name: 'Espresso', hex: '#1A110C', ink: '#FFF1DC' },
]

function Brand() {
  return (
    <section id="marca" className="lb-brand" aria-labelledby="lb-brand-title">
      <div className="lb-wrap">
        <header className="lb-section-head">
          <p className="lb-eyebrow">Identidad</p>
          <h2 id="lb-brand-title" className="lb-h2">
            Una llama que también es un grano de café.
          </h2>
        </header>

        <div className="lb-brand-grid">
          <figure className="lb-brand-logo">
            <LumbreMark size={120} />
            <figcaption>
              <span className="lb-brand-word">Lumbre</span>
              <span>café de altura</span>
            </figcaption>
          </figure>

          <ul className="lb-palette" aria-label="Paleta de color">
            {PALETTE.map((c) => (
              <li key={c.name} style={{ background: c.hex, color: c.ink }}>
                <strong>{c.name}</strong>
                <span>{c.hex}</span>
              </li>
            ))}
          </ul>

          <div className="lb-type">
            <p className="lb-type-display">Aa</p>
            <div>
              <p>
                <strong>Gloock</strong> para titulares: un serif de alto contraste con calidez de rótulo antiguo.
              </p>
              <p>
                <strong>Albert Sans</strong> para el texto y los precios, con cifras tabulares.
              </p>
            </div>
          </div>
        </div>

        <h3 className="lb-h3">Plantillas para redes</h3>
        <ul className="lb-posts">
          <li className="lb-post lb-post-1">
            <span className="lb-post-kicker">Nuevo tueste</span>
            <strong>Caranavi</strong>
            <span>Panela · naranja · cacao</span>
            <LumbreMark size={28} />
          </li>
          <li className="lb-post lb-post-2">
            <span className="lb-post-kicker">Esta semana</span>
            <strong>Cuñapé y cortado</strong>
            <span className="lb-post-price">Bs 17</span>
            <LumbreMark size={28} />
          </li>
          <li className="lb-post lb-post-3">
            <strong>El café se toma despacio.</strong>
            <span>— la casa</span>
            <LumbreMark size={28} />
          </li>
        </ul>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="lb-footer">
      <div className="lb-wrap lb-footer-grid">
        <a className="lb-logo" href="#/lumbre">
          <LumbreMark size={26} />
          <span>Lumbre</span>
        </a>
        <p>Café Lumbre es una marca de demostración creada para este portafolio.</p>
      </div>
    </footer>
  )
}

export default function Lumbre() {
  return (
    <div className="lb">
      <Header />
      <main>
        <Hero />
        <House />
        <Visit />
        <Brand />
      </main>
      <Footer />
    </div>
  )
}
