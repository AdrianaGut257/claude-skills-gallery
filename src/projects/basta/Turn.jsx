import { useEffect, useRef, useState } from 'react'
import { startsWithLetter } from './logic.js'
import { play } from './sfx.js'
import { Avatar, LetterTile } from './ui.jsx'

// Hora actual en ms; solo se usa en manejadores e intervalos, no durante el render.
const now = () => Date.now()

// Pantalla intermedia: el móvil cambia de manos sin que nadie vea las respuestas anteriores.
export function Handoff({ player, index, total, letter, onStart }) {
  const buttonRef = useRef(null)
  useEffect(() => buttonRef.current?.focus(), [player.id])
  const solo = total === 1

  return (
    <div className="bs-screen bs-handoff" style={{ '--c': player.color }}>
      <p className="bs-eyebrow">{solo ? 'Tu turno' : `Turno ${index + 1} de ${total}`}</p>
      <Avatar player={player} size="xl" />
      <h2 className="bs-screen-title">{solo ? `¿Preparado/a, ${player.name}?` : `Pasa el móvil a ${player.name}`}</h2>
      {!solo && <p className="bs-lead">Los demás, sin mirar la pantalla.</p>}
      <div className="bs-handoff-letter">
        <span>Letra</span>
        <LetterTile letter={letter} size="md" />
      </div>
      <button type="button" className="bs-btn bs-btn--primary bs-btn--xl" ref={buttonRef} onClick={onStart}>
        Soy {player.name}, ¡empiezo!
      </button>
    </div>
  )
}

export function Turn({ player, letter, categories, seconds, sound, onEnd }) {
  const [answers, setAnswers] = useState(() => Object.fromEntries(categories.map((c) => [c, ''])))
  const [left, setLeft] = useState(seconds * 1000)
  const [ended, setEnded] = useState(null) // null | 'basta' | 'time' | 'done'
  const answersRef = useRef(answers)
  const endAt = useRef(0)
  const lastSecond = useRef(seconds)
  const leaveTimer = useRef(0)
  const result = useRef(null)
  const inputs = useRef([])

  const filled = categories.filter((c) => answers[c].trim()).length
  const allFilled = filled === categories.length
  const secondsLeft = Math.ceil(left / 1000)
  const urgent = secondsLeft <= 10 && !ended

  const leave = () => {
    clearTimeout(leaveTimer.current)
    if (result.current) {
      const r = result.current
      result.current = null
      onEnd(r)
    }
  }

  const finish = (kind, remainingMs) => {
    if (result.current || ended) return
    setEnded(kind)
    play(kind === 'time' ? 'time' : 'basta', sound)
    result.current = { answers: answersRef.current, secondsLeft: Math.max(0, Math.ceil(remainingMs / 1000)) }
    leaveTimer.current = setTimeout(leave, 1600)
  }

  // Referencias a la última versión de finish y del sonido para usarlas dentro del intervalo.
  const finishRef = useRef(finish)
  const soundRef = useRef(sound)
  useEffect(() => {
    finishRef.current = finish
    soundRef.current = sound
  })

  // Cuenta atrás. Se guarda la hora de fin para que el tiempo no se desvíe.
  useEffect(() => {
    endAt.current = now() + seconds * 1000
    inputs.current[0]?.focus()
    const id = setInterval(() => {
      if (result.current) return // turno terminado: el contador se queda quieto
      const remaining = endAt.current - now()
      if (remaining <= 0) {
        clearInterval(id)
        setLeft(0)
        finishRef.current('time', 0)
        return
      }
      setLeft(remaining)
      const s = Math.ceil(remaining / 1000)
      if (s <= 10 && s < lastSecond.current) play('tick', soundRef.current)
      lastSecond.current = s
    }, 200)
    return () => {
      clearInterval(id)
      clearTimeout(leaveTimer.current)
    }
  }, [seconds])

  const change = (category, value) => {
    const next = { ...answersRef.current, [category]: value }
    answersRef.current = next
    setAnswers(next)
  }

  const handleKey = (e, i) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const nextInput = inputs.current[i + 1]
      if (nextInput) nextInput.focus()
      else e.currentTarget.blur()
    }
  }

  return (
    <div className={`bs-screen bs-turn${urgent ? ' is-urgent' : ''}`} style={{ '--c': player.color }}>
      <div className="bs-turn-bar">
        <div className="bs-turn-who">
          <Avatar player={player} size="sm" />
          <span>{player.name}</span>
        </div>
        <LetterTile letter={letter} size="sm" />
        <div className="bs-timer" role="timer" aria-label={`Quedan ${secondsLeft} segundos`}>
          {secondsLeft}
          <small>s</small>
        </div>
        <div className="bs-timer-track" aria-hidden="true">
          <span style={{ transform: `scaleX(${left / (seconds * 1000)})` }} />
        </div>
      </div>

      <p className="bs-turn-help">
        Palabras que empiecen por <strong>{letter}</strong> · {filled} de {categories.length}
      </p>

      <ol className="bs-answers">
        {categories.map((c, i) => {
          const value = answers[c]
          const has = value.trim().length > 0
          const ok = has && startsWithLetter(value, letter)
          return (
            <li key={c} className={`bs-answer${has ? (ok ? ' is-ok' : ' is-bad') : ''}`}>
              <label htmlFor={`bs-a-${i}`}>{c}</label>
              <div className="bs-answer-field">
                <input
                  id={`bs-a-${i}`}
                  ref={(el) => {
                    inputs.current[i] = el
                  }}
                  className="bs-input bs-input--answer"
                  value={value}
                  onChange={(e) => change(c, e.target.value)}
                  onKeyDown={(e) => handleKey(e, i)}
                  placeholder={`${letter}…`}
                  readOnly={Boolean(ended)}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="sentences"
                  spellCheck={false}
                  enterKeyHint={i === categories.length - 1 ? 'done' : 'next'}
                  aria-describedby={has && !ok ? `bs-a-${i}-err` : undefined}
                  aria-invalid={has && !ok}
                />
                <span className="bs-answer-mark" aria-hidden="true">
                  {has ? (ok ? '✓' : '!') : ''}
                </span>
              </div>
              {has && !ok && (
                <p id={`bs-a-${i}-err`} className="bs-answer-error">
                  Tiene que empezar por {letter}
                </p>
              )}
            </li>
          )
        })}
      </ol>

      <div className="bs-basta-dock">
        <button
          type="button"
          className="bs-basta"
          disabled={!allFilled || Boolean(ended)}
          onClick={() => finish('basta', endAt.current - now())}
        >
          ¡Basta!
        </button>
        <p className="bs-hint">
          {allFilled ? 'Lo tienes todo: ¡grita y pulsa!' : 'Rellena todas las categorías para decir ¡Basta!'}
        </p>
        <button
          type="button"
          className="bs-link"
          disabled={Boolean(ended)}
          onClick={() => finish('done', endAt.current - now())}
        >
          No se me ocurre más, terminar turno
        </button>
      </div>

      {ended && (
        <button type="button" className={`bs-stamp-layer is-${ended}`} onClick={leave}>
          <span className="bs-stamp">
            {ended === 'basta' ? '¡Basta!' : ended === 'time' ? '¡Tiempo!' : '¡Listo!'}
          </span>
          <span className="bs-stamp-hint">Toca para seguir</span>
        </button>
      )}
    </div>
  )
}
