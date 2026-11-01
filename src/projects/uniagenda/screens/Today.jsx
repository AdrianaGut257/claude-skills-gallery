import { daysBetween, durationLabel, formatLong, relativeDay, subjectById, toMin } from '../data.js'
import { Icon } from '../icons.jsx'
import { classesOn, nextClassDay, smartSuggestion, todayStatus, upcomingExams } from '../store.js'
import { Ring, Screen, SubjectTag } from '../ui.jsx'
import { TaskRow } from './Tasks.jsx'

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

function greeting(minutes) {
  if (minutes < 12 * 60) return 'Buenos días'
  if (minutes < 19 * 60) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function Today({ state, dispatch, now, onOpenClass, onFocus, onNavigate, onToggleTask, notify }) {
  const status = todayStatus(now)
  const suggestion = smartSuggestion(state, now)
  const exams = upcomingExams(state, now.iso)
  const nextExam = exams[0]
  const soon = state.tasks
    .filter((t) => !t.done && daysBetween(now.iso, t.due) >= 0 && daysBetween(now.iso, t.due) <= 3)
    .sort((a, b) => a.due.localeCompare(b.due))

  // Sin clases hoy o ya terminadas: se enseña el próximo día con clases.
  const showTomorrow = status.remaining.length === 0
  const upcoming = showTomorrow ? nextClassDay(now.iso) : null
  const agendaDate = showTomorrow ? upcoming?.iso : now.iso
  const agenda = agendaDate ? classesOn(agendaDate) : []
  const blocks = state.blocks.filter((b) => b.date === agendaDate)

  return (
    <Screen
      title={greeting(now.minutes)}
      barTitle="Hoy"
      eyebrow={capitalize(formatLong(now.iso))}
      actions={
        <a className="ua-icon-btn" href="#/" aria-label="Volver a la galería">
          <Icon name="grid" />
        </a>
      }
    >
      <ul className="ua-summary" aria-label="Resumen">
        <li>
          <Icon name="week" size={18} />
          {status.list.length ? `${status.list.length} clases hoy` : 'Sin clases hoy'}
        </li>
        <li>
          <Icon name="tasks" size={18} />
          {soon.length === 1 ? '1 entrega cerca' : `${soon.length} entregas cerca`}
        </li>
        {nextExam && (
          <li className="is-exam">
            <Icon name="exam" size={18} />
            {nextExam.left === 0 ? 'Examen hoy' : `Examen en ${nextExam.left} ${nextExam.left === 1 ? 'día' : 'días'}`}
          </li>
        )}
      </ul>

      {state.examWeek && nextExam && <StudyPlan exam={nextExam} onFocus={onFocus} />}

      <NowCard status={status} now={now} upcoming={upcoming} onOpenClass={onOpenClass} />

      {suggestion && <SmartCard suggestion={suggestion} now={now} dispatch={dispatch} notify={notify} />}

      <section className="ua-section" aria-labelledby="ua-agenda-title">
        <div className="ua-section-head">
          <h2 id="ua-agenda-title">
            {showTomorrow && upcoming ? capitalize(relativeDay(upcoming.iso, now.iso)) : 'Tu día'}
          </h2>
          <button type="button" className="ua-text-btn" onClick={() => onNavigate('semana')}>
            Ver semana
          </button>
        </div>
        <ol className="ua-timeline">
          {[...agenda.map((c) => ({ type: 'class', at: c.start, c })), ...blocks.map((b) => ({ type: 'block', at: b.start, b }))]
            .sort((a, b) => toMin(a.at) - toMin(b.at))
            .map((item) =>
              item.type === 'class' ? (
                <ClassItem
                  key={item.c.id}
                  c={item.c}
                  past={!showTomorrow && toMin(item.c.end) <= now.minutes}
                  live={!showTomorrow && status.current?.id === item.c.id}
                  onOpen={() => onOpenClass(item.c, agendaDate)}
                />
              ) : (
                <BlockItem key={item.b.id} b={item.b} tasks={state.tasks} dispatch={dispatch} notify={notify} />
              ),
            )}
        </ol>
      </section>

      <section className="ua-section" aria-labelledby="ua-soon-title">
        <div className="ua-section-head">
          <h2 id="ua-soon-title">Entregas próximas</h2>
          <button type="button" className="ua-text-btn" onClick={() => onNavigate('entregas')}>
            Ver todas
          </button>
        </div>
        {soon.length ? (
          <ul className="ua-list ua-card">
            {soon.slice(0, 3).map((t) => (
              <TaskRow key={t.id} task={t} today={now.iso} onToggle={onToggleTask} />
            ))}
          </ul>
        ) : (
          <p className="ua-empty">Nada para los próximos tres días.</p>
        )}
      </section>
    </Screen>
  )
}

function NowCard({ status, now, upcoming, onOpenClass }) {
  const { current, next, list } = status

  if (current) {
    const s = subjectById[current.subject]
    const total = toMin(current.end) - toMin(current.start)
    const left = toMin(current.end) - now.minutes
    return (
      <button type="button" className={`ua-now ua-tone-${s.tone}`} onClick={() => onOpenClass(current, now.iso)}>
        <span className="ua-now-label">
          <span className="ua-live-dot" aria-hidden="true" /> Ahora
        </span>
        <span className="ua-now-title">{s.name}</span>
        <span className="ua-now-meta">
          <Icon name="pin" size={18} /> {current.room} · {current.start} – {current.end}
        </span>
        <span className="ua-progress" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={total - left} aria-label="Avance de la clase">
          <span style={{ width: `${((total - left) / total) * 100}%` }} />
        </span>
        <span className="ua-now-foot">
          Quedan {durationLabel(left)}
          {next && ` · Después: ${subjectById[next.subject].name}, ${next.start}`}
        </span>
      </button>
    )
  }

  if (next) {
    const s = subjectById[next.subject]
    const wait = toMin(next.start) - now.minutes
    return (
      <button type="button" className={`ua-now ua-tone-${s.tone}`} onClick={() => onOpenClass(next, now.iso)}>
        <span className="ua-now-label">Siguiente · en {durationLabel(wait)}</span>
        <span className="ua-now-title">{s.name}</span>
        <span className="ua-now-meta">
          <Icon name="pin" size={18} /> {next.room} · {next.start} – {next.end}
        </span>
      </button>
    )
  }

  const first = upcoming?.list[0]
  return (
    <div className="ua-now is-rest">
      <span className="ua-now-label">{list.length ? 'Clases terminadas' : 'Día libre'}</span>
      <span className="ua-now-title">{list.length ? 'Terminaste por hoy' : 'Hoy no tienes clases'}</span>
      {first && (
        <span className="ua-now-meta">
          <Icon name="clock" size={18} />
          {relativeDay(upcoming.iso, now.iso)} empiezas a las {first.start} con {subjectById[first.subject].name}
        </span>
      )}
    </div>
  )
}

function SmartCard({ suggestion, now, dispatch, notify }) {
  if (suggestion.kind === 'examWeek') {
    const s = subjectById[suggestion.exam.subject]
    return (
      <aside className="ua-smart" aria-label="Recordatorio inteligente">
        <span className="ua-smart-icon">
          <Icon name="bulb" />
        </span>
        <div className="ua-smart-body">
          <p className="ua-smart-title">Se acerca tu {suggestion.exam.title.toLowerCase()}</p>
          <p>
            El de {s.name} es {relativeDay(suggestion.exam.date, now.iso).toLowerCase()}. Activa la semana de
            exámenes para tener tu plan de estudio aquí arriba.
          </p>
          <div className="ua-smart-actions">
            <button
              type="button"
              className="ua-btn ua-btn-tonal"
              onClick={() => {
                dispatch({ type: 'setExamWeek', value: true })
                notify('Semana de exámenes activada')
              }}
            >
              Activar
            </button>
            <button type="button" className="ua-text-btn" onClick={() => dispatch({ type: 'dismiss', key: suggestion.key })}>
              Ahora no
            </button>
          </div>
        </div>
      </aside>
    )
  }

  const { task, block, offset } = suggestion
  const when = offset === 0 ? 'Hoy' : 'Mañana'
  return (
    <aside className="ua-smart" aria-label="Recordatorio inteligente">
      <span className="ua-smart-icon">
        <Icon name="bulb" />
      </span>
      <div className="ua-smart-body">
        <p className="ua-smart-title">
          {when} tienes libre de {block.start} a {block.end}
        </p>
        <p>
          Buen momento para avanzar «{task.title}», que vence {relativeDay(task.due, now.iso).toLowerCase()}.
        </p>
        <div className="ua-smart-actions">
          <button
            type="button"
            className="ua-btn ua-btn-tonal"
            onClick={() => {
              dispatch({ type: 'addBlock', block: { ...block, id: `b${Date.now()}` } })
              notify(`Bloque reservado: ${when.toLowerCase()}, ${block.start}`)
            }}
          >
            Reservar bloque
          </button>
          <button type="button" className="ua-text-btn" onClick={() => dispatch({ type: 'dismiss', key: suggestion.key })}>
            Ahora no
          </button>
        </div>
      </div>
    </aside>
  )
}

function StudyPlan({ exam, onFocus }) {
  const s = subjectById[exam.subject]
  return (
    <section className="ua-plan" aria-label="Plan de estudio">
      <div className="ua-plan-top">
        <div>
          <p className="ua-plan-kicker">Semana de exámenes</p>
          <p className="ua-plan-title">
            {exam.title} de {s.name}
          </p>
          <p className="ua-plan-meta">
            {exam.left === 0 ? 'Es hoy' : `En ${exam.left} ${exam.left === 1 ? 'día' : 'días'}`} · {exam.time} ·{' '}
            {exam.room}
          </p>
        </div>
        <Ring value={exam.sessions / exam.goal} size={60} stroke={6}>
          <span className="ua-ring-num">
            {exam.sessions}/{exam.goal}
          </span>
        </Ring>
      </div>
      <button type="button" className="ua-btn ua-btn-filled ua-btn-block" onClick={() => onFocus(exam.id)}>
        <Icon name="focus" size={20} /> Empezar sesión de foco
      </button>
    </section>
  )
}

function ClassItem({ c, past, live, onOpen }) {
  const s = subjectById[c.subject]
  return (
    <li className={`ua-tl-item${past ? ' is-past' : ''}${live ? ' is-live' : ''}`}>
      <span className="ua-tl-time">
        <span>{c.start}</span>
        <span>{c.end}</span>
      </span>
      <button type="button" className={`ua-tl-card ua-tone-${s.tone}`} onClick={onOpen}>
        <span className="ua-tl-title">{s.name}</span>
        <span className="ua-tl-meta">
          {c.kind === 'Laboratorio' && <Icon name="lab" size={16} />}
          {c.kind} · {c.room}
        </span>
      </button>
    </li>
  )
}

function BlockItem({ b, tasks, dispatch, notify }) {
  const task = tasks.find((t) => t.id === b.task)
  return (
    <li className="ua-tl-item is-block">
      <span className="ua-tl-time">
        <span>{b.start}</span>
        <span>{b.end}</span>
      </span>
      <div className="ua-tl-card ua-tl-block">
        <span className="ua-tl-title">
          <Icon name="book" size={16} /> Bloque de estudio
        </span>
        <span className="ua-tl-meta">
          {task ? task.title : 'Estudio libre'}
          {task && (
            <>
              {' '}
              · <SubjectTag id={task.subject} />
            </>
          )}
        </span>
        <button
          type="button"
          className="ua-icon-btn ua-tl-remove"
          aria-label="Quitar bloque de estudio"
          onClick={() => {
            dispatch({ type: 'removeBlock', id: b.id })
            notify('Bloque quitado')
          }}
        >
          <Icon name="close" size={18} />
        </button>
      </div>
    </li>
  )
}
