import { useId, useState } from 'react'
import { SUBJECTS, addDays, daysBetween, relativeDay } from '../data.js'
import { Icon } from '../icons.jsx'
import { groupTasks } from '../store.js'
import { Screen, SubjectTag } from '../ui.jsx'

export function TaskRow({ task, today, onToggle }) {
  const titleId = useId()
  const metaId = useId()
  const left = daysBetween(today, task.due)
  const late = !task.done && left < 0
  return (
    <li className={`ua-task${task.done ? ' is-done' : ''}`}>
      <label className="ua-task-hit">
        <input
          type="checkbox"
          className="ua-check-input"
          checked={task.done}
          onChange={() => onToggle(task)}
          aria-labelledby={titleId}
          aria-describedby={metaId}
        />
        <span className="ua-check" aria-hidden="true">
          <Icon name="check" size={16} />
        </span>
        <span className="ua-task-main">
          <span id={titleId} className="ua-task-title">
            {task.title}
          </span>
          <span id={metaId} className={`ua-task-meta${late ? ' is-late' : ''}`}>
            <SubjectTag id={task.subject} />
            <span>
              {late && <Icon name="alert" size={14} />}
              {relativeDay(task.due, today)}, {task.time}
            </span>
          </span>
        </span>
        {task.priority === 'alta' && !task.done && (
          <span className="ua-task-flag">
            <Icon name="flag" size={18} label="Prioridad alta" />
          </span>
        )}
      </label>
    </li>
  )
}

export default function Tasks({ state, now, onToggleTask, onNewTask }) {
  const [filter, setFilter] = useState('all')
  const visible = filter === 'all' ? state.tasks : state.tasks.filter((t) => t.subject === filter)
  const groups = groupTasks(visible, now.iso)
  const pending = state.tasks.filter((t) => !t.done).length

  return (
    <Screen title="Entregas" eyebrow={`${pending} pendientes`} className="has-fab">
      <div className="ua-chips" role="group" aria-label="Filtrar por materia">
        <button type="button" className="ua-chip" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
          {filter === 'all' && <Icon name="check" size={16} />}
          Todas
        </button>
        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            type="button"
            className="ua-chip"
            aria-pressed={filter === s.id}
            onClick={() => setFilter(s.id)}
          >
            {filter === s.id ? <Icon name="check" size={16} /> : <span className={`ua-dot ua-tone-${s.tone}`} aria-hidden="true" />}
            {s.code}
          </button>
        ))}
      </div>

      {groups.length ? (
        groups.map((g) => (
          <section key={g.id} className={`ua-section ua-group-${g.id}`} aria-labelledby={`ua-g-${g.id}`}>
            <h2 id={`ua-g-${g.id}`} className="ua-group-title">
              {g.label} <span>{g.items.length}</span>
            </h2>
            <ul className="ua-list ua-card">
              {g.items.map((t) => (
                <TaskRow key={t.id} task={t} today={now.iso} onToggle={onToggleTask} />
              ))}
            </ul>
          </section>
        ))
      ) : (
        <p className="ua-empty">No hay entregas de esta materia.</p>
      )}

      <button type="button" className="ua-fab" onClick={onNewTask}>
        <Icon name="plus" /> Nueva entrega
      </button>
    </Screen>
  )
}

/** Formulario de la hoja "Nueva entrega". Etiquetas visibles y error junto al campo (ui-ux-pro-max §8). */
export function NewTaskForm({ today, onSave, onCancel }) {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState(SUBJECTS[0].id)
  const [due, setDue] = useState(addDays(today, 1))
  const [time, setTime] = useState('23:59')
  const [priority, setPriority] = useState('normal')
  const [error, setError] = useState('')
  const errorId = useId()

  const submit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Escribe un título para la entrega.')
      e.currentTarget.querySelector('input[name="title"]').focus()
      return
    }
    onSave({ id: `t${Date.now()}`, title: title.trim(), subject, due, time, priority, minutes: 90, done: false })
  }

  return (
    <form className="ua-form" onSubmit={submit} noValidate>
      <div className="ua-field">
        <label htmlFor="ua-new-title">Título</label>
        <input
          id="ua-new-title"
          name="title"
          type="text"
          value={title}
          maxLength={80}
          autoComplete="off"
          enterKeyHint="next"
          autoCapitalize="sentences"
          placeholder="Ej.: Práctica 4 de pilas"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => {
            setTitle(e.target.value)
            if (error) setError('')
          }}
        />
        {error && (
          <p id={errorId} className="ua-field-error">
            <Icon name="alert" size={16} /> {error}
          </p>
        )}
      </div>

      <fieldset className="ua-field">
        <legend>Materia</legend>
        <div className="ua-chips is-wrap">
          {SUBJECTS.map((s) => (
            <label key={s.id} className="ua-chip ua-chip-radio">
              <input type="radio" name="subject" value={s.id} checked={subject === s.id} onChange={() => setSubject(s.id)} />
              <span className={`ua-dot ua-tone-${s.tone}`} aria-hidden="true" />
              {s.name}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="ua-field-row">
        <div className="ua-field">
          <label htmlFor="ua-new-due">Fecha</label>
          <input id="ua-new-due" type="date" value={due} min={today} onChange={(e) => setDue(e.target.value || due)} />
        </div>
        <div className="ua-field">
          <label htmlFor="ua-new-time">Hora</label>
          <input id="ua-new-time" type="time" value={time} onChange={(e) => setTime(e.target.value || time)} />
        </div>
      </div>

      <fieldset className="ua-field">
        <legend>Prioridad</legend>
        <div className="ua-segmented">
          {[
            ['normal', 'Normal'],
            ['alta', 'Alta'],
          ].map(([value, label]) => (
            <label key={value}>
              <input type="radio" name="priority" value={value} checked={priority === value} onChange={() => setPriority(value)} />
              <span>
                {priority === value && <Icon name="check" size={16} />}
                {label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="ua-form-actions">
        <button type="button" className="ua-text-btn" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="ua-btn ua-btn-filled">
          Guardar entrega
        </button>
      </div>
    </form>
  )
}
