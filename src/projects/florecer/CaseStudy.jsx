import { Icon, Wordmark } from './icons.jsx'
import Scene from './Scene.jsx'
import { FLOWER_COLORS, firstTwoWeeks, useGarden } from './store.js'

// Una flor que espera, una regada en plena floración y un capullo.
const HERO_PLANTS = [
  { key: 'a', stage: 4, color: FLOWER_COLORS[1], waiting: true },
  { key: 'b', stage: 5, color: FLOWER_COLORS[0], fresh: true },
  { key: 'c', stage: 3, color: FLOWER_COLORS[2] },
]

// Caso de estudio: hipótesis (lean-ux), diagnóstico B=MAP (improve-retention)
// y revisión al estilo Steve Jobs (steve-jobs-design-review).

const TARGET_DAYS = 8

const ASSUMPTIONS = [
  {
    quad: 'test',
    title: 'Probar primero',
    sub: 'Riesgo alto · sabemos poco',
    items: [
      'La culpa al romper una racha es la razón principal del abandono.',
      'Una flor que espera motiva más que un número que vuelve a cero.',
    ],
  },
  {
    quad: 'watch',
    title: 'Vigilar',
    sub: 'Riesgo alto · sabemos bastante',
    items: ['Sin notificaciones, el ancla de la rutina basta para acordarse.'],
  },
  {
    quad: 'later',
    title: 'Investigar después',
    sub: 'Riesgo bajo · sabemos poco',
    items: ['Tres hábitos son suficientes para la mayoría.'],
  },
  {
    quad: 'skip',
    title: 'No probar',
    sub: 'Riesgo bajo · sabemos bastante',
    items: ['Los estudiantes usan la app en el móvil.'],
  },
]

const BMAP = [
  {
    k: 'Motivación',
    v: 'No dependemos de ella. Todo funciona el día que no te apetece: el hábito dura menos de 30 segundos.',
  },
  {
    k: 'Habilidad',
    v: 'La receta viene rellena y se planta con un toque. Regar es otro toque. El eslabón débil era el esfuerzo mental de decidir qué hacer, y lo resuelven las sugerencias.',
  },
  {
    k: 'Disparador',
    v: 'El aviso es tu propia rutina («después de servirme el café»), no una notificación. La app no te escribe nunca.',
  },
  {
    k: 'Celebración',
    v: 'Al regar, la flor crece en pantalla y te pide celebrarlo a tu manera. Eso es lo que convierte la repetición en hábito.',
  },
]

const NO_LIST = [
  'Rachas que se rompen',
  'Notificaciones',
  'Estadísticas y gráficos',
  'Categorías y etiquetas',
  'Más de tres hábitos',
  'Cuentas y registro',
  'Ajustes',
]

function ActionLine() {
  // Curva de la línea de acción: a más facilidad, menos motivación hace falta.
  return (
    <svg className="fl-bmap-chart" viewBox="0 0 320 210" role="img" aria-label="Modelo B=MAP: Florecer queda por encima de la línea de acción con motivación baja y facilidad alta">
      <line x1="40" y1="180" x2="300" y2="180" stroke="var(--fl-ink-3)" />
      <line x1="40" y1="180" x2="40" y2="16" stroke="var(--fl-ink-3)" />
      <path d="M58 22 C 90 140, 170 160, 296 166" fill="none" stroke="var(--fl-rose)" strokeWidth="3" strokeDasharray="6 6" />
      <text x="300" y="198" textAnchor="end" className="fl-axis">Fácil →</text>
      <text x="44" y="198" className="fl-axis">Difícil</text>
      <text x="14" y="100" className="fl-axis" transform="rotate(-90 14 100)" textAnchor="middle">Motivación →</text>
      <text x="70" y="30" className="fl-axis fl-axis-pink">Línea de acción</text>
      <circle cx="96" cy="160" r="7" fill="var(--fl-ink-3)" />
      <text x="96" y="146" textAnchor="middle" className="fl-axis">App típica</text>
      <circle cx="262" cy="148" r="9" fill="var(--fl-rose)" />
      <text x="262" y="130" textAnchor="middle" className="fl-axis fl-axis-strong">Florecer</text>
    </svg>
  )
}

export default function CaseStudy() {
  const { state } = useGarden()
  const { active, elapsed } = firstTwoWeeks(state)
  const started = state.startedAt !== null

  return (
    <div className="fl">
      <main className="fl-case">
        <a className="fl-text-btn fl-back" href="#/florecer">
          <Icon name="arrowLeft" size={16} /> Volver a la app
        </a>

        <header className="fl-case-hero">
          <Wordmark />
          <p className="fl-eyebrow">Caso de estudio</p>
          <h1 className="fl-display">
            Una app de hábitos que <em>no te hace sentir culpa</em>.
          </h1>
          <Scene plants={HERO_PLANTS} sky="afternoon" />
        </header>

        <section className="fl-case-sec">
          <h2 className="fl-eyebrow">El problema</h2>
          <p className="fl-case-big">
            Las apps de hábitos parecen listas de tareas frías. Mucha gente las deja en la segunda semana, justo después
            de fallar un día y ver cómo su racha vuelve a cero.
          </p>
        </section>

        <section className="fl-case-sec">
          <h2 className="fl-eyebrow">Lo único que tiene que hacer</h2>
          <blockquote className="fl-quote">
            Que cuidar un hábito pequeño se sienta bien, incluso el día que fallas.
          </blockquote>
        </section>

        <section className="fl-case-sec">
          <h2 className="fl-eyebrow">Hipótesis</h2>
          <div className="fl-panel fl-hyp">
            <p>
              <strong>Creemos que</strong> más estudiantes seguirán usando la app después de dos semanas{' '}
              <strong>si</strong>, en lugar de una racha que se rompe, ven <strong>una flor que les espera</strong> y un
              hábito tan pequeño que se puede hacer en un día malo.
            </p>
            <dl className="fl-hyp-criteria">
              <div>
                <dt>Señal</dt>
                <dd>Días con al menos un hábito cumplido en los primeros 14 días</dd>
              </div>
              <div>
                <dt>Validada si</dt>
                <dd>
                  El 60&nbsp;% de las personas de la prueba llega a {TARGET_DAYS} de 14 días
                </dd>
              </div>
              <div>
                <dt>Invalidada si</dt>
                <dd>Menos del 40&nbsp;% llega</dd>
              </div>
            </dl>
            <p className="fl-muted">
              Medimos días activos (un cambio de comportamiento), no cuántas veces se pulsa el botón.
            </p>
          </div>
        </section>

        <section className="fl-case-sec">
          <h2 className="fl-eyebrow">Supuestos</h2>
          <p className="fl-muted">Ordenados por riesgo e incertidumbre. Se prueban primero los de arriba a la izquierda.</p>
          <div className="fl-quads">
            {ASSUMPTIONS.map((a) => (
              <div key={a.quad} className={`fl-quad fl-quad-${a.quad}`}>
                <h3>{a.title}</h3>
                <span>{a.sub}</span>
                <ul>
                  {a.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="fl-case-sec">
          <h2 className="fl-eyebrow">El experimento</h2>
          <p>
            El experimento más pequeño que responde a la pregunta es esta misma app: 8 estudiantes la usan durante 14
            días en su móvil. Los datos se quedan en su navegador y cada persona nos enseña su número al final.
          </p>
          <div className="fl-panel fl-mine">
            <div>
              <span className="fl-eyebrow">Tu prueba</span>
              {started ? (
                <>
                  <p className="fl-mine-num">
                    {active}
                    <small> de 14 días</small>
                  </p>
                  <p className="fl-muted">
                    Llevas {elapsed} {elapsed === 1 ? 'día' : 'días'}. El objetivo de la hipótesis es llegar a{' '}
                    {TARGET_DAYS}.
                  </p>
                </>
              ) : (
                <p className="fl-muted">
                  Aún no has plantado nada. <a className="fl-text-btn" href="#/florecer">Planta tu primera semilla</a> y aquí
                  verás tus días activos.
                </p>
              )}
            </div>
            {started && (
              <ol className="fl-mine-days" aria-hidden="true">
                {Array.from({ length: 14 }, (_, i) => (
                  <li key={i} className={i < active ? 'is-on' : i < elapsed ? 'is-off' : ''} />
                ))}
              </ol>
            )}
          </div>
          <p className="fl-muted">Resultados de la prueba: pendientes. No los inventamos.</p>
        </section>

        <section className="fl-case-sec">
          <h2 className="fl-eyebrow">Por qué funciona · B=MAP</h2>
          <p>
            Un comportamiento ocurre cuando hay motivación, habilidad y un disparador a la vez (BJ Fogg). La motivación
            sube y baja, así que la app hace el hábito tan fácil que no la necesita.
          </p>
          <ActionLine />
          <dl className="fl-bmap">
            {BMAP.map((b) => (
              <div key={b.k}>
                <dt>{b.k}</dt>
                <dd>{b.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="fl-case-sec">
          <h2 className="fl-eyebrow">A lo que dijimos que no</h2>
          <p>Cada cosa de esta lista estaba en algún boceto. Ninguna ayudaba a lo único que la app tiene que hacer.</p>
          <ul className="fl-nolist">
            {NO_LIST.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </section>

        <footer className="fl-case-foot">
          <a className="fl-btn fl-btn-primary" href="#/florecer">
            Abrir Florecer
          </a>
        </footer>
      </main>
    </div>
  )
}
