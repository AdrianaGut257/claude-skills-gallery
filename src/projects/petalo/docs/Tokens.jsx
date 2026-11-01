import { useState } from 'react'
import { contrast } from '../ds/contrast.js'
import { Icon } from '../ds/icons.jsx'
import { PRIMITIVES, RADIUS, SEMANTIC, SPACE, primitive } from '../ds/tokens.js'
import { DesignNote, PageHeader } from './ui.jsx'

const FAMILY_NAMES = { lila: 'Lila', rosa: 'Rosa', neutro: 'Neutro', verde: 'Verde', ambar: 'Ámbar', rojo: 'Rojo' }

// Texto legible sobre una muestra: oscuro o blanco, el que más contraste dé.
const inkOn = (hex) => (contrast('#13101A', hex).ratio >= contrast('#FFFFFF', hex).ratio ? '#13101A' : '#FFFFFF')

function Swatch({ name, hex }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hex)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      // Sin portapapeles: el valor sigue visible en la muestra.
    }
  }
  return (
    <button type="button" className="pd-swatch" onClick={copy} aria-label={`${name}, ${hex}. Copiar`}>
      <span className="pd-swatch-color" style={{ background: hex, color: inkOn(hex) }}>
        {copied && <Icon name="check" size={16} strokeWidth={2.4} />}
      </span>
      <span className="pd-swatch-step">{name.split('-')[1]}</span>
      <span className="pd-swatch-hex">{hex}</span>
    </button>
  )
}

function Chip({ name }) {
  return (
    <span className="pd-chip">
      <span className="pd-chip-dot" style={{ background: primitive(name) }} />
      <code>{name}</code>
    </span>
  )
}

// Diagrama: primitivo → semántico → componente, en los dos temas.
function Layers() {
  const rows = [
    { theme: 'Claro', prim: 'lila-600' },
    { theme: 'Oscuro', prim: 'lila-300' },
  ]
  return (
    <div className="pd-layers">
      <div className="pd-layers-head">
        <span>Primitivo</span>
        <span>Semántico</span>
        <span>Componente</span>
      </div>
      {rows.map((r) => (
        <div key={r.theme} className="pd-layers-row">
          <span className="pd-layers-theme">{r.theme}</span>
          <div className="pd-layer">
            <span className="pd-layer-swatch" style={{ background: primitive(r.prim) }} />
            <code>{r.prim}</code>
          </div>
          <Icon name="arrowRight" size={18} className="pd-layers-arrow" />
          <div className="pd-layer">
            <code>--pt-accent</code>
          </div>
          <Icon name="arrowRight" size={18} className="pd-layers-arrow" />
          <div className="pd-layer pd-layer-comp">
            <span className="pd-layer-btn" style={{ background: primitive(r.prim), color: inkOn(primitive(r.prim)) }}>
              Guardar
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Tokens({ theme }) {
  return (
    <article className="pd-prose">
      <PageHeader eyebrow="Fundamentos" title="Tokens">
        Los tokens son los valores con nombre del sistema: colores, espacios y radios. Esta página explica cómo están
        organizados y los lista todos.
      </PageHeader>

      <h2>Dos capas de color</h2>
      <p>Los colores de Pétalo están en dos capas:</p>
      <dl className="pd-deflist">
        <div>
          <dt>Primitivos</dt>
          <dd>
            La paleta completa, con nombre de tono y paso, por ejemplo <code>lila-600</code>. Dicen cómo es un color,
            no para qué sirve.
          </dd>
        </div>
        <div>
          <dt>Semánticos</dt>
          <dd>
            Nombres de uso, por ejemplo <code>--pt-accent</code>. Cada tema asigna un primitivo a cada token semántico.
          </dd>
        </div>
      </dl>
      <p>Los componentes solo leen tokens semánticos. El tema decide qué primitivo hay detrás:</p>
      <Layers />
      <DesignNote>
        Si un componente usara <code>lila-600</code> directamente, el modo oscuro obligaría a editar ese componente y
        todos los demás. Con la capa semántica, la decisión «qué color es la acción principal» vive en un solo sitio:{' '}
        <code>ds/tokens.js</code>.
      </DesignNote>

      <h2>Tokens semánticos</h2>
      <p>
        La siguiente tabla lista cada token, su uso y el primitivo que tiene en cada tema. La columna del tema activo
        aparece resaltada.
      </p>
      <div className="pd-table-wrap">
        <table className="pd-table pd-table-tokens" data-active={theme}>
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Uso</th>
              <th scope="col" className="col-light">
                Claro
              </th>
              <th scope="col" className="col-dark">
                Oscuro
              </th>
            </tr>
          </thead>
          <tbody>
            {SEMANTIC.map((s) => (
              <tr key={s.token}>
                <td>
                  <code>--pt-{s.token}</code>
                </td>
                <td>{s.use}</td>
                <td className="col-light">
                  <Chip name={s.light} />
                </td>
                <td className="col-dark">
                  <Chip name={s.dark} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Paleta primitiva</h2>
      <p>Haz clic en una muestra para copiar su valor hexadecimal.</p>
      <div className="pd-palette">
        {Object.entries(PRIMITIVES).map(([family, steps]) => (
          <div key={family} className="pd-palette-row">
            <h3>{FAMILY_NAMES[family]}</h3>
            <div className="pd-swatches" style={{ '--n': Object.keys(steps).length }}>
              {Object.entries(steps).map(([step, hex]) => (
                <Swatch key={step} name={`${family}-${step}`} hex={hex} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2>Espaciado</h2>
      <p>Usa solo estos valores para márgenes, rellenos y separaciones. Cada paso es múltiplo de 4 px.</p>
      <ul className="pd-space">
        {SPACE.map((px) => (
          <li key={px}>
            <code>{px}</code>
            <span className="pd-space-bar" style={{ width: px * 3 }} />
          </li>
        ))}
      </ul>

      <h2>Radios</h2>
      <div className="pd-radii">
        {RADIUS.map((r) => (
          <figure key={r.token}>
            <span style={{ borderRadius: Math.min(r.px, 48) }} />
            <figcaption>
              <code>--pt-{r.token}</code>
              <span className="pd-muted">
                {r.px === 999 ? 'Completo' : `${r.px} px`} · {r.use}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </article>
  )
}
