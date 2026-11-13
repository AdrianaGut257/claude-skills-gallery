import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { STATUSES } from './data.js'
import { Icon } from './icons.jsx'
import { EASE_OUT } from './motion.js'

/**
 * Número que rueda: el valor nuevo entra desde abajo al subir y desde arriba al bajar.
 * La dirección viaja por "custom" para que la salida use la dirección nueva (choreograph, paso 5).
 */
export function RollingNumber({ value, className = '' }) {
  const [track, setTrack] = useState({ value, dir: 1 })
  if (track.value !== value) setTrack({ value, dir: value > track.value ? 1 : -1 })
  const dir = track.value === value ? track.dir : value > track.value ? 1 : -1

  return (
    <span className={`sk-roll ${className}`}>
      <AnimatePresence mode="popLayout" initial={false} custom={dir}>
        <motion.span
          key={value}
          custom={dir}
          variants={{
            enter: (d) => ({ y: d > 0 ? '70%' : '-70%', opacity: 0 }),
            center: { y: 0, opacity: 1 },
            exit: (d) => ({ y: d > 0 ? '-70%' : '70%', opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: EASE_OUT }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/**
 * Ráfaga de pétalos para celebrar (nivel "raro": terminar un anime).
 * Las piezas salen del centro a la vez, con distancias y giros distintos: un solo gesto, no una cola.
 */
export function PetalBurst({ fire }) {
  const pieces = 14
  return (
    <AnimatePresence>
      {fire > 0 && (
        <motion.span key={fire} className="sk-burst" aria-hidden="true" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {Array.from({ length: pieces }, (_, i) => {
            const a = (i / pieces) * Math.PI * 2 + (i % 2) * 0.2
            const d = 46 + ((i * 37) % 30)
            return (
              <motion.span
                key={i}
                className="sk-burst-petal"
                style={{ '--c': ['#ff8fc7', '#ffd6ea', '#8fd3ff', '#fff1f8'][i % 4] }}
                initial={{ x: 0, y: 0, scale: 0.6, rotate: 0, opacity: 1 }}
                animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d + 10, scale: 1, rotate: (i % 2 ? 1 : -1) * 220, opacity: 0 }}
                transition={{ duration: 0.9, ease: EASE_OUT }}
              />
            )
          })}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

/**
 * Puntuación con estrellas. La que pulsas salta con un resorte y suelta tres destellos
 * que terminan con ella (choreograph, paso 3: los acentos aterrizan con el principal).
 */
export function Stars({ value, onRate, label }) {
  const [popped, setPopped] = useState(0)
  const [hover, setHover] = useState(0)
  const shown = hover || value
  return (
    <div className="sk-stars" role="radiogroup" aria-label={label} onPointerLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
          className={`sk-star${n <= shown ? ' is-on' : ''}`}
          onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(n)}
          onClick={() => {
            onRate(value === n ? 0 : n)
            setPopped(value === n ? 0 : n)
          }}
        >
          <motion.span
            key={popped === n ? `pop-${n}-${value}` : `s-${n}`}
            className="sk-star-shape"
            initial={popped === n ? { scale: 0.7 } : false}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.5 }}
          >
            <Icon name="star" size={26} />
          </motion.span>
          {popped === n && value === n && (
            <span className="sk-star-sparks" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={`${value}-${i}`}
                  className="sk-spark"
                  style={{ rotate: -50 + i * 50 }}
                  initial={{ scaleY: 0, opacity: 1, y: -14 }}
                  animate={{ scaleY: [0, 1, 0], opacity: [1, 1, 0], y: -22 }}
                  transition={{ duration: 0.42, delay: i * 0.04, times: [0, 0.6, 1], ease: EASE_OUT }}
                />
              ))}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

/**
 * Menú para cambiar de estado. Sale desde su botón (transform-origin en el disparador),
 * 160 ms ease-out, y se va más rápido de lo que entra. Sin escalonar sus filas: se usa a menudo.
 */
export function StatusMenu({ current, onPick, align = 'end' }) {
  const [open, setOpen] = useState(false)
  const wrap = useRef(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onDown = (e) => !wrap.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="sk-menu-wrap" ref={wrap}>
      <button
        type="button"
        className="sk-icon-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label="Cambiar estado"
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="more" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={menuId}
            role="menu"
            className={`sk-menu is-${align}`}
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.16, ease: EASE_OUT } }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.1, ease: EASE_OUT } }}
          >
            {STATUSES.map((s) => (
              <li key={s.id} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={current === s.id}
                  onClick={() => {
                    setOpen(false)
                    if (s.id !== current) onPick(s.id)
                  }}
                >
                  <span className={`sk-dot is-${s.id}`} aria-hidden="true" />
                  {s.label}
                  {current === s.id && <Icon name="check" size={18} />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
