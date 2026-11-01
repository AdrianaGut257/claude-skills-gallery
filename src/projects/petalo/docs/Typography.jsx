import { useId, useState } from 'react'
import { Badge, Button } from '../ds/components.jsx'
import { Icon } from '../ds/icons.jsx'
import { TYPE_SCALE } from '../ds/tokens.js'
import { DesignNote, PageHeader } from './ui.jsx'

const SAMPLE =
  'Los ojos no recorren una línea de forma continua: avanzan a saltos de siete a nueve caracteres y se detienen un instante en cada parada. Si la línea es demasiado larga, al volver al principio de la siguiente es fácil perderse. Si las líneas están muy juntas, el ojo salta a la que no toca. Por eso el tamaño, el interlineado y el ancho de la columna importan más que la fuente elegida.'

const LEVEL_NAMES = {
  display: 'Display',
  h1: 'Título 1',
  h2: 'Título 2',
  h3: 'Título 3',
  body: 'Cuerpo',
  small: 'Pequeño',
  code: 'Código',
}

const LEVEL_SAMPLES = {
  display: 'Pétalo',
  h1: 'Componentes',
  h2: 'Dos capas de color',
  h3: 'Antes de empezar',
  body: 'Los componentes solo leen tokens semánticos.',
  small: 'Actualizado el 1 de noviembre de 2026',
  code: "contrast('#7A4BDB', '#FFFFFF')",
}

const PETALO_DEFAULTS = { size: 16, line: 1.65, measure: 68 }

function Slider({ label, value, min, max, step, unit, onChange }) {
  const id = useId()
  return (
    <div className="pd-slider">
      <label htmlFor={id}>
        {label}
        <output htmlFor={id}>
          {String(value).replace('.', ',')}
          {unit}
        </output>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  )
}

// Probador de lectura: aplica el diagnóstico de web-typography a medida que mueves los controles.
function ReadingLab() {
  const [v, setV] = useState(PETALO_DEFAULTS)
  const set = (key) => (value) => setV((s) => ({ ...s, [key]: value }))

  const checks = [
    { ok: v.size >= 16, label: 'Cuerpo de 16 px o más' },
    { ok: v.measure >= 45 && v.measure <= 75, label: 'Entre 45 y 75 caracteres por línea' },
    { ok: v.line >= 1.4 && v.line <= 1.8, label: 'Interlineado entre 1,4 y 1,8' },
  ]
  const passed = checks.filter((c) => c.ok).length
  const verdict =
    passed === 3
      ? { tone: 'success', text: 'Lectura cómoda' }
      : passed === 2
        ? { tone: 'warning', text: 'Mejorable' }
        : { tone: 'danger', text: 'Difícil de leer' }

  return (
    <div className="pd-lab">
      <div className="pd-lab-controls">
        <Slider label="Tamaño" value={v.size} min={12} max={24} step={1} unit=" px" onChange={set('size')} />
        <Slider label="Interlineado" value={v.line} min={1} max={2.2} step={0.05} unit="" onChange={set('line')} />
        <Slider label="Ancho de línea" value={v.measure} min={25} max={110} step={1} unit=" car." onChange={set('measure')} />

        <div className="pd-lab-result">
          <div className="pd-lab-score">
            <span className="pd-lab-num">{passed}/3</span>
            <Badge tone={verdict.tone}>{verdict.text}</Badge>
          </div>
          <ul>
            {checks.map((c) => (
              <li key={c.label} className={c.ok ? 'is-ok' : 'is-bad'}>
                <Icon name={c.ok ? 'success' : 'danger'} size={16} />
                {c.label}
              </li>
            ))}
          </ul>
          <Button variant="ghost" size="sm" onClick={() => setV(PETALO_DEFAULTS)}>
            Volver a los valores de Pétalo
          </Button>
        </div>
      </div>
      <div className="pd-lab-stage">
        <p style={{ fontSize: v.size, lineHeight: v.line, maxWidth: `${v.measure}ch` }}>{SAMPLE}</p>
      </div>
    </div>
  )
}

export default function Typography() {
  return (
    <article className="pd-prose">
      <PageHeader eyebrow="Fundamentos" title="Tipografía">
        Pétalo usa una sola familia, Geist, con su versión monoespaciada para el código. Esta página explica por qué y
        lista la escala de tamaños.
      </PageHeader>

      <div className="pd-specimen">
        <div className="pd-specimen-main">
          <span className="pd-specimen-aa">Aa</span>
          <div>
            <p className="pd-specimen-name">Geist</p>
            <p className="pd-muted">Interfaz y lectura · 400, 500, 600 y 700</p>
          </div>
        </div>
        <p className="pd-specimen-glyphs">ABCDEFGHIJKLMNÑOPQRSTUVWXYZ abcdefghijklmnñopqrstuvwxyz 0123456789 ¿?¡!«»</p>
        <div className="pd-specimen-weights">
          {[400, 500, 600, 700].map((w) => (
            <span key={w} style={{ fontWeight: w }}>
              Florece {w}
            </span>
          ))}
        </div>
        <div className="pd-specimen-mono">
          <p className="pd-specimen-name">Geist Mono</p>
          <code>Il1 O0 rn m → contrast(fg, bg)</code>
        </div>
      </div>

      <h2>Por qué Geist</h2>
      <p>Geist se eligió por cómo funciona en pantalla, no por moda:</p>
      <ul>
        <li>
          <strong>Ojo medio alto y aperturas abiertas.</strong> Las letras <em>a</em>, <em>e</em> y <em>c</em> se
          distinguen bien a 14 px.
        </li>
        <li>
          <strong>Letras que no se confunden.</strong> <code>Il1</code> y <code>O0</code> son distintas, algo clave en
          tokens y valores hexadecimales.
        </li>
        <li>
          <strong>Familia con versión monoespaciada.</strong> Geist Mono comparte proporciones con Geist, así que el
          código y el texto conviven sin chocar.
        </li>
        <li>
          <strong>Fuente variable.</strong> Un solo archivo cubre todos los pesos, y se carga con{' '}
          <code>font-display: swap</code>: el texto se ve desde el primer momento.
        </li>
      </ul>
      <DesignNote>
        Una sola familia da menos combinaciones que revisar. La jerarquía sale del tamaño y del peso, no de mezclar
        fuentes. Entre dos niveles seguidos solo cambian una o dos cosas a la vez.
      </DesignNote>

      <h2>Escala</h2>
      <p>
        Los títulos usan <code>clamp()</code>: crecen con la pantalla entre un mínimo y un máximo, sin saltos. Cada
        nivel es un token, por ejemplo <code>--pt-h1-size</code>.
      </p>
      <div className="pd-scale">
        {TYPE_SCALE.map((t) => (
          <div key={t.token} className="pd-scale-row">
            <div className="pd-scale-meta">
              <strong>{LEVEL_NAMES[t.token]}</strong>
              <span className="pd-mono pd-muted">
                {t.weight} · {String(t.line).replace('.', ',')}
              </span>
              <span className="pd-muted">{t.use}</span>
            </div>
            <p
              className="pd-scale-sample"
              style={{
                fontSize: `var(--pt-${t.token}-size)`,
                lineHeight: `var(--pt-${t.token}-line)`,
                fontWeight: `var(--pt-${t.token}-weight)`,
                letterSpacing: `var(--pt-${t.token}-tracking)`,
                fontFamily: t.mono ? 'var(--pt-mono)' : undefined,
              }}
            >
              {LEVEL_SAMPLES[t.token]}
            </p>
          </div>
        ))}
      </div>

      <h2>Probar la lectura</h2>
      <p>
        Mueve los controles para ver cómo cambia el párrafo. El marcador aplica tres reglas de lectura cómoda en
        pantalla.
      </p>
      <ReadingLab />

      <h2>Reglas de uso</h2>
      <ul>
        <li>Limita los párrafos a unos 68 caracteres por línea. En esta documentación se hace con <code>max-width: 68ch</code>.</li>
        <li>No uses el token <code>text-subtle</code> para texto de menos de 24 px: solo cumple AA para texto grande.</li>
        <li>
          Equilibra los títulos con <code>text-wrap: balance</code> para que no quede una palabra sola en la última
          línea.
        </li>
        <li>Pon siempre fuentes del sistema como respaldo después de Geist.</li>
      </ul>
    </article>
  )
}
