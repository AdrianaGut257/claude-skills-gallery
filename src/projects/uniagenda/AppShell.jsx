import { useCallback, useEffect, useState } from 'react'
import { DAYS, daysBetween, relativeDay, subjectById } from './data.js'
import { Icon } from './icons.jsx'
import { useAgenda, useNow } from './store.js'
import Exams from './screens/Exams.jsx'
import Focus from './screens/Focus.jsx'
import Tasks, { NewTaskForm, TaskRow } from './screens/Tasks.jsx'
import Today from './screens/Today.jsx'
import Week from './screens/Week.jsx'
import { Sheet, Snackbar, SubjectTag } from './ui.jsx'

// Barra de navegación inferior: 4 destinos (Material 3 recomienda de 3 a 5).
const TABS = [
  { id: '', label: 'Hoy', icon: 'today' },
  { id: 'semana', label: 'Semana', icon: 'week' },
  { id: 'entregas', label: 'Entregas', icon: 'tasks' },
  { id: 'examenes', label: 'Exámenes', icon: 'exam' },
]

export default function AppShell({ subpath }) {
  const [state, dispatch] = useAgenda()
  const now = useNow()
  const tab = TABS.some((t) => t.id === subpath) ? subpath : ''

  const [classSheet, setClassSheet] = useState(null) // { c, date }
  const [taskSheet, setTaskSheet] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [focusExam, setFocusExam] = useState(null)
  const [snack, setSnack] = useState(null)

  const notify = useCallback((message, action) => setSnack({ id: Date.now(), message, ...action }), [])

  useEffect(() => {
    if (!snack) return
    const id = setTimeout(() => setSnack(null), 5000)
    return () => clearTimeout(id)
  }, [snack])

  // Cambiar de pestaña no apila historial: "atrás" sale de la app en vez de recorrer pestañas.
  const go = useCallback((id) => {
    window.location.replace(`#/uniagenda${id ? `/${id}` : ''}`)
  }, [])

  const toggleTask = useCallback(
    (task) => {
      dispatch({ type: 'toggleTask', id: task.id })
      if (!task.done) {
        notify('Entrega completada', {
          actionLabel: 'Deshacer',
          onAction: () => {
            dispatch({ type: 'toggleTask', id: task.id })
            setSnack(null)
          },
        })
      }
    },
    [dispatch, notify],
  )

  const openClass = useCallback((c, date) => setClassSheet({ c, date }), [])
  const openFocus = useCallback((examId) => setFocusExam(examId ?? 'next'), [])

  const shared = { state, dispatch, now, notify }
  const nextExamId = state.examWeek ? state.exams.find((e) => daysBetween(now.iso, e.date) >= 0)?.id : null

  return (
    <div className="ua-shell">
      <div className="ua-main" inert={Boolean(focusExam)}>
        {tab === '' && (
          <Today {...shared} onOpenClass={openClass} onFocus={openFocus} onNavigate={go} onToggleTask={toggleTask} />
        )}
        {tab === 'semana' && <Week {...shared} onOpenClass={openClass} />}
        {tab === 'entregas' && (
          <Tasks
            {...shared}
            onToggleTask={toggleTask}
            onNewTask={() => {
              setFormKey((k) => k + 1)
              setTaskSheet(true)
            }}
          />
        )}
        {tab === 'examenes' && <Exams {...shared} onFocus={openFocus} />}

        <nav className="ua-nav" aria-label="Secciones">
          {TABS.map((t) => (
            <a
              key={t.label}
              href={`#/uniagenda${t.id ? `/${t.id}` : ''}`}
              className="ua-nav-item"
              aria-current={tab === t.id ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault()
                go(t.id)
              }}
            >
              <span className="ua-nav-icon">
                <Icon name={t.icon} />
                {t.id === 'examenes' && nextExamId && <span className="ua-nav-badge" aria-label="Semana de exámenes activa" />}
              </span>
              <span className="ua-nav-label">{t.label}</span>
            </a>
          ))}
        </nav>

        <Snackbar message={snack?.message} actionLabel={snack?.actionLabel} onAction={snack?.onAction} />

        <Sheet
          open={Boolean(classSheet)}
          onClose={() => setClassSheet(null)}
          title={classSheet ? subjectById[classSheet.c.subject].name : ''}
        >
          {classSheet && <ClassDetail {...classSheet} state={state} now={now} onToggleTask={toggleTask} />}
        </Sheet>

        <Sheet open={taskSheet} onClose={() => setTaskSheet(false)} title="Nueva entrega">
          <NewTaskForm
            key={formKey}
            today={now.iso}
            onCancel={() => setTaskSheet(false)}
            onSave={(task) => {
              dispatch({ type: 'addTask', task })
              setTaskSheet(false)
              notify('Entrega guardada')
            }}
          />
        </Sheet>
      </div>

      {focusExam && (
        <Focus
          examId={focusExam === 'next' ? null : focusExam}
          {...shared}
          onPickExam={setFocusExam}
          onClose={() => setFocusExam(null)}
        />
      )}
    </div>
  )
}

function ClassDetail({ c, date, state, now, onToggleTask }) {
  const s = subjectById[c.subject]
  const tasks = state.tasks.filter((t) => t.subject === c.subject && !t.done)
  const exam = state.exams
    .filter((e) => e.subject === c.subject && daysBetween(now.iso, e.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date))[0]

  return (
    <div className="ua-detail">
      <p className="ua-detail-tags">
        <SubjectTag id={c.subject} /> <span className="ua-detail-kind">{c.kind}</span>
      </p>
      <ul className="ua-detail-list">
        <li>
          <Icon name="clock" />
          <span>
            <strong>
              {DAYS[c.day - 1].long.charAt(0).toUpperCase() + DAYS[c.day - 1].long.slice(1)}, {c.start} – {c.end}
            </strong>
            <span>{relativeDay(date, now.iso)}</span>
          </span>
        </li>
        <li>
          <Icon name="pin" />
          <span>
            <strong>{c.room}</strong>
            <span>Facultad de Ciencias y Tecnología</span>
          </span>
        </li>
        <li>
          <Icon name="user" />
          <span>
            <strong>{s.teacher}</strong>
            <span>Docente</span>
          </span>
        </li>
        <li>
          <Icon name="users" />
          <span>
            <strong>{s.group}</strong>
            <span>Tu grupo</span>
          </span>
        </li>
      </ul>

      {exam && (
        <p className="ua-detail-exam">
          <Icon name="exam" size={20} />
          {exam.title}: {relativeDay(exam.date, now.iso).toLowerCase()}, {exam.time}
        </p>
      )}

      <h3 className="ua-detail-sub">Entregas pendientes</h3>
      {tasks.length ? (
        <ul className="ua-list ua-card">
          {tasks.map((t) => (
            <TaskRow key={t.id} task={t} today={now.iso} onToggle={onToggleTask} />
          ))}
        </ul>
      ) : (
        <p className="ua-empty">Nada pendiente de esta materia.</p>
      )}
    </div>
  )
}
