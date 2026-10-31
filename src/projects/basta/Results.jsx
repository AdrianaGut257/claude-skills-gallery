import { useEffect, useRef, useState } from 'react'
import { ranking } from './logic.js'
import { play } from './sfx.js'
import { Avatar, LetterTile } from './ui.jsx'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Número que sube poco a poco hasta su valor (o directo si se reduce el movimiento).
function CountUp({ from = 0, to, duration = 1200 }) {
  const [value, setValue] = useState(from)
  useEffect(() => {
    if (reducedMotion() || from === to) {
      const id = requestAnimationFrame(() => setValue(to))
      return () => cancelAnimationFrame(id)
    }
    let frame = 0
    let start = 0
    const tick = (t) => {
      if (!start) start = t
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(from + (to - from) * eased))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [from, to, duration])
  return value
}

// Momentos destacados de la ronda: respuestas que solo tuvo una persona.
function highlights(players, categories, entry) {
  const list = []
  for (const category of categories) {
    for (const p of players) {
      const cell = entry.cells[p.id]?.[category]
      if (cell?.status === 'only') list.push({ player: p, category, text: cell.text })
    }
  }
  return list.slice(0, 3)
}

export function Scores({ players, categories, game, totalRounds, isLast, onNext, onFinish }) {
  const entry = game.history[game.history.length - 1]
  const rows = ranking(players, game.totals)
  const max = Math.max(1, ...rows.map((r) => r.score))
  const moments = players.length > 1 ? highlights(players, categories, entry) : []
  const buttonRef = useRef(null)
  useEffect(() => buttonRef.current?.focus(), [])

  return (
    <div className="bs-screen bs-scores">
      <div className="bs-review-head">
        <LetterTile letter={entry.letter} size="md" />
        <div>
          <p className="bs-eyebrow">
            Ronda {entry.round} de {totalRounds}
          </p>
          <h2 className="bs-screen-title">Marcador</h2>
        </div>
      </div>

      <ol className="bs-board">
        {rows.map(({ player, score, position }, i) => {
          const gained = entry.points[player.id] ?? 0
          return (
            <li key={player.id} className="bs-board-row" style={{ '--c': player.color, '--d': `${i * 90}ms` }}>
              <span className="bs-board-pos">{position}</span>
              <Avatar player={player} size="md" />
              <div className="bs-board-main">
                <div className="bs-board-line">
                  <span className="bs-board-name">{player.name}</span>
                  <span className="bs-board-gain">+{gained}</span>
                </div>
                <div className="bs-board-bar" aria-hidden="true">
                  <span style={{ transform: `scaleX(${score / max})` }} />
                </div>
              </div>
              <strong className="bs-board-score">
                <CountUp from={score - gained} to={score} />
              </strong>
            </li>
          )
        })}
      </ol>

      {moments.length > 0 && (
        <section className="bs-moments" aria-label="Momentos de la ronda">
          <h3>Solo se le ocurrió a…</h3>
          <ul>
            {moments.map((m) => (
              <li key={m.player.id + m.category}>
                <Avatar player={m.player} size="xs" />
                <span>
                  <strong>{m.player.name}</strong>: “{m.text}” en {m.category.toLowerCase()} <em>+20</em>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="bs-actions">
        {isLast ? (
          <button type="button" className="bs-btn bs-btn--primary bs-btn--xl" ref={buttonRef} onClick={onFinish}>
            Ver quién ha ganado
          </button>
        ) : (
          <button type="button" className="bs-btn bs-btn--primary bs-btn--xl" ref={buttonRef} onClick={onNext}>
            Siguiente ronda
          </button>
        )}
      </div>
    </div>
  )
}

/* ---------- Final ---------- */

function Confetti() {
  const canvasRef = useRef(null)
  useEffect(() => {
    if (reducedMotion()) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
    }
    resize()
    const colors = ['#FFD23F', '#FF4D6D', '#2FD8A1', '#7B6BFF', '#5B8CFF', '#F9A8D4']
    const pieces = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height * 0.6,
      w: (6 + Math.random() * 6) * dpr,
      h: (10 + Math.random() * 8) * dpr,
      vy: (2 + Math.random() * 3) * dpr,
      vx: (Math.random() - 0.5) * 2 * dpr,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      c: colors[Math.floor(Math.random() * colors.length)],
    }))
    let frame = 0
    let start = 0
    const draw = (t) => {
      if (!start) start = t
      const elapsed = t - start
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = elapsed > 3500 ? Math.max(0, 1 - (elapsed - 3500) / 1000) : 1
      for (const p of pieces) {
        p.x += p.vx
        p.y += p.vy
        p.r += p.vr
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.r)
        ctx.fillStyle = p.c
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)))
        ctx.restore()
      }
      if (elapsed < 4500) frame = requestAnimationFrame(draw)
      else ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    frame = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [])
  return <canvas ref={canvasRef} className="bs-confetti" aria-hidden="true" />
}

function shareText(rows, game) {
  const letters = game.history.map((h) => h.letter).join(', ')
  const lines = rows.map((r) => `${r.position}. ${r.player.name} — ${r.score} puntos`)
  return [`¡Basta! · ${game.history.length} rondas · Letras: ${letters}`, ...lines].join('\n')
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  }
}

export function Final({ players, game, sound, onRematch, onEditSetup }) {
  const rows = ranking(players, game.totals)
  const winners = rows.filter((r) => r.position === 1)
  const [shared, setShared] = useState(null)
  const rematchRef = useRef(null)
  const soundAtStart = useRef(sound)

  // Solo al entrar en la pantalla final.
  useEffect(() => {
    play('win', soundAtStart.current)
    rematchRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!shared) return
    const id = setTimeout(() => setShared(null), 2500)
    return () => clearTimeout(id)
  }, [shared])

  // Orden del podio: 2.º a la izquierda, 1.º en el centro, 3.º a la derecha.
  const top = rows.slice(0, 3)
  const podium = [top[1], top[0], top[2]].filter(Boolean)

  const bestRound = game.history.reduce(
    (best, h) => {
      for (const p of players) {
        const pts = h.points[p.id] ?? 0
        if (pts > best.points) best = { points: pts, player: p, letter: h.letter }
      }
      return best
    },
    { points: -1 },
  )

  const share = async () => {
    const text = shareText(rows, game)
    // En móvil se abre el menú de compartir; en ordenador se copia directamente.
    const touch = window.matchMedia('(pointer: coarse)').matches
    if (touch && navigator.share) {
      try {
        await navigator.share({ title: '¡Basta!', text })
        setShared('Compartido')
        return
      } catch {
        // Si se cancela el menú de compartir, probamos a copiar.
      }
    }
    setShared((await copyText(text)) ? 'Resultado copiado' : 'No se pudo copiar')
  }

  const title =
    players.length === 1
      ? `${rows[0].score} puntos`
      : winners.length > 1
        ? `¡Empate entre ${winners.map((w) => w.player.name).join(' y ')}!`
        : `¡Gana ${winners[0].player.name}!`

  return (
    <div className="bs-screen bs-final">
      <Confetti />
      <p className="bs-eyebrow">Fin de la partida</p>
      <h2 className="bs-final-title">{title}</h2>

      <div className="bs-podium" aria-label="Podio">
        {podium.map((r) => (
          <div
            key={r.player.id}
            className={`bs-step bs-step--${r === top[0] ? 1 : r === top[1] ? 2 : 3}`}
            style={{ '--c': r.player.color }}
          >
            <div className="bs-step-person">
              <Avatar player={r.player} size="lg" />
              <span className="bs-step-name">{r.player.name}</span>
              <span className="bs-step-score">{r.score}</span>
            </div>
            <div className="bs-block">
              <span className="bs-block-top" aria-hidden="true" />
              <span className="bs-block-front">{r.position}</span>
            </div>
          </div>
        ))}
      </div>

      {rows.length > 3 && (
        <ol className="bs-rest" start={4}>
          {rows.slice(3).map((r) => (
            <li key={r.player.id}>
              <span className="bs-board-pos">{r.position}</span>
              <Avatar player={r.player} size="sm" />
              <span>{r.player.name}</span>
              <strong>{r.score}</strong>
            </li>
          ))}
        </ol>
      )}

      <dl className="bs-stats">
        <div>
          <dt>Letras</dt>
          <dd>
            {game.history.map((h) => (
              <LetterTile key={h.round} letter={h.letter} size="xs" />
            ))}
          </dd>
        </div>
        {bestRound.player && (
          <div>
            <dt>Mejor ronda</dt>
            <dd>
              {bestRound.player.name}: {bestRound.points} puntos con la {bestRound.letter}
            </dd>
          </div>
        )}
      </dl>

      <div className="bs-actions bs-actions--stack">
        <button type="button" className="bs-btn bs-btn--primary bs-btn--xl" ref={rematchRef} onClick={onRematch}>
          ¡Revancha!
        </button>
        <div className="bs-actions-row">
          <button type="button" className="bs-btn bs-btn--secondary" onClick={share}>
            {shared ?? 'Compartir resultado'}
          </button>
          <button type="button" className="bs-btn bs-btn--secondary" onClick={onEditSetup}>
            Cambiar jugadores o categorías
          </button>
        </div>
        <p className="bs-sr" aria-live="polite">
          {shared ?? ''}
        </p>
      </div>
    </div>
  )
}
