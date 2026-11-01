import { useState } from 'react'
import { Icon } from '../ds/icons.jsx'
import { PAGES, href } from './pages.js'

// Piezas compartidas por las páginas de la documentación.

export function PageHeader({ eyebrow, title, children }) {
  return (
    <header className="pd-page-head">
      <p className="pd-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children && <p className="pd-lead">{children}</p>}
    </header>
  )
}

// Resaltado mínimo de sintaxis: comentarios, cadenas, etiquetas, palabras clave,
// variables CSS y marcadores en MAYÚSCULAS que la persona debe sustituir.
const TOKEN_RE =
  /(?<com>\/\/.*|\/\*[\s\S]*?\*\/|\{\/\*[\s\S]*?\*\/\})|(?<str>'[^']*'|"[^"]*"|`[^`]*`)|(?<tag><\/?[A-Za-z][\w.]*|\/?>)|(?<kw>\b(?:import|from|export|default|function|return|const)\b)|(?<cssvar>--[\w-]+)|(?<ph>\b[A-Z][A-Z0-9]*_[A-Z0-9_]+\b)/g

function highlight(code) {
  const out = []
  let last = 0
  for (const m of code.matchAll(TOKEN_RE)) {
    if (m.index > last) out.push(code.slice(last, m.index))
    const kind = Object.keys(m.groups).find((k) => m.groups[k] !== undefined)
    // Un marcador entre comillas ("VARIANT") se resalta como marcador, no como cadena.
    const inner = m[0].slice(1, -1)
    if (kind === 'str' && /^[A-Z][A-Z0-9_]+$/.test(inner)) {
      out.push(
        m[0][0],
        <span key={m.index} className="pd-c-ph">
          {inner}
        </span>,
        m[0].at(-1),
      )
      last = m.index + m[0].length
      continue
    }
    out.push(
      <span key={m.index} className={`pd-c-${kind}`}>
        {m[0]}
      </span>,
    )
    last = m.index + m[0].length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}

export function CodeBlock({ code, lang = 'jsx' }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Sin permiso para el portapapeles: no pasa nada, el código sigue visible.
    }
  }
  return (
    <div className="pd-code">
      <div className="pd-code-bar">
        <span>{lang}</span>
        <button type="button" onClick={copy} aria-label={copied ? 'Copiado' : 'Copiar código'}>
          <Icon name={copied ? 'check' : 'copy'} size={15} />
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <pre>
        <code>{highlight(code)}</code>
      </pre>
    </div>
  )
}

// Tabla de referencia de props. rows: [[prop, tipo, porDefecto, descripción]]
export function PropsTable({ rows }) {
  return (
    <div className="pd-table-wrap">
      <table className="pd-table">
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Tipo</th>
            <th scope="col">Por defecto</th>
            <th scope="col">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([prop, type, def, desc]) => (
            <tr key={prop}>
              <td>
                <code>{prop}</code>
              </td>
              <td className="pd-mono pd-muted">{type}</td>
              <td className="pd-mono pd-muted">{def}</td>
              <td>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Enlaces a la página anterior y la siguiente.
export function Pager({ slug }) {
  const i = PAGES.findIndex((p) => p.slug === slug)
  const prev = PAGES[i - 1]
  const next = PAGES[i + 1]
  return (
    <nav className="pd-pager" aria-label="Páginas">
      {prev ? (
        <a href={href(prev.slug)} className="pd-pager-link">
          <span>Anterior</span>
          <strong>{prev.title}</strong>
        </a>
      ) : (
        <span />
      )}
      {next && (
        <a href={href(next.slug)} className="pd-pager-link is-next">
          <span>Siguiente</span>
          <strong>
            {next.title} <Icon name="arrowRight" size={16} />
          </strong>
        </a>
      )}
    </nav>
  )
}

// Nota de diseño: por qué un componente o un token es como es.
export function DesignNote({ children }) {
  return (
    <aside className="pd-note">
      <p className="pd-note-title">Por qué así</p>
      <div>{children}</div>
    </aside>
  )
}
