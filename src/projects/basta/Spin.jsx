import { useEffect, useRef, useState } from 'react'
import { pickLetter } from './logic.js'
import { play } from './sfx.js'
import { LetterTile } from './ui.jsx'

const FACE_HEIGHT = 150

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Ruleta 3D: un cilindro con todas las letras que gira sobre su eje horizontal.
export default function Spin({ pool, used, letter, round, totalRounds, sound, onLetter, onBegin }) {
  const step = 360 / pool.length
  const radius = Math.round(FACE_HEIGHT / 2 / Math.tan(Math.PI / pool.length))
  const [angle, setAngle] = useState(() => (letter ? -pool.indexOf(letter) * step : 0))
  const [spinning, setSpinning] = useState(false)
  const pending = useRef(null)
  const timers = useRef([])
  const beginRef = useRef(null)

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  useEffect(() => {
    if (letter && !spinning) beginRef.current?.focus()
  }, [letter, spinning])

  const finish = () => {
    if (!pending.current) return
    const result = pending.current
    pending.current = null
    setSpinning(false)
    play('ding', sound)
    onLetter(result)
  }

  const spin = () => {
    if (spinning || letter) return
    const next = pickLetter(pool, used)
    const target = -pool.indexOf(next) * step
    // Al menos cuatro vueltas completas antes de parar en la letra elegida.
    const final = target + 360 * Math.floor((angle - 1440 - target) / 360)
    pending.current = next
    setSpinning(true)
    setAngle(final)

    if (reducedMotion()) {
      finish()
      return
    }
    // "Clics" de la ruleta, cada vez más espaciados mientras frena.
    let t = 0
    for (let k = 0; k < 22; k++) {
      t += 45 + k * k * 0.9
      if (t > 3000) break
      timers.current.push(setTimeout(() => play('tick', sound), t))
    }
  }

  return (
    <div className="bs-screen bs-spin">
      <p className="bs-eyebrow">
        Ronda {round} de {totalRounds}
      </p>
      <h2 className="bs-screen-title">{letter ? '¡Ya tenemos letra!' : 'Gira la ruleta'}</h2>

      <div className={`bs-machine${spinning ? ' is-spinning' : ''}${letter ? ' is-done' : ''}`}>
        <div className="bs-drum-window" aria-hidden="true">
          <div
            className="bs-drum"
            style={{
              transform: `translateZ(${-radius}px) rotateX(${angle}deg)`,
            }}
            onTransitionEnd={(e) => {
              if (e.target === e.currentTarget) finish()
            }}
          >
            {pool.map((l, i) => (
              <span
                key={l}
                className="bs-face"
                style={{ transform: `rotateX(${i * step}deg) translateZ(${radius}px)` }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
        <span className="bs-pointer bs-pointer--left" aria-hidden="true" />
        <span className="bs-pointer bs-pointer--right" aria-hidden="true" />
      </div>

      <p className="bs-sr" aria-live="assertive">
        {letter ? `Ha salido la letra ${letter}` : ''}
      </p>

      {letter ? (
        <div className="bs-actions">
          <button type="button" className="bs-btn bs-btn--primary bs-btn--xl" ref={beginRef} onClick={onBegin}>
            Empezar con la {letter}
          </button>
        </div>
      ) : (
        <div className="bs-actions">
          <button type="button" className="bs-btn bs-btn--primary bs-btn--xl" onClick={spin} disabled={spinning}>
            {spinning ? 'Girando…' : 'Girar la ruleta'}
          </button>
        </div>
      )}

      {used.length > (letter ? 1 : 0) && (
        <div className="bs-used">
          <span>Ya han salido:</span>
          {used
            .filter((l) => l !== letter)
            .map((l) => (
              <LetterTile key={l} letter={l} size="xs" />
            ))}
        </div>
      )}
    </div>
  )
}
