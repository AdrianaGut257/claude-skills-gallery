import { useEffect, useRef, useState } from 'react'
import { CheckIcon } from '../icons.jsx'

const PRESETS = [15, 25, 50]

// Hora actual en ms; solo se usa dentro de manejadores e intervalos, nunca durante el render.
const now = () => Date.now()

function formatClock(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const m = String(Math.floor(total / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return `${m}:${s}`
}

// Sonido corto al terminar. Si el navegador no lo permite, no pasa nada.
function chime() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = 660
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2)
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 1.3)
    setTimeout(() => ctx.close(), 1500)
  } catch {
    // Sin audio disponible: el aviso visual es suficiente.
  }
}

export default function FocusMode({ task, waiting, onClose, onComplete }) {
  const [minutes, setMinutes] = useState(25)
  const [status, setStatus] = useState('idle') // idle | running | paused | finished
  const [remaining, setRemaining] = useState(25 * 60000)
  const endAt = useRef(0)
  const dialogRef = useRef(null)
  const primaryRef = useRef(null)

  // Cuenta atrás basada en la hora real, para que no se desvíe.
  useEffect(() => {
    if (status !== 'running') return
    const id = setInterval(() => {
      const left = endAt.current - now()
      if (left <= 0) {
        setRemaining(0)
        setStatus('finished')
        chime()
      } else {
        setRemaining(left)
      }
    }, 250)
    return () => clearInterval(id)
  }, [status])

  // El tiempo restante también se ve en la pestaña del navegador.
  useEffect(() => {
    const previous = document.title
    if (status === 'running' || status === 'paused') {
      document.title = `${formatClock(remaining)} · ${task.text}`
    } else if (status === 'finished') {
      document.title = `Tiempo cumplido · ${task.text}`
    }
    return () => {
      document.title = previous
    }
  }, [status, remaining, task.text])

  // Escape para salir, foco atrapado dentro del modo Enfoque y sin scroll de fondo.
  useEffect(() => {
    const node = dialogRef.current
    const previousFocus = document.activeElement
    primaryRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'Tab') {
        const items = [...node.querySelectorAll('button:not([disabled])')]
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previousFocus?.focus?.()
    }
  }, [onClose])

  const choose = (m) => {
    setMinutes(m)
    setRemaining(m * 60000)
  }
  const start = () => {
    endAt.current = now() + remaining
    setStatus('running')
  }
  const pause = () => {
    setRemaining(Math.max(0, endAt.current - now()))
    setStatus('paused')
  }
  const reset = () => {
    setStatus('idle')
    setRemaining(minutes * 60000)
  }
  const again = () => {
    endAt.current = now() + minutes * 60000
    setRemaining(minutes * 60000)
    setStatus('running')
  }

  const progress = 1 - remaining / (minutes * 60000)
  const primary = {
    idle: { label: 'Empezar', run: start },
    running: { label: 'Pausar', run: pause },
    paused: { label: 'Reanudar', run: start },
    finished: { label: 'Otra ronda', run: again },
  }[status]

  return (
    <div
      className="dfa-focus"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dfa-focus-task"
      ref={dialogRef}
    >
      <div className="dfa-focus-top">
        <span className="dfa-focus-brand">Modo Enfoque</span>
        <button type="button" className="dfa-ghost-btn" onClick={onClose}>
          Salir <span className="dfa-kbd">Esc</span>
        </button>
      </div>

      <div className="dfa-focus-center">
        <p className={`dfa-focus-label${status === 'finished' ? ' is-finished' : ''}`}>
          <span className="df-pulse" />
          {status === 'finished' ? 'Tiempo cumplido' : status === 'paused' ? 'En pausa' : 'Ahora'}
        </p>
        <h2 id="dfa-focus-task" className="dfa-focus-task">
          {task.text}
        </h2>

        <p className="dfa-focus-timer" role="timer" aria-live="off">
          {formatClock(remaining)}
        </p>
        <div className="dfa-focus-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.min(1, Math.max(0, progress))})` }} />
        </div>

        {status === 'idle' && (
          <div className="dfa-seg dfa-seg--dark" role="group" aria-label="Duración de la sesión">
            {PRESETS.map((m) => (
              <button type="button" key={m} aria-pressed={minutes === m} onClick={() => choose(m)}>
                {m} min
              </button>
            ))}
          </div>
        )}

        <div className="dfa-focus-controls">
          <button type="button" className="df-btn df-btn--light" ref={primaryRef} onClick={primary.run}>
            {primary.label}
          </button>
          {status !== 'idle' && (
            <button type="button" className="dfa-ghost-btn" onClick={reset}>
              Reiniciar
            </button>
          )}
          <button type="button" className="dfa-ghost-btn" onClick={onComplete}>
            <CheckIcon /> Terminar tarea
          </button>
        </div>
      </div>

      <div className="dfa-focus-foot">
        <span>Lo demás, en pausa.</span>
        <span>
          {waiting === 0
            ? 'No hay más tareas para hoy'
            : `${waiting} ${waiting === 1 ? 'tarea espera' : 'tareas esperan'} su turno`}
        </span>
      </div>
    </div>
  )
}
