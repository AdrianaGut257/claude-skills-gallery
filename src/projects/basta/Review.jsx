import { useMemo } from 'react'
import { REASONS, answerKey, scoreRound } from './logic.js'
import { Avatar, LetterTile } from './ui.jsx'

const STATUS_LABEL = {
  only: 'Única respuesta',
  unique: 'Nadie más la tiene',
  repeated: 'Repetida',
}

export default function Review({ players, categories, letter, answers, rejected, onToggle, onConfirm }) {
  const { cells, totals } = useMemo(
    () => scoreRound({ players, categories, letter, answers, rejected }),
    [players, categories, letter, answers, rejected],
  )
  const many = players.length > 1

  return (
    <div className="bs-screen bs-review">
      <div className="bs-review-head">
        <LetterTile letter={letter} size="md" />
        <div>
          <h2 className="bs-screen-title">Revisión de respuestas</h2>
          <p className="bs-lead">
            {many
              ? 'Leed las respuestas en voz alta. Si el grupo no acepta alguna, tocad “Anular”.'
              : 'Revisa tus respuestas. Si alguna no vale, anúlala.'}
          </p>
        </div>
      </div>

      <div className="bs-review-list">
        {categories.map((category) => (
          <section key={category} className="bs-card bs-review-card" aria-label={category}>
            <h3>{category}</h3>
            <ul>
              {players.map((p) => {
                const cell = cells[p.id][category]
                const key = answerKey(p.id, category)
                const canToggle = cell.reason === null || cell.reason === 'rejected'
                const isRejected = cell.reason === 'rejected'
                return (
                  <li key={p.id} className={`bs-review-row is-${cell.status}`}>
                    {many && <Avatar player={p} size="sm" />}
                    <div className="bs-review-answer">
                      <span className="bs-review-text">{cell.text || '—'}</span>
                      <span className="bs-review-status">
                        {cell.reason ? REASONS[cell.reason] : STATUS_LABEL[cell.status]}
                        {many && <span className="bs-sr"> · {p.name}</span>}
                      </span>
                    </div>
                    <span key={cell.points} className="bs-points-badge">
                      +{cell.points}
                    </span>
                    {canToggle && (
                      <button
                        type="button"
                        className="bs-toggle"
                        aria-pressed={isRejected}
                        aria-label={`${isRejected ? 'Aceptar' : 'Anular'} “${cell.text}” de ${p.name}`}
                        onClick={() => onToggle(key)}
                      >
                        {isRejected ? 'Aceptar' : 'Anular'}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>

      <div className="bs-review-dock">
        <ul className="bs-round-totals" aria-label="Puntos de esta ronda">
          {players.map((p) => (
            <li key={p.id}>
              <Avatar player={p} size="xs" />
              <span className="bs-sr">{p.name}</span>
              <strong key={totals[p.id]}>+{totals[p.id]}</strong>
            </li>
          ))}
        </ul>
        <button type="button" className="bs-btn bs-btn--primary" onClick={onConfirm}>
          Confirmar puntos
        </button>
      </div>
    </div>
  )
}
