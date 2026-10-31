import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CheckIcon, Mark } from '../icons.jsx'
import FocusMode from './FocusMode.jsx'
import { parseTask } from './parse.js'
import {
  dayOf,
  formatDuration,
  isOverdue,
  isoDay,
  sortTasks,
  useDayflowStore,
  dayToDate,
} from './store.js'
import '../dayflow.css'
import './app.css'

const DAYS = [
  { value: 'today', label: 'Hoy' },
  { value: 'tomorrow', label: 'Mañana' },
  { value: 'someday', label: 'Algún día' },
]

const PRIORITY_OPTIONS = [
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Media' },
  { value: 'baja', label: 'Baja' },
]

const DURATION_OPTIONS = [
  { value: null, label: 'Sin' },
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '1 h' },
  { value: 120, label: '2 h' },
]

const EMPTY_TEXT = {
  today: 'Nada para hoy. Escribe arriba lo que importa.',
  tomorrow: 'Nada para mañana todavía.',
  someday: 'Aquí van las ideas sin fecha.',
}

const EXAMPLES = [
  { text: 'Entregar la propuesta', day: 'today', priority: 'alta', time: '09:00', duration: 120 },
  { text: 'Correo y mensajes', day: 'today', priority: 'baja', time: '11:30', duration: 30 },
  { text: 'Revisar el presupuesto', day: 'today', priority: 'media', time: '12:00', duration: 60 },
  { text: 'Paseo sin móvil', day: 'today', priority: 'media', time: '18:30', duration: 30 },
  { text: 'Preparar la reunión del jueves', day: 'tomorrow', priority: 'media', duration: 60 },
  { text: 'Aprender a hacer pan', day: 'someday', priority: 'baja' },
]

const dayLabel = (day) => DAYS.find((d) => d.value === day)?.label ?? ''

/* ---------- Piezas pequeñas ---------- */

function Segmented({ label, options, value, onChange, size }) {
  return (
    <div className={`dfa-seg${size === 'sm' ? ' dfa-seg--sm' : ''}`} role="group" aria-label={label}>
      {options.map((o) => (
        <button
          type="button"
          key={String(o.value)}
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function QuickAdd({ onAdd, inputRef }) {
  const [value, setValue] = useState('')
  const [dayOverride, setDayOverride] = useState(null)
  const parsed = useMemo(() => parseTask(value), [value])
  const day = dayOverride ?? parsed.day ?? 'today'
  const hasText = value.trim().length > 0

  const submit = (e) => {
    e.preventDefault()
    if (!hasText) return
    onAdd({
      text: parsed.text,
      day,
      time: parsed.time,
      duration: parsed.duration,
      priority: parsed.priority ?? 'media',
    })
    setValue('')
    setDayOverride(null)
  }

  const details = [
    dayLabel(day),
    parsed.time,
    formatDuration(parsed.duration),
    parsed.priority === 'alta' && 'Prioridad alta',
  ].filter(Boolean)

  return (
    <form className="dfa-add" onSubmit={submit}>
      <div className="dfa-add-row">
        <label htmlFor="dfa-new" className="dfa-sr">
          Nueva tarea
        </label>
        <input
          id="dfa-new"
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Escribe lo que tienes en mente…"
          autoComplete="off"
        />
        <button type="submit" className="df-btn df-btn--sm" disabled={!hasText}>
          Añadir
        </button>
      </div>
      <div className="dfa-add-foot">
        <Segmented label="Día de la tarea" options={DAYS} value={day} onChange={setDayOverride} size="sm" />
        <p className="dfa-preview" aria-live="polite">
          {hasText ? (
            <>
              Se añadirá <strong>“{parsed.text}”</strong> · {details.join(' · ')}
            </>
          ) : (
            <>
              Prueba: <em>Llamar al banco mañana a las 10, 30 min !</em>
              <span className="dfa-shortcut">
                {' '}
                · Pulsa <span className="dfa-kbd">N</span> para escribir
              </span>
            </>
          )}
        </p>
      </div>
    </form>
  )
}

function TaskEditor({ task, onSave, onDelete, onCancel }) {
  const initialDay = dayOf(task)
  const [draft, setDraft] = useState({
    text: task.text,
    day: initialDay,
    priority: task.priority,
    time: task.time ?? '',
    duration: task.duration ?? null,
  })
  const set = (key) => (val) => setDraft((d) => ({ ...d, [key]: val }))

  const save = (e) => {
    e.preventDefault()
    const text = draft.text.trim()
    if (!text) return
    onSave({
      text,
      priority: draft.priority,
      time: draft.time || null,
      duration: draft.duration,
      // Si no cambia el día, se conserva la fecha original (p. ej. una tarea atrasada).
      ...(draft.day !== initialDay && { date: dayToDate(draft.day) }),
    })
  }

  return (
    <form
      className="dfa-editor"
      onSubmit={save}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          onCancel()
        }
      }}
    >
      <div className="dfa-field">
        <label htmlFor={`dfa-text-${task.id}`}>Tarea</label>
        <input
          id={`dfa-text-${task.id}`}
          className="dfa-input"
          value={draft.text}
          onChange={(e) => set('text')(e.target.value)}
          autoFocus
        />
      </div>
      <div className="dfa-editor-row">
        <div className="dfa-field">
          <span className="dfa-field-label">Día</span>
          <Segmented label="Día" options={DAYS} value={draft.day} onChange={set('day')} size="sm" />
        </div>
        <div className="dfa-field">
          <span className="dfa-field-label">Prioridad</span>
          <Segmented
            label="Prioridad"
            options={PRIORITY_OPTIONS}
            value={draft.priority}
            onChange={set('priority')}
            size="sm"
          />
        </div>
      </div>
      <div className="dfa-editor-row">
        <div className="dfa-field">
          <label htmlFor={`dfa-time-${task.id}`}>Hora</label>
          <input
            id={`dfa-time-${task.id}`}
            type="time"
            className="dfa-input dfa-input--time"
            value={draft.time}
            onChange={(e) => set('time')(e.target.value)}
          />
        </div>
        <div className="dfa-field">
          <span className="dfa-field-label">Duración</span>
          <Segmented
            label="Duración"
            options={DURATION_OPTIONS}
            value={draft.duration}
            onChange={set('duration')}
            size="sm"
          />
        </div>
      </div>
      <div className="dfa-editor-actions">
        <button type="submit" className="df-btn df-btn--sm">
          Guardar
        </button>
        <button type="button" className="dfa-text-btn" onClick={onCancel}>
          Cancelar
        </button>
        <button type="button" className="dfa-text-btn dfa-danger" onClick={onDelete}>
          Eliminar tarea
        </button>
      </div>
    </form>
  )
}

function TaskRow({ task, editing, onToggle, onEdit, onFocus, editor }) {
  const overdue = isOverdue(task)
  return (
    <li className={`dfa-task${task.done ? ' is-done' : ''}${editing ? ' is-editing' : ''}`}>
      <div className="dfa-task-main">
        <button
          type="button"
          className="dfa-check"
          aria-pressed={task.done}
          aria-label={task.done ? `Marcar “${task.text}” como pendiente` : `Marcar “${task.text}” como hecha`}
          onClick={onToggle}
        >
          <span className="df-check">{task.done && <CheckIcon />}</span>
        </button>
        <div className="dfa-task-body">
          <span className="dfa-task-text">{task.text}</span>
          {(task.time || task.duration || task.priority === 'alta' || overdue) && (
            <span className="dfa-task-meta">
              {task.time && <span>{task.time}</span>}
              {task.duration && <span>{formatDuration(task.duration)}</span>}
              {task.priority === 'alta' && <span className="dfa-warn">Prioridad alta</span>}
              {overdue && <span className="dfa-warn">De días anteriores</span>}
            </span>
          )}
        </div>
        <div className="dfa-task-actions">
          {!task.done && (
            <button type="button" className="dfa-text-btn" onClick={onFocus}>
              Enfocar
            </button>
          )}
          <button type="button" className="dfa-text-btn" aria-expanded={editing} onClick={onEdit}>
            {editing ? 'Cerrar' : 'Editar'}
          </button>
        </div>
      </div>
      {editing && editor}
    </li>
  )
}

function DayPanel({ tasks, hours, onHours, nextTask, onFocus }) {
  const pending = tasks.filter((t) => !t.done)
  const done = tasks.length - pending.length
  const planned = pending.reduce((sum, t) => sum + (t.duration || 0), 0)
  const available = hours * 60
  const over = planned > available
  const withoutDuration = pending.filter((t) => !t.duration).length
  const scheduled = pending.filter((t) => t.time).sort((a, b) => (a.time < b.time ? -1 : 1))

  let message
  if (!pending.length) {
    message = done ? 'Todo hecho por hoy. Disfruta del espacio.' : 'Tu día está despejado.'
  } else if (over) {
    message = `Te pasas ${formatDuration(planned - available)}. Mueve algo a mañana.`
  } else {
    message = planned
      ? `Cabe, y te sobran ${formatDuration(available - planned)}.`
      : 'Dale una duración a tus tareas para ver si tu día cabe.'
  }

  return (
    <>
      <section className="dfa-panel" aria-labelledby="dfa-day-title">
        <h2 id="dfa-day-title">Tu día</h2>

        <div className="dfa-capacity-top">
          <span>Planificado</span>
          <span>
            {formatDuration(planned) || '0 min'} de {hours} h
          </span>
        </div>
        <div className={`dfa-bar${over ? ' is-over' : ''}`} aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.min(1, planned / available)})` }} />
        </div>
        <p className={`dfa-msg${over ? ' is-over' : ''}`} aria-live="polite">
          {message}
        </p>
        {withoutDuration > 0 && pending.length > 0 && (
          <p className="dfa-note">
            {withoutDuration} {withoutDuration === 1 ? 'tarea sin duración' : 'tareas sin duración'}
          </p>
        )}

        {scheduled.length > 0 && (
          <ol className="dfa-timeline" aria-label="Tareas de hoy con hora">
            {scheduled.map((t) => (
              <li key={t.id}>
                <time>{t.time}</time>
                <span className="dfa-slot">
                  <strong>{t.text}</strong>
                  {t.duration && <span>{formatDuration(t.duration)}</span>}
                </span>
              </li>
            ))}
          </ol>
        )}

        <div className="dfa-hours">
          <span id="dfa-hours-label">Horas disponibles hoy</span>
          <div className="dfa-stepper" role="group" aria-labelledby="dfa-hours-label">
            <button type="button" onClick={() => onHours(hours - 1)} disabled={hours <= 1} aria-label="Una hora menos">
              −
            </button>
            <span aria-live="polite">{hours} h</span>
            <button type="button" onClick={() => onHours(hours + 1)} disabled={hours >= 16} aria-label="Una hora más">
              +
            </button>
          </div>
        </div>
      </section>

      <section className="dfa-focus-card" aria-label="Modo Enfoque">
        <p className="dfa-focus-card-label">
          <span className="df-pulse" /> Modo Enfoque
        </p>
        {nextTask ? (
          <>
            <p className="dfa-focus-card-task">{nextTask.text}</p>
            <button type="button" className="df-btn df-btn--light" onClick={() => onFocus(nextTask.id)}>
              Enfócate en esta tarea
            </button>
          </>
        ) : (
          <p className="dfa-focus-card-empty">Cuando tengas tareas para hoy, aquí verás la siguiente.</p>
        )}
      </section>
    </>
  )
}

/* ---------- App ---------- */

export default function DayflowApp() {
  const store = useDayflowStore()
  const { tasks, hours, addTask, addTasks, updateTask, setDone, deleteTask, restoreTask, replaceTasks, setHours } =
    store
  const [editingId, setEditingId] = useState(null)
  const [focusId, setFocusId] = useState(null)
  const [toast, setToast] = useState(null)
  const inputRef = useRef(null)
  const [dateText] = useState(() =>
    new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()),
  )

  const today = isoDay(0)

  // Las tareas hechas en días anteriores ya no se muestran (siguen en los datos exportados).
  const lists = useMemo(() => {
    const result = { today: [], tomorrow: [], someday: [] }
    tasks
      .filter((t) => !t.done || t.doneOn === today)
      .forEach((t) => result[dayOf(t)].push(t))
    Object.values(result).forEach((l) => l.sort(sortTasks))
    return result
  }, [tasks, today])

  const pendingToday = lists.today.filter((t) => !t.done)
  const doneToday = lists.today.length - pendingToday.length
  const nextTask = pendingToday[0] ?? null
  const focusTask = tasks.find((t) => t.id === focusId) ?? null

  const showToast = useCallback((message, action) => setToast({ message, action, key: Date.now() }), [])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(id)
  }, [toast])

  // Atajo de teclado: N para escribir una tarea nueva.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'n' && e.key !== 'N') return
      if (e.metaKey || e.ctrlKey || e.altKey || focusId) return
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return
      e.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focusId])

  const handleAdd = (fields) => {
    addTask(fields)
    showToast(`Añadida a ${dayLabel(fields.day)}: “${fields.text}”`)
  }

  const handleToggle = (task) => {
    setDone(task.id, !task.done)
    if (!task.done) {
      showToast(`Hecho: “${task.text}”`, { label: 'Deshacer', run: () => setDone(task.id, false) })
    }
  }

  const handleDelete = (task) => {
    deleteTask(task.id)
    setEditingId(null)
    showToast('Tarea eliminada', { label: 'Deshacer', run: () => restoreTask(task) })
  }

  const handleClearAll = () => {
    const previous = tasks
    replaceTasks([])
    setEditingId(null)
    showToast('Has borrado todas las tareas', { label: 'Deshacer', run: () => replaceTasks(previous) })
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), hours, tasks }, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dayflow-${today}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Datos exportados')
  }

  const closeFocus = useCallback(() => setFocusId(null), [])

  const completeFocus = () => {
    if (!focusTask) return
    setDone(focusTask.id, true)
    setFocusId(null)
    const next = pendingToday.find((t) => t.id !== focusTask.id)
    showToast(next ? `Hecho. Siguiente: “${next.text}”` : 'Hecho. No quedan tareas para hoy.')
  }


  const renderList = (key, title) => {
    const pending = lists[key].filter((t) => !t.done).length
    return (
    <section className="dfa-list" aria-labelledby={`dfa-list-${key}`} key={key}>
      <div className="dfa-list-head">
        <h2 id={`dfa-list-${key}`}>{title}</h2>
        <span>
          {pending} {pending === 1 ? 'pendiente' : 'pendientes'}
        </span>
      </div>
      {lists[key].length ? (
        <ul className="dfa-tasks">
          {lists[key].map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              editing={editingId === task.id}
              onToggle={() => handleToggle(task)}
              onEdit={() => setEditingId(editingId === task.id ? null : task.id)}
              onFocus={() => setFocusId(task.id)}
              editor={
                <TaskEditor
                  task={task}
                  onCancel={() => setEditingId(null)}
                  onDelete={() => handleDelete(task)}
                  onSave={(patch) => {
                    updateTask(task.id, patch)
                    setEditingId(null)
                    showToast('Cambios guardados')
                  }}
                />
              }
            />
          ))}
        </ul>
      ) : (
        <p className="dfa-empty">{EMPTY_TEXT[key]}</p>
      )}
    </section>
    )
  }

  return (
    <div className="df dfa">
      <header className="dfa-header">
        <a className="df-logo" href="#/dayflow" aria-label="DAYFLOW, ver la web">
          <Mark />
          <span>dayflow</span>
        </a>
        <a className="df-navlink" href="#/dayflow">
          Ver la web
        </a>
      </header>

      <main className="dfa-main">
        <div className="dfa-head">
          <p className="dfa-date">{dateText}</p>
          <h1 className="dfa-title">Hoy</h1>
          <p className="dfa-summary">
            {lists.today.length
              ? `${doneToday} de ${lists.today.length} hechas`
              : 'Haz espacio para lo que importa.'}
          </p>
        </div>

        <div className="dfa-add-wrap">
          <QuickAdd onAdd={handleAdd} inputRef={inputRef} />
          {tasks.length === 0 && (
            <div className="dfa-welcome">
              <p>¿Primera vez? Escribe tu primera tarea o carga unas de ejemplo para probar.</p>
              <button type="button" className="dfa-ghost-btn dfa-ghost-btn--light" onClick={() => addTasks(EXAMPLES)}>
                Cargar tareas de ejemplo
              </button>
            </div>
          )}
        </div>

        <aside className="dfa-aside">
          <DayPanel tasks={lists.today} hours={hours} onHours={setHours} nextTask={nextTask} onFocus={setFocusId} />
        </aside>

        <div className="dfa-lists">
          {renderList('today', 'Hoy')}
          {renderList('tomorrow', 'Mañana')}
          {renderList('someday', 'Algún día')}

          <section className="dfa-data" aria-label="Tus datos">
            <p>Tus tareas se guardan solo en este navegador.</p>
            <div className="dfa-data-actions">
              <button type="button" className="dfa-ghost-btn dfa-ghost-btn--light" onClick={handleExport}>
                Exportar datos
              </button>
              {tasks.length > 0 && (
                <button type="button" className="dfa-text-btn dfa-danger" onClick={handleClearAll}>
                  Borrar todo
                </button>
              )}
            </div>
          </section>
        </div>
      </main>

      <div className={`dfa-toast${toast ? ' is-visible' : ''}`} role="status" aria-live="polite">
        {toast && (
          <>
            <span>{toast.message}</span>
            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  toast.action.run()
                  setToast(null)
                }}
              >
                {toast.action.label}
              </button>
            )}
          </>
        )}
      </div>

      {focusTask && (
        <FocusMode
          key={focusTask.id}
          task={focusTask}
          waiting={pendingToday.filter((t) => t.id !== focusTask.id).length}
          onClose={closeFocus}
          onComplete={completeFocus}
        />
      )}
    </div>
  )
}
