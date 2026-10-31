import { Fragment, useEffect, useRef, useState } from 'react'
import './dayflow.css'

/* ---------- Datos ---------- */

// Ruido que se disuelve en la sección "El problema". x/y en px desde el centro, r en grados.
const NOISE = [
  { text: '37 correos sin leer', x: -170, y: -200, r: -6, c: '#D9644A' },
  { text: 'Reunión 10:30 (movida a las 11)', x: 120, y: -235, r: 4, c: '#6B8BD6' },
  { text: '@lucía te ha mencionado', x: 175, y: -140, r: 7, c: '#9A7FD1' },
  { text: 'Pestaña 14 de 23', x: -190, y: -95, r: -3, c: '#E0B341' },
  { text: 'Factura pendiente', x: 190, y: -20, r: -5, c: '#D9644A' },
  { text: 'notas_ideas_v3_FINAL', x: -185, y: 30, r: 5, c: '#E0B341' },
  { text: 'Slack · 12 nuevos', x: 170, y: 110, r: 3, c: '#9A7FD1' },
  { text: 'Revisar la presentación (¡urgente!)', x: -100, y: 215, r: -4, c: '#D9644A' },
  { text: 'Llamar al banco', x: 150, y: 220, r: 6, c: '#6B8BD6' },
  { text: '¿Comprar regalo?', x: -20, y: -150, r: -8, c: '#E0B341' },
  { text: 'Renovar el DNI', x: -170, y: 140, r: 4, c: '#6B8BD6' },
]

// Las tres tareas que quedan. fy = posición final dentro del panel "Hoy".
const KEEP = [
  { text: 'Entregar la propuesta', x: -40, y: -60, r: -9, fy: -45 },
  { text: 'Revisar el presupuesto', x: 70, y: 50, r: 8, fy: 12 },
  { text: 'Paseo sin móvil', x: -60, y: 160, r: -5, fy: 69 },
]

const ORGANIZE = [
  {
    title: 'Hoy',
    items: [
      { t: 'Entregar la propuesta', tag: 'Prioridad alta' },
      { t: 'Revisar el presupuesto', tag: 'Media' },
      { t: 'Paseo sin móvil', tag: 'Para ti' },
    ],
  },
  {
    title: 'Mañana',
    items: [
      { t: 'Preparar la reunión del jueves', tag: 'Media' },
      { t: 'Llamar a la gestoría', tag: 'Nueva' },
    ],
  },
]

const PLAN = [
  { time: '09:00', t: 'Entregar la propuesta', d: '2 h', h: 2 },
  { time: '11:00', t: 'Correo y mensajes', d: '30 min', h: 0.5 },
  { time: '12:00', t: 'Revisar el presupuesto', d: '1 h', h: 1 },
]

const STEPS = [
  { t: 'Vacía tu cabeza.', d: 'Escribe todo lo que tienes pendiente, sin ordenarlo.' },
  { t: 'Elige lo que importa hoy.', d: 'Quédate con lo esencial. El resto espera su turno.' },
  { t: 'Trabaja con calma.', d: 'Una tarea a la vez, sin distracciones.' },
]

const PROMISES = [
  'Sin configuraciones eternas',
  'Exporta tus datos cuando quieras',
  'Cancela cuando quieras',
]

/* ---------- Utilidades ---------- */

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function scrollToId(id) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })
}

// Escribe el progreso del scroll (0 → 1) de una sección alta en la variable CSS --p.
function useScrollProgress(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const update = () => {
      frame = 0
      if (mq.matches) {
        el.style.setProperty('--p', '1')
        return
      }
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1
      el.style.setProperty('--p', p.toFixed(4))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    mq.addEventListener('change', update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      mq.removeEventListener('change', update)
    }
  }, [ref])
}

// Añade .is-in a los elementos [data-reveal] cuando entran en pantalla.
function useReveal(ref) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const items = root.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ref])
}

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

/* ---------- Piezas pequeñas ---------- */

function Mark() {
  return (
    <svg className="df-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 16.5h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6.5 16.5a5.5 5.5 0 0 1 11 0" className="df-mark-sun" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="df-check-icon" aria-hidden="true">
      <path
        d="M3.5 8.5l3 3 6-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Words({ text, start }) {
  return text.split(' ').map((word, i) => (
    <Fragment key={word + i}>
      <span className="df-word" style={{ '--i': start + i }}>
        {word}
      </span>{' '}
    </Fragment>
  ))
}

function TodayCard() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Entregar la propuesta', time: '09:00', done: false },
    { id: 2, text: 'Revisar el presupuesto', time: '12:00', done: true },
    { id: 3, text: 'Paseo sin móvil', time: '18:30', done: false },
  ])
  const done = tasks.filter((t) => t.done).length
  const toggle = (id) =>
    setTasks((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  return (
    <div className="df-app">
      <div className="df-app-head">
        <span className="df-app-title">Hoy</span>
        <span className="df-app-meta" aria-live="polite">
          {done} de {tasks.length} hechas
        </span>
      </div>
      <ul className="df-task-list">
        {tasks.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              className={`df-task df-task--btn${t.done ? ' is-done' : ''}`}
              aria-pressed={t.done}
              onClick={() => toggle(t.id)}
            >
              <span className="df-check">{t.done && <CheckIcon />}</span>
              <span className="df-task-text">{t.text}</span>
              <span className="df-tag">{t.time}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="df-app-foot">Lo demás puede esperar. Pruébalo: marca una tarea.</p>
    </div>
  )
}

function FocusTimer() {
  const [seconds, setSeconds] = useState(18 * 60 + 42)
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s <= 0 ? 25 * 60 : s - 1)), 1000)
    return () => clearInterval(id)
  }, [])
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return (
    <span className="df-timer">
      {mm}:{ss}
    </span>
  )
}

/* ---------- Página ---------- */

export default function DayflowLanding() {
  const rootRef = useRef(null)
  const problemRef = useRef(null)
  const toastTimer = useRef(0)
  const [toast, setToast] = useState(false)
  const scrolled = useScrolled()

  useReveal(rootRef)
  useScrollProgress(problemRef)
  useEffect(() => () => clearTimeout(toastTimer.current), [])

  // No hay registro real: avisamos de que es una demo (estado visible del sistema).
  const start = () => {
    setToast(true)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(false), 3200)
  }

  return (
    <div className="df" ref={rootRef}>
      <header className={`df-nav${scrolled ? ' is-scrolled' : ''}`}>
        <button
          type="button"
          className="df-logo"
          aria-label="DAYFLOW, volver arriba"
          onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' })}
        >
          <Mark />
          <span>dayflow</span>
        </button>
        <nav className="df-nav-links" aria-label="Principal">
          <button type="button" className="df-navlink" onClick={() => scrollToId('df-como')}>
            Cómo funciona
          </button>
          <button type="button" className="df-btn df-btn--sm" onClick={start}>
            Empieza ahora
          </button>
        </nav>
      </header>

      <main>
        {/* 1 · HERO */}
        <section className="df-hero df-wrap" aria-labelledby="df-hero-title">
          <div className="df-sun" aria-hidden="true" />
          <p className="df-eyebrow df-fade" style={{ '--d': '100ms' }}>
            Make space for what matters.
          </p>
          <h1 id="df-hero-title" className="df-hero-title">
            <span className="df-line">
              <Words text="Haz espacio" start={0} />
            </span>
            <span className="df-line df-line--indent">
              <Words text="para lo que" start={2} />
            </span>
            <span className="df-line">
              <em>
                <Words text="importa." start={5} />
              </em>
            </span>
          </h1>

          <div className="df-hero-foot">
            <div className="df-hero-copy df-fade" style={{ '--d': '750ms' }}>
              <p className="df-hero-sub">
                Organiza tus tareas, protege tu tiempo y trabaja con calma. Todo en una sola app
                que no se interpone en tu camino.
              </p>
              <div className="df-actions">
                <button type="button" className="df-btn" onClick={start}>
                  Empieza ahora <span className="df-arrow" aria-hidden="true">→</span>
                </button>
                <button type="button" className="df-link" onClick={() => scrollToId('df-como')}>
                  Ver cómo funciona
                </button>
              </div>
              <p className="df-micro">Lista en 2 minutos. Sin tarjeta.</p>
            </div>
            <div className="df-hero-visual df-fade" style={{ '--d': '1000ms' }}>
              <TodayCard />
            </div>
          </div>
        </section>

        {/* 2 · EL PROBLEMA (momento firma: el ruido se disuelve con el scroll) */}
        <section className="df-problem" ref={problemRef} aria-labelledby="df-problem-title">
          <div className="df-problem-sticky">
            <div className="df-problem-text">
              <p className="df-kicker">El problema</p>
              <h2 id="df-problem-title" className="df-h2">
                Tu día no necesita más apps. <em>Necesita menos ruido.</em>
              </h2>
              <div className="df-problem-lines">
                <p className="df-l1">
                  Tareas en notas. Recordatorios en el móvil. Reuniones en el calendario. Todo está
                  en algún sitio, y nada está a la vista.
                </p>
                <p className="df-l2">
                  Así que acabas el día con la cabeza llena y la sensación de no haber avanzado en
                  lo importante.
                </p>
                <p className="df-l3">Organizarte no debería ser otro trabajo más.</p>
              </div>
            </div>

            <div className="df-stage" aria-hidden="true">
              <div className="df-stage-count">
                <span className="df-count-a">Todo pide tu atención</span>
                <span className="df-count-b">Solo lo que importa</span>
              </div>
              <div className="df-stage-panel">
                <div className="df-app-head">
                  <span className="df-app-title">Hoy</span>
                  <span className="df-app-meta">3 tareas</span>
                </div>
                <p className="df-app-foot">Lo demás puede esperar.</p>
              </div>
              {NOISE.map((n) => (
                <span
                  key={n.text}
                  className="df-chip df-chip--noise"
                  style={{ '--x': n.x, '--y': n.y, '--r': n.r, '--c': n.c }}
                >
                  <span className="df-dot" />
                  {n.text}
                </span>
              ))}
              {KEEP.map((k) => (
                <span
                  key={k.text}
                  className="df-chip df-chip--keep"
                  style={{ '--x': k.x, '--y': k.y, '--r': k.r, '--fy': k.fy }}
                >
                  <span className="df-check" />
                  {k.text}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 3 · LA SOLUCIÓN */}
        <section className="df-section df-wrap" aria-labelledby="df-sol-title">
          <div data-reveal>
            <p className="df-kicker">La solución</p>
            <h2 id="df-sol-title" className="df-h2">
              Todo lo que necesitas. <em>Nada que te sobre.</em>
            </h2>
          </div>

          <div className="df-bento">
            <article className="df-feature df-feature--a" data-reveal>
              <p className="df-feature-label">
                <span>01</span> Organiza
              </p>
              <h3>Todo en un solo lugar.</h3>
              <p className="df-feature-text">
                Escribe lo que tienes en mente. DAYFLOW lo ordena por día y prioridad para que no
                tengas que recordarlo.
              </p>
              <div className="df-mock" aria-hidden="true">
                <div className="df-input">
                  <span>Llamar a la gestoría el lunes</span>
                  <span className="df-caret" />
                </div>
                {ORGANIZE.map((g) => (
                  <div className="df-group" key={g.title}>
                    <p className="df-group-title">
                      {g.title} <span>{g.items.length}</span>
                    </p>
                    {g.items.map((it) => (
                      <div className="df-task" key={it.t}>
                        <span className="df-check" />
                        <span className="df-task-text">{it.t}</span>
                        <span className="df-tag">{it.tag}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </article>

            <article className="df-feature df-feature--b" data-reveal style={{ '--d': '120ms' }}>
              <p className="df-feature-label">
                <span>02</span> Planifica
              </p>
              <h3>Un día realista, no una lista infinita.</h3>
              <p className="df-feature-text">
                Dale un hueco a cada tarea y comprueba de un vistazo si tu día cabe en tu día.
              </p>
              <div className="df-mock" aria-hidden="true">
                <div className="df-plan">
                  {PLAN.map((b) => (
                    <div className="df-plan-row" key={b.t}>
                      <span className="df-plan-time">{b.time}</span>
                      <div className="df-plan-block" style={{ '--h': b.h }}>
                        <strong>{b.t}</strong>
                        <span>{b.d}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="df-capacity">
                  <div className="df-capacity-top">
                    <span>Tu día</span>
                    <span>3 h 30 min de 7 h</span>
                  </div>
                  <div className="df-bar">
                    <span />
                  </div>
                  <p>Cabe, y te sobra tiempo.</p>
                </div>
              </div>
            </article>

            <article className="df-feature df-feature--c" data-reveal>
              <div className="df-feature-copy">
                <p className="df-feature-label">
                  <span>03</span> Enfócate
                </p>
                <h3>Una cosa a la vez.</h3>
                <p className="df-feature-text">
                  El modo Enfoque oculta todo lo demás hasta que terminas lo que tienes delante.
                </p>
              </div>
              <div className="df-focus" aria-hidden="true">
                <p className="df-focus-label">
                  <span className="df-pulse" /> Ahora
                </p>
                <p className="df-focus-task">Entregar la propuesta</p>
                <FocusTimer />
                <p className="df-focus-foot">Lo demás, en pausa.</p>
              </div>
            </article>
          </div>
        </section>

        {/* 4 · CÓMO FUNCIONA */}
        <section className="df-section df-wrap df-how" id="df-como" aria-labelledby="df-how-title">
          <div data-reveal>
            <p className="df-kicker">Cómo funciona</p>
            <h2 id="df-how-title" className="df-h2">
              Empezar es <em>sencillo.</em>
            </h2>
          </div>

          <ol className="df-steps">
            {STEPS.map((s, i) => (
              <li className="df-step" key={s.t} data-reveal style={{ '--d': `${i * 120}ms` }}>
                <span className="df-step-num" aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>

          <ul className="df-promises" data-reveal>
            {PROMISES.map((p) => (
              <li key={p}>
                <CheckIcon />
                {p}
              </li>
            ))}
          </ul>

          <div className="df-proof" data-reveal>
            <p className="df-kicker">Lo que dicen quienes ya lo usan</p>
            <div className="df-proof-grid">
              {[1, 2].map((n) => (
                <figure className="df-quote-slot" key={n}>
                  <p>Testimonio pendiente</p>
                  <figcaption>
                    Aquí irá la cita de un usuario real, con nombre, rol y foto.
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* 5 · CIERRE */}
        <section className="df-end" aria-labelledby="df-end-title">
          <div className="df-wrap">
            <h2 id="df-end-title" className="df-end-title" data-reveal>
              Mañana puede ser un día <em>más tranquilo.</em>
            </h2>
            <div className="df-end-grid">
              <div className="df-end-copy" data-reveal style={{ '--d': '120ms' }}>
                <p>
                  Imagina cerrar el portátil sabiendo que hiciste lo que importaba, y que lo demás
                  está en su sitio.
                </p>
                <p>O puedes seguir una semana más apagando fuegos. Tú eliges.</p>
              </div>
              <div className="df-end-actions" data-reveal style={{ '--d': '240ms' }}>
                <button type="button" className="df-btn df-btn--light" onClick={start}>
                  Empieza ahora <span className="df-arrow" aria-hidden="true">→</span>
                </button>
                <p className="df-micro">Lista en 2 minutos. Sin tarjeta.</p>
              </div>
            </div>

            <footer className="df-footer">
              <span className="df-footer-logo">
                <Mark /> dayflow
              </span>
              <span>© 2026 DAYFLOW · Proyecto de prueba de la Skills Gallery</span>
            </footer>
          </div>
        </section>
      </main>

      <div className={`df-toast${toast ? ' is-visible' : ''}`} role="status" aria-live="polite">
        {toast ? 'Esto es una demo: aquí empezaría el registro.' : ''}
      </div>
    </div>
  )
}
