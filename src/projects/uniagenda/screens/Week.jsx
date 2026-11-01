import { useState } from 'react'
import { DAYS, PERIODS, SCHEDULE, SUBJECTS, addDays, durationLabel, formatShort, subjectById, toMin } from '../data.js'
import { Icon } from '../icons.jsx'
import { Screen, SubjectTag } from '../ui.jsx'

const GRID_START = toMin(PERIODS[0][0])
const GRID_END = toMin(PERIODS[PERIODS.length - 1][1])

/** Lunes de la semana que toca ver: la actual, o la siguiente si hoy es domingo. */
function mondayOf(iso, weekday) {
  return weekday === 7 ? addDays(iso, 1) : addDays(iso, 1 - weekday)
}

export default function Week({ state, now, onOpenClass }) {
  const [offset, setOffset] = useState(0)
  const monday = addDays(mondayOf(now.iso, now.weekday), offset * 7)
  const dates = DAYS.map((d) => addDays(monday, d.n - 1))
  const label = `${formatShort(dates[0])} – ${formatShort(dates[5])}`

  const examsOn = (iso) => state.exams.filter((e) => e.date === iso)
  const dueOn = (iso) => state.tasks.filter((t) => !t.done && t.due === iso)
  const weeklyMinutes = SCHEDULE.reduce((sum, c) => sum + toMin(c.end) - toMin(c.start), 0)

  const todayCol = dates.indexOf(now.iso)
  const showNow = todayCol >= 0 && now.minutes >= GRID_START && now.minutes <= GRID_END
  const nowPct = ((now.minutes - GRID_START) / (GRID_END - GRID_START)) * 100

  return (
    <Screen title="Semana" eyebrow={`${SCHEDULE.length} clases · ${durationLabel(weeklyMinutes)}`}>
      <div className="ua-weekbar">
        <button type="button" className="ua-icon-btn" aria-label="Semana anterior" onClick={() => setOffset((o) => o - 1)}>
          <Icon name="chevronLeft" />
        </button>
        <p aria-live="polite">
          <span>{offset === 0 ? 'Esta semana' : offset === 1 ? 'La próxima semana' : offset === -1 ? 'La semana pasada' : 'Semana'}</span>
          {label}
        </p>
        <button type="button" className="ua-icon-btn" aria-label="Semana siguiente" onClick={() => setOffset((o) => o + 1)}>
          <Icon name="chevronRight" />
        </button>
      </div>

      <div className="ua-grid" style={{ '--rows': PERIODS.length }}>
        <div className="ua-grid-corner" aria-hidden="true" />
        {DAYS.map((d, i) => {
          const iso = dates[i]
          const exams = examsOn(iso)
          const due = dueOn(iso)
          return (
            <div key={d.n} className={`ua-grid-day${iso === now.iso ? ' is-today' : ''}`} style={{ gridColumn: i + 2 }}>
              <span className="ua-grid-dow">{d.short}</span>
              <span className="ua-grid-date">{Number(iso.slice(8, 10))}</span>
              <span className="ua-grid-marks">
                {exams.length > 0 && <span className="ua-mark is-exam" title="Examen" />}
                {due.length > 0 && <span className="ua-mark is-due" title="Entrega" />}
              </span>
            </div>
          )
        })}

        {PERIODS.map(([start], r) => (
          <span key={start} className="ua-grid-time" style={{ gridRow: r + 2 }}>
            {start}
          </span>
        ))}

        {/* Pauta de fondo */}
        {PERIODS.map(([start], r) => (
          <span key={`l${start}`} className="ua-grid-line" style={{ gridRow: r + 2 }} aria-hidden="true" />
        ))}

        {SCHEDULE.map((c) => {
          const s = subjectById[c.subject]
          const iso = dates[c.day - 1]
          const exam = state.exams.find((e) => e.subject === c.subject && e.date === iso && e.time === c.start)
          return (
            <button
              key={c.id}
              type="button"
              className={`ua-block ua-tone-${s.tone}${exam ? ' has-exam' : ''}`}
              style={{ gridColumn: c.day + 1, gridRow: c.period + 2 }}
              onClick={() => onOpenClass(c, iso)}
              aria-label={`${s.name}, ${c.kind.toLowerCase()}, ${DAYS[c.day - 1].long} de ${c.start} a ${c.end}, ${c.room}${exam ? `. ${exam.title}` : ''}`}
            >
              <span className="ua-block-code">{s.code}</span>
              <span className="ua-block-kind">{exam ? 'Examen' : c.kind === 'Laboratorio' ? 'Lab' : c.kind === 'Práctica' ? 'Práct.' : c.room.replace('Aula ', '')}</span>
            </button>
          )
        })}

        {showNow && (
          <span
            className="ua-grid-now"
            style={{ gridColumn: todayCol + 2, top: `calc(var(--head) + (100% - var(--head)) * ${nowPct / 100})` }}
            aria-hidden="true"
          />
        )}
      </div>

      <ul className="ua-legend" aria-label="Materias">
        {SUBJECTS.map((s) => (
          <li key={s.id}>
            <SubjectTag id={s.id} /> {s.name}
          </li>
        ))}
      </ul>
      <p className="ua-hint">
        <span className="ua-mark is-exam" aria-hidden="true" /> Examen
        <span className="ua-mark is-due" aria-hidden="true" /> Entrega
      </p>
    </Screen>
  )
}
