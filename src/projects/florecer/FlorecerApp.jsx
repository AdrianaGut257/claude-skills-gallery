import { useCallback, useEffect, useRef, useState } from 'react'
import Flower from './Flower.jsx'
import { Icon, Wordmark } from './icons.jsx'
import RecipeForm from './RecipeForm.jsx'
import Scene from './Scene.jsx'
import {
  FLOWER_COLORS,
  MAX_HABITS,
  STAGES,
  actionIcon,
  celebrationIcon,
  dayPart,
  doneToday,
  isWaiting,
  lastWeek,
  sortByAnchor,
  stageOf,
  stageProgress,
  tint,
  toNextStage,
  useGarden,
} from './store.js'

const dayFormat = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

// Tras cumplir un hábito 7 veces, se ofrece (sin obligar) hacerlo un poco más grande.
const SCALE_AFTER = 7

// Variables de color por flor: tono, fondo suave y tono profundo (para el check).
const colorVars = (c) => ({ '--c': c, '--c-soft': tint(c, 0.86), '--c-mid': tint(c, 0.6), '--c-deep': tint(c, -0.2) })

export default function FlorecerApp() {
  const garden = useGarden()
  const { state } = garden
  const [celebrating, setCelebrating] = useState(null)
  const [editing, setEditing] = useState(null) // id del hábito, 'new' o null
  const [now] = useState(() => new Date())
  const part = dayPart(now)

  const habits = [...state.habits].sort(sortByAnchor)
  const closeCelebration = useCallback(() => setCelebrating(null), [])

  const water = (habit) => {
    garden.toggleToday(habit.id, true)
    navigator.vibrate?.(20)
    setCelebrating({ habit, before: stageOf(habit.log.length), after: stageOf(habit.log.length + 1) })
  }

  return (
    <div className="fl" data-sky={part.key}>
      {habits.length === 0 ? (
        <Welcome onPlant={garden.plant} onSample={garden.loadSample} part={part} />
      ) : (
        <Garden
          habits={habits}
          now={now}
          part={part}
          onWater={water}
          onUnwater={(h) => garden.toggleToday(h.id, false)}
          onEdit={setEditing}
          onDismissScale={(h) => garden.edit(h.id, { scaleDismissed: true })}
          onReset={garden.reset}
        />
      )}

      {celebrating && <Celebration {...celebrating} onClose={closeCelebration} />}

      {editing && (
        <EditSheet
          habit={state.habits.find((h) => h.id === editing)}
          onClose={() => setEditing(null)}
          onSave={(recipe) => {
            if (editing === 'new') garden.plant(recipe)
            else garden.edit(editing, { ...recipe, scaleDismissed: true })
            setEditing(null)
          }}
          onRemove={() => {
            garden.remove(editing)
            setEditing(null)
          }}
        />
      )}
    </div>
  )
}

/* ---------- Primera vez: plantar la primera semilla ---------- */

const DEMO_PLANTS = [
  { key: 'a', stage: 1, color: FLOWER_COLORS[1] },
  { key: 'b', stage: 4, color: FLOWER_COLORS[0], fresh: true },
  { key: 'c', stage: 3, color: FLOWER_COLORS[2] },
]

function Welcome({ onPlant, onSample, part }) {
  return (
    <main className="fl-shell fl-welcome">
      <section className="fl-welcome-intro">
        <Wordmark />
        <h1 className="fl-display">
          Cada hábito pequeño hace crecer <em>una flor</em>.
        </h1>
        <p className="fl-lead">Y si un día no puedes, no se marchita. Te espera.</p>
        <Scene plants={DEMO_PLANTS} sky={part.key} className="fl-welcome-scene" />
      </section>

      <section className="fl-panel fl-welcome-card" aria-labelledby="fl-first">
        <p className="fl-eyebrow">Paso único</p>
        <h2 id="fl-first" className="fl-h2">
          Planta tu primera semilla
        </h2>
        <RecipeForm submitLabel="Plantar semilla" onSubmit={onPlant} />
        <div className="fl-welcome-alt">
          <button type="button" className="fl-text-btn" onClick={onSample}>
            Ver un jardín de ejemplo
          </button>
          <a className="fl-text-btn" href="#/florecer/caso">
            Caso de estudio <Icon name="arrowRight" size={16} />
          </a>
        </div>
      </section>
    </main>
  )
}

/* ---------- El jardín ---------- */

function summary(habits) {
  const done = habits.filter(doneToday).length
  const waiting = habits.filter(isWaiting).length
  if (done === habits.length) return 'Todo regado por hoy. Nos vemos mañana.'
  if (waiting > 0 && done === 0)
    return waiting === 1 ? 'Una flor te espera. Sin prisa.' : `${waiting} flores te esperan. Sin prisa.`
  const left = habits.length - done
  return left === 1 ? 'Te queda una flor por regar.' : `Te quedan ${left} flores por regar.`
}

function Garden({ habits, now, part, onWater, onUnwater, onEdit, onDismissScale, onReset }) {
  const full = habits.length >= MAX_HABITS
  const done = habits.filter(doneToday).length
  const [confirmReset, setConfirmReset] = useState(false)

  const plants = habits.map((h) => {
    const stage = stageOf(h.log.length)
    return {
      key: h.id,
      stage,
      color: h.color,
      waiting: isWaiting(h),
      fresh: doneToday(h),
      title: `${STAGES[stage].name} de «${h.action}»`,
    }
  })

  return (
    <main className="fl-shell fl-garden">
      <section className="fl-garden-left">
        <header className="fl-head">
          <div className="fl-head-top">
            <Wordmark />
            <span className="fl-date">{dayFormat.format(now)}</span>
          </div>
          <h1 className="fl-display fl-hello">{part.hello}</h1>
          <p className="fl-lead" aria-live="polite">
            {summary(habits)}
          </p>
        </header>

        <figure className="fl-panel fl-bed">
          <Scene plants={plants} sky={part.key} />
          <figcaption className="fl-plots" style={{ '--n': habits.length }}>
            {habits.map((h) => {
              const count = h.log.length
              const stage = stageOf(count)
              const next = toNextStage(count)
              return (
                <div key={h.id} className="fl-plot" style={colorVars(h.color)}>
                  <strong>{STAGES[stage].name}</strong>
                  <span className="fl-meter" aria-hidden="true">
                    <span style={{ width: `${Math.max(6, stageProgress(count) * 100)}%` }} />
                  </span>
                  <span className="fl-plot-note">
                    {isWaiting(h) ? 'Te espera' : next ? `${next} para crecer` : 'En su mejor momento'}
                  </span>
                </div>
              )
            })}
          </figcaption>
        </figure>
      </section>

      <section className="fl-garden-right" aria-labelledby="fl-today">
        <div className="fl-section-head">
          <h2 id="fl-today" className="fl-h2">
            Hoy
          </h2>
          <span className="fl-count">
            {done}/{habits.length}
          </span>
        </div>

        <ul className="fl-panel fl-list">
          {habits.map((h) => (
            <HabitRow
              key={h.id}
              habit={h}
              onWater={() => onWater(h)}
              onUnwater={() => onUnwater(h)}
              onEdit={() => onEdit(h.id)}
              onDismissScale={() => onDismissScale(h)}
            />
          ))}
        </ul>

        {full ? (
          <p className="fl-full">Tu jardín está completo. Tres flores se cuidan mejor que diez.</p>
        ) : (
          <button type="button" className="fl-add" onClick={() => onEdit('new')}>
            <span className="fl-add-icon">
              <Icon name="plus" size={18} />
            </span>
            Plantar otra flor
          </button>
        )}

        <footer className="fl-foot">
          <a className="fl-text-btn" href="#/florecer/caso">
            Caso de estudio <Icon name="arrowRight" size={16} />
          </a>
          {confirmReset ? (
            <span className="fl-confirm" role="group" aria-label="Confirmar">
              ¿Borrar todas tus flores?
              <button type="button" className="fl-text-btn fl-danger" onClick={onReset}>
                Sí, borrar
              </button>
              <button type="button" className="fl-text-btn fl-quiet" onClick={() => setConfirmReset(false)}>
                No
              </button>
            </span>
          ) : (
            <button type="button" className="fl-text-btn fl-quiet" onClick={() => setConfirmReset(true)}>
              Empezar un jardín nuevo
            </button>
          )}
        </footer>
      </section>
    </main>
  )
}

function HabitRow({ habit, onWater, onUnwater, onEdit, onDismissScale }) {
  const done = doneToday(habit)
  const waiting = isWaiting(habit)
  const week = lastWeek(habit)
  const weekCount = week.filter((d) => d.done).length
  const offerScale = done && habit.log.length >= SCALE_AFTER && !habit.scaleDismissed

  return (
    <li className={`fl-row${done ? ' is-done' : ''}`} style={colorVars(habit.color)}>
      <div className="fl-row-main">
        <span className="fl-row-icon">
          <Icon name={actionIcon(habit.action)} size={22} />
        </span>

        <div className="fl-row-body">
          <span className="fl-row-anchor">Después de {habit.anchor}</span>
          <span className="fl-row-title">{habit.action}</span>
          <div className="fl-row-meta">
            <span className="fl-dots" role="img" aria-label={`${weekCount} de los últimos 7 días`}>
              {week.map((d) => (
                <span key={d.day} className={`${d.done ? 'is-on' : ''}${d.today ? ' is-today' : ''}`} />
              ))}
            </span>
            {waiting && !done && <span className="fl-row-wait">Te espera</span>}
            <button type="button" className="fl-row-edit" onClick={onEdit} aria-label={`Editar «${habit.action}»`}>
              <Icon name="edit" size={13} />
              Editar
            </button>
          </div>
        </div>

        <button
          type="button"
          className="fl-check"
          aria-pressed={done}
          onClick={done ? onUnwater : onWater}
          aria-label={done ? `«${habit.action}»: hecho hoy. Pulsa para deshacer` : `Marcar como hecho: ${habit.action}`}
        >
          <Icon name="check" size={22} strokeWidth={2.4} />
        </button>
      </div>

      {offerScale && (
        <div className="fl-scale">
          <Icon name="sprout" size={18} />
          <p>Ya te sale casi solo. Si te apetece, puedes hacerlo un poco más grande.</p>
          <div className="fl-scale-actions">
            <button type="button" className="fl-text-btn" onClick={onEdit}>
              Hacerlo más grande
            </button>
            <button type="button" className="fl-text-btn fl-quiet" onClick={onDismissScale}>
              Así está bien
            </button>
          </div>
        </div>
      )}
    </li>
  )
}

/* ---------- Celebración inmediata (sin ella, la repetición no crea hábito) ---------- */

// Pétalos que salen disparados alrededor de la flor.
const BURST = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2
  const dist = 90 + (i % 3) * 24
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist * 0.8 - 30,
    r: (i * 47) % 360,
    delay: (i % 4) * 40,
  }
})

function Celebration({ habit, before, after, onClose }) {
  const grew = after > before
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
    const timer = setTimeout(onClose, grew ? 3600 : 2600)
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
    }
  }, [grew, onClose])

  return (
    <div className="fl-cele" role="status" onClick={onClose} style={colorVars(habit.color)}>
      <div className="fl-cele-stage" aria-hidden="true">
        <span className="fl-cele-ring" />
        {BURST.map((p, i) => (
          <span
            key={i}
            className="fl-cele-petal"
            style={{ '--x': `${p.x}px`, '--y': `${p.y}px`, '--r': `${p.r}deg`, animationDelay: `${p.delay}ms` }}
          />
        ))}
        <Flower stage={after} color={habit.color} fresh className="fl-cele-flower is-growing" />
      </div>
      <p className="fl-cele-title">{grew ? 'Tu flor creció' : 'Regada'}</p>
      <p className="fl-cele-sub">{grew ? `Ahora es: ${STAGES[after].name.toLowerCase()}` : habit.action}</p>
      <p className="fl-cele-do">
        <Icon name={celebrationIcon(habit.celebration)} size={18} />
        Celébralo {habit.celebration}
      </p>
      <button ref={closeRef} type="button" className="fl-btn fl-btn-soft" onClick={onClose}>
        Seguir
      </button>
    </div>
  )
}

/* ---------- Plantar / editar (hoja inferior) ---------- */

function EditSheet({ habit, onClose, onSave, onRemove }) {
  const ref = useRef(null)
  const [confirmRemove, setConfirmRemove] = useState(false)

  useEffect(() => {
    const dialog = ref.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])

  return (
    <dialog
      ref={ref}
      className="fl fl-sheet"
      aria-labelledby="fl-sheet-title"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div className="fl-sheet-body">
        <div className="fl-sheet-head">
          <h2 id="fl-sheet-title" className="fl-h2">
            {habit ? 'Editar la receta' : 'Plantar otra flor'}
          </h2>
          <button type="button" className="fl-icon-btn" onClick={onClose} aria-label="Cerrar">
            <Icon name="x" size={20} />
          </button>
        </div>

        <RecipeForm initial={habit} submitLabel={habit ? 'Guardar' : 'Plantar semilla'} onSubmit={onSave} />

        {habit && (
          <div className="fl-sheet-danger">
            {confirmRemove ? (
              <span className="fl-confirm" role="group" aria-label="Confirmar">
                Se perderá su progreso.
                <button type="button" className="fl-text-btn fl-danger" onClick={onRemove}>
                  Arrancar
                </button>
                <button type="button" className="fl-text-btn fl-quiet" onClick={() => setConfirmRemove(false)}>
                  Cancelar
                </button>
              </span>
            ) : (
              <button type="button" className="fl-text-btn fl-danger" onClick={() => setConfirmRemove(true)}>
                Arrancar esta flor
              </button>
            )}
          </div>
        )}
      </div>
    </dialog>
  )
}
