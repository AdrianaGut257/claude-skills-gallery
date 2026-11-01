import { durationLabel, formatLong, subjectById } from '../data.js'
import { Icon } from '../icons.jsx'
import { upcomingExams } from '../store.js'
import { Ring, Screen, Switch } from '../ui.jsx'

export default function Exams({ state, dispatch, now, onFocus, notify }) {
  const exams = upcomingExams(state, now.iso)
  const [next, ...rest] = exams
  const todayMinutes = state.focusLog.filter((l) => l.date === now.iso).reduce((sum, l) => sum + l.minutes, 0)
  const totalSessions = state.focusLog.length

  return (
    <Screen title="Exámenes" eyebrow={exams.length ? `${exams.length} por delante` : 'Sin exámenes'}>
      <div className={`ua-examweek${state.examWeek ? ' is-on' : ''}`}>
        <span className="ua-examweek-icon">
          <Icon name="focus" />
        </span>
        <div>
          <p id="ua-examweek-label" className="ua-examweek-title">
            Semana de exámenes
          </p>
          <p className="ua-examweek-text">
            Pone tu plan de estudio en «Hoy» y activa las sesiones de foco con descansos.
          </p>
        </div>
        <Switch
          checked={state.examWeek}
          labelledBy="ua-examweek-label"
          onChange={(value) => {
            dispatch({ type: 'setExamWeek', value })
            notify(value ? 'Semana de exámenes activada' : 'Semana de exámenes desactivada')
          }}
        />
      </div>

      {next && <NextExam exam={next} now={now} onFocus={onFocus} />}

      {rest.length > 0 && (
        <section className="ua-section" aria-labelledby="ua-exams-rest">
          <div className="ua-section-head">
            <h2 id="ua-exams-rest">Después</h2>
          </div>
          <ul className="ua-list ua-card">
            {rest.map((e) => {
              const s = subjectById[e.subject]
              return (
                <li key={e.id} className="ua-exam-row">
                  <span className={`ua-exam-days ua-tone-${s.tone}`}>
                    <strong>{e.left}</strong>
                    <span>{e.left === 1 ? 'día' : 'días'}</span>
                  </span>
                  <span className="ua-exam-main">
                    <span className="ua-exam-title">
                      {e.title} de {s.name}
                    </span>
                    <span className="ua-exam-meta">
                      {formatLong(e.date)} · {e.time}
                    </span>
                  </span>
                  <button type="button" className="ua-icon-btn" aria-label={`Estudiar ${s.name} ahora`} onClick={() => onFocus(e.id)}>
                    <Icon name="play" />
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <section className="ua-section" aria-labelledby="ua-focus-stats">
        <div className="ua-section-head">
          <h2 id="ua-focus-stats">Tu foco</h2>
        </div>
        <dl className="ua-stats ua-card">
          <div>
            <dt>Hoy</dt>
            <dd>{todayMinutes ? durationLabel(todayMinutes) : '0 min'}</dd>
          </div>
          <div>
            <dt>Sesiones en total</dt>
            <dd>{totalSessions}</dd>
          </div>
        </dl>
      </section>
    </Screen>
  )
}

function NextExam({ exam, now, onFocus }) {
  const s = subjectById[exam.subject]
  return (
    <section className={`ua-next-exam ua-tone-${s.tone}`} aria-labelledby="ua-next-exam-title">
      <div className="ua-next-top">
        <div className="ua-countdown">
          <strong>{exam.left}</strong>
          <span>{exam.left === 0 ? 'Es hoy' : exam.left === 1 ? 'día' : 'días'}</span>
        </div>
        <Ring value={exam.sessions / exam.goal} size={64} stroke={6}>
          <span className="ua-ring-num">
            {exam.sessions}/{exam.goal}
          </span>
        </Ring>
      </div>
      <p className="ua-next-kicker">Próximo examen</p>
      <h2 id="ua-next-exam-title" className="ua-next-title">
        {exam.title} de {s.name}
      </h2>
      <ul className="ua-next-meta">
        <li>
          <Icon name="clock" size={18} /> {formatLong(exam.date)}, {exam.time}
        </li>
        <li>
          <Icon name="pin" size={18} /> {exam.room}
        </li>
      </ul>
      <p className="ua-next-label">Temas</p>
      <ul className="ua-topics">
        {exam.topics.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <p className="ua-next-progress">
        {exam.sessions} de {exam.goal} sesiones de estudio
        {exam.sessions < exam.goal && now && ` · te faltan ${exam.goal - exam.sessions}`}
      </p>
      <button type="button" className="ua-btn ua-btn-filled ua-btn-block" onClick={() => onFocus(exam.id)}>
        <Icon name="focus" size={20} /> Estudiar ahora
      </button>
    </section>
  )
}
