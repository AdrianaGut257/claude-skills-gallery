import { useState } from 'react'
import { Badge } from '../ds/components.jsx'
import { auditTheme } from '../ds/contrast.js'
import { Icon } from '../ds/icons.jsx'
import { PRIMITIVES, PRIMITIVE_LIST, SEMANTIC } from '../ds/tokens.js'
import { PAGES, href } from './pages.js'

// Flor de tokens: doce pétalos, uno por cada paso de lila y rosa.
const PETALS = [300, 400, 500, 600, 700, 800].flatMap((step, i) => [
  { name: `lila-${step}`, hex: PRIMITIVES.lila[step] },
  { name: `rosa-${[200, 300, 400, 500, 600, 700][i]}`, hex: PRIMITIVES.rosa[[200, 300, 400, 500, 600, 700][i]] },
])

function TokenFlower() {
  const [active, setActive] = useState(null)
  const shown = active ?? { name: 'Pasa el cursor por un pétalo', hex: '' }

  return (
    <figure className="pd-flower">
      <svg viewBox="-170 -170 340 340" role="group" aria-label="Paleta de Pétalo en forma de flor">
        <g className="pd-flower-spin">
          {PETALS.map((p, i) => (
            <path
              key={p.name}
              d="M0 -18 C-36 -52 -32 -122 0 -152 C32 -122 36 -52 0 -18Z"
              fill={p.hex}
              transform={`rotate(${i * 30})`}
              className={active?.name === p.name ? 'is-active' : ''}
              tabIndex={0}
              role="img"
              aria-label={`${p.name}, ${p.hex}`}
              onMouseEnter={() => setActive(p)}
              onFocus={() => setActive(p)}
              onMouseLeave={() => setActive(null)}
              onBlur={() => setActive(null)}
            />
          ))}
        </g>
        <circle r="30" className="pd-flower-core" />
      </svg>
      <figcaption aria-live="polite">
        {active && <span className="pd-flower-dot" style={{ background: shown.hex }} />}
        <code>{shown.name}</code>
        {shown.hex && <span className="pd-muted">{shown.hex}</span>}
      </figcaption>
    </figure>
  )
}

const PRINCIPLES = [
  {
    icon: 'layers',
    title: 'Una decisión, un sitio',
    text: 'Cada color vive en un solo archivo. Los componentes leen tokens con nombre de uso, así que cambiar de tema no toca ningún componente.',
  },
  {
    icon: 'shield',
    title: 'Accesible por defecto',
    text: 'Cada par de texto y fondo se audita con la fórmula de WCAG. Ningún token de texto se publica por debajo de AA.',
  },
  {
    icon: 'filter',
    title: 'Pocas opciones, bien elegidas',
    text: 'Button tiene tres variantes y ninguna prop de color. Menos decisiones al construir, menos tonos de rosa inventados.',
  },
]

export default function Home() {
  const light = auditTheme('light')
  const dark = auditTheme('dark')
  const passing = (a) => a.filter((r) => r.pass).length

  return (
    <div className="pd-home">
      <section className="pd-hero">
        <div className="pd-hero-text">
          <Badge tone="accent">Sistema de diseño · v1.0</Badge>
          <h1 className="pd-display">
            Pétalo<span className="pd-dot">.</span>
          </h1>
          <p className="pd-hero-sub">Tokens, componentes y contraste comprobado para interfaces amables.</p>
          <p className="pd-lead">
            Construye interfaces accesibles en modo claro y oscuro sin elegir colores a ojo. Cada color tiene un nombre,
            un uso y una relación de contraste medida.
          </p>
          <div className="pd-hero-actions">
            <a className="pt-btn pt-btn-primary" href={href('empezar')}>
              Empezar <Icon name="arrowRight" size={18} />
            </a>
            <a className="pt-btn pt-btn-secondary" href={href('componentes')}>
              Ver componentes
            </a>
          </div>
        </div>
        <TokenFlower />
      </section>

      <dl className="pd-stats">
        <div>
          <dt>Tokens de color</dt>
          <dd>{PRIMITIVE_LIST.length + SEMANTIC.length}</dd>
        </div>
        <div>
          <dt>Componentes</dt>
          <dd>5</dd>
        </div>
        <div>
          <dt>Pares AA · claro</dt>
          <dd>
            {passing(light)}/{light.length}
          </dd>
        </div>
        <div>
          <dt>Pares AA · oscuro</dt>
          <dd>
            {passing(dark)}/{dark.length}
          </dd>
        </div>
      </dl>

      <section className="pd-section">
        <h2>Para quién es</h2>
        <p>
          Pétalo es para diseñadoras y desarrolladores frontend que construyen interfaces con React y CSS. Esta
          documentación explica cómo usar sus tokens y componentes en código. No cubre la librería de Figma.
        </p>
      </section>

      <section className="pd-section">
        <h2>Principios</h2>
        <ul className="pd-principles">
          {PRINCIPLES.map((p) => (
            <li key={p.title}>
              <span className="pd-principle-icon">
                <Icon name={p.icon} size={20} />
              </span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="pd-section">
        <h2>Mapa de la documentación</h2>
        <ul className="pd-map">
          {PAGES.slice(1).map((p) => (
            <li key={p.slug}>
              <a className="pd-map-link" href={href(p.slug)}>
                <span className="pd-map-icon">
                  <Icon name={p.icon} size={18} />
                </span>
                <span>
                  <strong>{p.title}</strong>
                  <span className="pd-muted">{p.desc}</span>
                </span>
                <Icon name="arrowRight" size={16} className="pd-map-arrow" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
