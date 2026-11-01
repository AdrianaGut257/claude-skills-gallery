import { useEffect, useReducer, useRef } from 'react'
import { subjectById } from '../data.js'
import { Icon } from '../icons.jsx'
import { upcomingExams } from '../store.js'
import { Ring } from '../ui.jsx'

const PRESETS = [
  { id: 'corto', label: '25 · 5', focus: 25, short: 5, long: 15 },
  { id: 'largo', label: '50 · 10', focus: 50, short: 10, long: 20 },
]

const PHASE_LABEL = { focus: 'Foco', short: 'Descanso', long: 'Descanso largo' }
const TIPS = [
  'Levántate y estira la espalda.',
  'Toma un vaso de agua.',
  'Mira algo lejano durante 20 segundos.',
  'Respira hondo cuatro veces.',
]

const lengthOf = (preset, phase) => preset[phase] * 60

function init(preset) {
  return { preset, phase: 'focus', left: lengthOf(preset, 'focus'), running: false, endsAt: 0, done: 0 }
}

// Pasa a la fase siguiente. Tras cuatro sesiones de foco toca el descanso largo.
function advance(t, now, completed) {
  const wasFocus = t.phase === 'focus'
  const done = wasFocus && completed ? t.done + 1 : t.done
  const phase = wasFocus ? (completed && done % 4 === 0 ? 'long' : 'short') : 'focus'
  const left = lengthOf(t.preset, phase)
  return { ...t, phase, done, left, endsAt: now + left * 1000 }
}

// El tiempo se calcula con la hora de fin, no contando ticks: así no se desfasa si el navegador frena la pestaña.
function timer(t, a) {
  switch (a.type) {
    case 'start':
      return { ...t, running: true, endsAt: a.now + t.left * 1000 }
    case 'pause':
      return { ...t, running: false, left: Math.max(0, Math.round((t.endsAt - a.now) / 1000)) }
    case 'tick': {
      const left = Math.max(0, Math.ceil((t.endsAt - a.now) / 1000))
      if (left > 0) return left === t.left ? t : { ...t, left }
      return advance(t, a.now, true) // cambio automático de fase
    }
    case 'skip':
      return advance(t, a.now, false)
    case 'preset':
      return init(a.preset)
    default:
      return t
  }
}

export default function Focus({ examId, state, dispatch, now, onClose, onPickExam }) {
  const [t, send] = useReducer(timer, PRESETS[0], init)
  const playRef = useRef(null)
  const doneRef = useRef(0)
  const exams = upcomingExams(state, now.iso)
  const exam = state.exams.find((e) => e.id === examId) ?? exams[0]
  const subject = exam ? subjectById[exam.subject] : null

  useEffect(() => {
    if (!t.running) return
    const id = setInterval(() => send({ type: 'tick', now: Date.now() }), 250)
    return () => clearInterval(id)
  }, [t.running])

  // Cada sesión de foco completada se suma al examen elegido.
  useEffect(() => {
    if (t.done > doneRef.current && exam) {
      dispatch({ type: 'logFocus', exam: exam.id, date: now.iso, minutes: t.preset.focus })
      navigator.vibrate?.(180)
    }
    doneRef.current = t.done
  }, [t.done, t.preset.focus, exam, now.iso, dispatch])

  // Barra de estado oscura mientras dura el foco (mobile-native §10).
  useEffect(() => {
    const metas = [...document.querySelectorAll('meta[data-ua-theme]')]
    const previous = metas.map((m) => m.content)
    for (const m of metas) m.setAttribute('content', '#0B1220')
    playRef.current?.focus({ preventScroll: true })
    return () => metas.forEach((m, i) => m.setAttribute('content', previous[i]))
  }, [])

  const total = lengthOf(t.preset, t.phase)
  const mm = String(Math.floor(t.left / 60)).padStart(2, '0')
  const ss = String(t.left % 60).padStart(2, '0')
  const todayLog = state.focusLog.filter((l) => l.date === now.iso)
  const todayMinutes = todayLog.reduce((sum, l) => sum + l.minutes, 0)

  return (
    <div
      className={`ua-focus is-${t.phase}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ua-focus-title"
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <header className="ua-focus-head">
        <button type="button" className="ua-icon-btn" onClick={onClose} aria-label="Cerrar sesión de foco">
          <Icon name="close" />
        </button>
        <h2 id="ua-focus-title">Sesión de foco</h2>
        <span className="ua-focus-spacer" />
      </header>

      {exam && (
        <div className="ua-focus-exam">
          <label htmlFor="ua-focus-exam">Estudiando para</label>
          <select id="ua-focus-exam" value={exam.id} onChange={(e) => onPickExam(e.target.value)}>
            {exams.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title} de {subjectById[e.subject].name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="ua-focus-stage">
        <Ring value={1 - t.left / total} size={248} stroke={10} className="ua-focus-ring">
          <span className="ua-focus-phase" aria-live="polite">
            {t.phase === 'focus' ? <Icon name="focus" size={18} /> : <Icon name="coffee" size={18} />}
            {PHASE_LABEL[t.phase]}
          </span>
          <span className="ua-focus-time" role="timer" aria-label={`${Math.ceil(t.left / 60)} minutos restantes`}>
            {mm}:{ss}
          </span>
          <span className="ua-focus-cycle">Sesión {(t.done % 4) + (t.phase === 'focus' ? 1 : 0) || 4} de 4</span>
        </Ring>
        <ol className="ua-focus-dots" aria-label={`${t.done % 4} de 4 sesiones completadas en este ciclo`}>
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className={i < t.done % 4 ? 'is-done' : ''} />
          ))}
        </ol>
        <p className="ua-focus-tip">
          {t.phase === 'focus'
            ? subject
              ? `Repasa: ${exam.topics[t.done % exam.topics.length]}.`
              : 'Un tema a la vez.'
            : TIPS[t.done % TIPS.length]}
        </p>
      </div>

      <div className="ua-focus-controls">
        <button type="button" className="ua-focus-side" onClick={() => send({ type: 'skip', now: Date.now() })} aria-label="Saltar a la fase siguiente">
          <Icon name="skip" />
        </button>
        <button
          ref={playRef}
          type="button"
          className="ua-focus-play"
          onClick={() => send({ type: t.running ? 'pause' : 'start', now: Date.now() })}
          aria-label={t.running ? 'Pausar' : 'Empezar'}
        >
          <Icon name={t.running ? 'pause' : 'play'} size={32} />
        </button>
        <button type="button" className="ua-focus-side" onClick={onClose} aria-label="Terminar sesión">
          <Icon name="stop" />
        </button>
      </div>

      <div className="ua-focus-foot">
        <div className="ua-focus-presets" role="radiogroup" aria-label="Duración">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={t.preset.id === p.id}
              disabled={t.running}
              onClick={() => send({ type: 'preset', preset: p })}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p>
          Hoy: {todayLog.length} {todayLog.length === 1 ? 'sesión' : 'sesiones'} · {todayMinutes} min
        </p>
      </div>
    </div>
  )
}
