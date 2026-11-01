import { useId, useState } from 'react'
import { Badge, Button, Notice } from '../ds/components.jsx'
import { auditTheme, contrast, normalizeHex, suggest } from '../ds/contrast.js'
import { Icon } from '../ds/icons.jsx'
import { PRIMITIVE_LIST, SEMANTIC, resolve } from '../ds/tokens.js'
import { formatRatio } from './pages.js'
import { CodeBlock, PageHeader } from './ui.jsx'

const nameOf = (hex, theme) =>
  SEMANTIC.find((s) => resolve(s.token, theme) === hex)?.token ?? PRIMITIVE_LIST.find((p) => p.hex === hex)?.name

function ColorInput({ label, value, onChange, theme }) {
  const id = useId()
  const [draft, setDraft] = useState(value)
  const [lastValue, setLastValue] = useState(value)
  // Si el color cambia desde fuera (intercambiar, sugerencia), el borrador se actualiza.
  if (value !== lastValue) {
    setLastValue(value)
    setDraft(value)
  }

  return (
    <div className="pd-color">
      <label htmlFor={id}>{label}</label>
      <div className="pd-color-row">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          aria-label={`${label}: selector de color`}
        />
        <input
          id={id}
          className="pd-color-hex"
          value={draft}
          spellCheck={false}
          maxLength={7}
          onChange={(e) => {
            setDraft(e.target.value)
            const hex = normalizeHex(e.target.value)
            if (hex) onChange(hex)
          }}
          onBlur={() => setDraft(value)}
        />
      </div>
      <select
        className="pd-color-select"
        value=""
        onChange={(e) => e.target.value && onChange(e.target.value)}
        aria-label={`${label}: elegir un token`}
      >
        <option value="">{nameOf(value, theme) ?? 'Elegir un token…'}</option>
        <optgroup label="Semánticos (tema activo)">
          {SEMANTIC.map((s) => (
            <option key={s.token} value={resolve(s.token, theme)}>
              {s.token}
            </option>
          ))}
        </optgroup>
        <optgroup label="Primitivos">
          {PRIMITIVE_LIST.map((p) => (
            <option key={p.name} value={p.hex}>
              {p.name}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  )
}

function Level({ ok, label }) {
  return (
    <li className={ok ? 'is-ok' : 'is-bad'}>
      <Icon name={ok ? 'success' : 'danger'} size={16} />
      <span>{label}</span>
      <strong>{ok ? 'Cumple' : 'No cumple'}</strong>
    </li>
  )
}

function Checker({ theme }) {
  const [fg, setFg] = useState('#FF5FA2')
  const [bg, setBg] = useState('#FFFFFF')
  const r = contrast(fg, bg)
  const tip = suggest(fg, bg)

  return (
    <div className="pd-checker">
      <div className="pd-checker-inputs">
        <ColorInput label="Texto" value={fg} onChange={setFg} theme={theme} />
        <button
          type="button"
          className="pd-swap"
          onClick={() => {
            setFg(bg)
            setBg(fg)
          }}
          aria-label="Intercambiar texto y fondo"
        >
          <Icon name="swap" size={18} />
        </button>
        <ColorInput label="Fondo" value={bg} onChange={setBg} theme={theme} />
      </div>

      <div className="pd-checker-result">
        <div className="pd-checker-sample" style={{ background: bg, color: fg }}>
          <span className="pd-checker-aa">Aa</span>
          <p>Así se lee un párrafo con este par de colores en tamaño normal.</p>
        </div>
        <div className="pd-checker-score">
          <p className="pd-checker-ratio">{formatRatio(r.ratio)}</p>
          <ul className="pd-levels">
            <Level ok={r.aa} label="AA · texto normal" />
            <Level ok={r.aaLarge} label="AA · texto grande" />
            <Level ok={r.aaa} label="AAA · texto normal" />
            <Level ok={r.aaaLarge} label="AAA · texto grande" />
          </ul>
        </div>
      </div>

      {tip && (
        <Notice tone="warning" title="No cumple AA para texto normal">
          <p>
            El color de la paleta más parecido que cumple es <code>{tip.name}</code> ({tip.hex}), con{' '}
            {formatRatio(tip.ratio)}.
          </p>
          <Button size="sm" variant="secondary" onClick={() => setFg(tip.hex)}>
            Usar {tip.name}
          </Button>
        </Notice>
      )}
    </div>
  )
}

function Audit({ theme: activeTheme }) {
  const [theme, setTheme] = useState(activeTheme)
  const rows = auditTheme(theme)
  const passing = rows.filter((r) => r.pass).length

  return (
    <div className="pd-audit">
      <div className="pd-audit-head">
        <div className="pd-segmented" role="group" aria-label="Tema auditado">
          {[
            ['light', 'Claro'],
            ['dark', 'Oscuro'],
          ].map(([key, label]) => (
            <button key={key} type="button" aria-pressed={theme === key} onClick={() => setTheme(key)}>
              {label}
            </button>
          ))}
        </div>
        <Badge tone={passing === rows.length ? 'success' : 'danger'}>
          {passing} de {rows.length} pares cumplen
        </Badge>
      </div>
      <div className="pd-table-wrap">
        <table className="pd-table">
          <thead>
            <tr>
              <th scope="col">Texto</th>
              <th scope="col">Fondo</th>
              <th scope="col">Muestra</th>
              <th scope="col">Relación</th>
              <th scope="col">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.token}-${r.pair}`}>
                <td>
                  <code>{r.token}</code>
                </td>
                <td>
                  <code>{r.pair}</code>
                </td>
                <td>
                  <span className="pd-audit-sample" style={{ background: r.bg, color: r.fg }}>
                    Aa
                  </span>
                </td>
                <td className="pd-mono">{formatRatio(r.ratio)}</td>
                <td>
                  <Badge tone={r.pass ? 'success' : 'danger'}>
                    {r.pass ? (r.large ? 'AA grande' : 'AA') : 'No cumple'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const API = `import { contrast } from './ds/contrast.js'

contrast('#7A4BDB', '#FFFFFF')
// { ratio: 5.44, aa: true, aaLarge: true, aaa: false, aaaLarge: true }`

export default function Contrast({ theme }) {
  return (
    <article className="pd-prose">
      <PageHeader eyebrow="Herramienta" title="Comprobador de contraste">
        Comprueba si un texto se lee bien sobre un fondo. Usa la fórmula de WCAG 2.2, la misma que audita los temas de
        Pétalo.
      </PageHeader>

      <h2>Comprobar un par de colores</h2>
      <p>
        Elige un color de texto y uno de fondo. Puedes escribir el valor hexadecimal, usar el selector o elegir un
        token. Si el par no cumple, la herramienta te sugiere el color de la paleta más parecido que sí cumple.
      </p>
      <Checker theme={theme} />

      <h2>Auditoría de los temas</h2>
      <p>
        Cada token de texto se comprueba contra los fondos sobre los que se usa. Los tokens marcados como «grande»
        solo necesitan cumplir AA para texto de 24 px o más.
      </p>
      <Audit key={theme} theme={theme} />
      <p>
        Antes de publicar la versión 1.0, esta auditoría detectó que <code>verde-600</code>, <code>ambar-600</code> y{' '}
        <code>rojo-600</code> no llegaban a 4,5:1 sobre sus fondos. Los tres se oscurecieron hasta cumplir.
      </p>

      <h2>Usar la función en código</h2>
      <p>
        La función <code>contrast</code> recibe un color de texto y uno de fondo y devuelve la relación y los niveles
        que cumple:
      </p>
      <CodeBlock code={API} lang="js" />
    </article>
  )
}
