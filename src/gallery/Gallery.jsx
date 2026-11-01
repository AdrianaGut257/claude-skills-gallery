import { Component, Suspense, lazy, useEffect, useState } from 'react'
import './gallery.css'

// La escena 3D (three.js + React Three Fiber) se descarga aparte, después del texto.
const LabScene = lazy(() => import('./LabScene.jsx'))

const dateFormat = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

function useReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)'
  const [reduced, setReduced] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

// Si WebGL falla, la portada sigue en pie con un dibujo de línea en lugar de la escena.
class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function MoleculeIcon(props) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" {...props}>
      <path d="M32 32 18 20M32 32l16-8M32 32l-4 18M32 32l14 14" />
      <circle cx="32" cy="32" r="7" fill="var(--bg)" />
      <circle cx="16" cy="18" r="4" fill="var(--bg)" />
      <circle cx="50" cy="23" r="4" fill="var(--bg)" />
      <circle cx="27.5" cy="52" r="4" fill="var(--bg)" />
      <circle cx="47.5" cy="47.5" r="4" fill="var(--bg)" />
    </svg>
  )
}

export default function Gallery({ projects }) {
  const skillCount = new Set(projects.flatMap((p) => p.skills)).size
  const [active, setActive] = useState(null)
  const reducedMotion = useReducedMotion()

  return (
    <div className="gl">
      <div className="gl-inner">
        <div className="gl-top">
          <span>Claude Skills Gallery</span>
          <span>Skills de wondelai, CloudAI-X y Vercel Labs</span>
        </div>

        <header className="gl-hero">
          <h1 className="gl-title">
            Laboratorio <em>de skills</em>
          </h1>

          <figure className="gl-plate">
            <div className="gl-stage">
              <span className="gl-corner" aria-hidden="true" />
              <span className="gl-corner" aria-hidden="true" />
              <span className="gl-corner" aria-hidden="true" />
              <span className="gl-corner" aria-hidden="true" />
              <SceneBoundary
                fallback={
                  <div className="gl-stage-fallback">
                    <MoleculeIcon width="96" height="96" />
                  </div>
                }
              >
                <Suspense fallback={<p className="gl-stage-loading">Preparando la lámina…</p>}>
                  <LabScene
                    projects={projects}
                    active={active}
                    onActive={setActive}
                    reducedMotion={reducedMotion}
                  />
                </Suspense>
              </SceneBoundary>
            </div>
            <figcaption className="gl-caption">
              <span className="gl-caption-fig">Fig. 1</span>
              <span className="gl-legend">
                <span>
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="6" />
                  </svg>
                  Proyecto
                </span>
                <span>
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="3.2" />
                  </svg>
                  Skill
                </span>
              </span>
              <span className="gl-caption-hint">Elige una molécula para abrir su proyecto</span>
            </figcaption>
          </figure>

          <div className="gl-aside">
            <p className="gl-intro">
              Proyectos de prueba hechos con skills de Claude. En la lámina, cada molécula es un
              proyecto y cada átomo, una de sus skills. Ninguna se repite entre proyectos.
            </p>
            <dl className="gl-stats">
              <div>
                <dt>Proyectos</dt>
                <dd>{projects.length}</dd>
              </div>
              <div>
                <dt>Skills usadas</dt>
                <dd>{skillCount}</dd>
              </div>
            </dl>
          </div>
        </header>

        <main>
          <div className="gl-section-head">
            <h2>Proyectos</h2>
            <span>{projects.length} en total</span>
          </div>

          <ul className="gl-grid">
            {projects.map((p) => (
              <li key={p.slug}>
                <a
                  className={`gl-card${active === p.slug ? ' is-linked' : ''}`}
                  href={`#/${p.slug}`}
                  onPointerEnter={() => setActive(p.slug)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(p.slug)}
                  onBlur={() => setActive(null)}
                >
                  <div
                    className="gl-preview"
                    style={{
                      '--pv-bg': p.preview.bg,
                      '--pv-fg': p.preview.fg,
                      '--pv-deco': p.preview.deco,
                      '--pv-font': p.preview.font,
                      '--pv-weight': p.preview.weight ?? 400,
                    }}
                  >
                    <span className="gl-preview-text">{p.preview.text}</span>
                  </div>
                  <div className="gl-card-body">
                    <div className="gl-meta">
                      <span>{p.number}</span>
                      <span>{p.kind}</span>
                      <time dateTime={p.date}>{dateFormat.format(new Date(p.date))}</time>
                    </div>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    <ul className="gl-tags" aria-label="Skills usadas">
                      {p.skills.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                    <span className="gl-open">
                      Abrir proyecto <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </main>

        <footer className="gl-footer">
          <span>© 2026</span>
        </footer>
      </div>
    </div>
  )
}
