import { useEffect, useId, useRef, useState } from 'react'
import { subjectById } from './data.js'
import { Icon } from './icons.jsx'

/**
 * Pantalla con barra superior de Material 3: el título grande va en el contenido y,
 * al hacer scroll, aparece pequeño en la barra (que además cambia de color).
 */
export function Screen({ title, barTitle = title, eyebrow, actions, children, className = '' }) {
  const scrollRef = useRef(null)
  const sentinelRef = useRef(null)
  const [compact, setCompact] = useState(false)
  const headingId = useId()

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setCompact(!entry.isIntersecting), {
      root: scrollRef.current,
    })
    io.observe(sentinelRef.current)
    return () => io.disconnect()
  }, [])

  return (
    <section className={`ua-screen ${className}`} ref={scrollRef} aria-labelledby={headingId}>
      <header className={`ua-topbar${compact ? ' is-compact' : ''}`}>
        <span className="ua-topbar-title" aria-hidden="true">
          {barTitle}
        </span>
        {actions && <div className="ua-topbar-actions">{actions}</div>}
      </header>
      <div className="ua-hero">
        {eyebrow && <p className="ua-eyebrow">{eyebrow}</p>}
        <h1 id={headingId} className="ua-headline">
          {title}
        </h1>
        <span ref={sentinelRef} className="ua-sentinel" aria-hidden="true" />
      </div>
      <div className="ua-content">{children}</div>
    </section>
  )
}

/** Hoja inferior modal. Siempre montada: entra y sale con CSS, y queda inerte cuando está cerrada. */
export function Sheet({ open, onClose, title, children }) {
  const sheetRef = useRef(null)
  const returnTo = useRef(null)
  const titleId = useId()

  useEffect(() => {
    if (open) {
      returnTo.current = document.activeElement
      const first = sheetRef.current?.querySelector('input, select, textarea, [data-autofocus]')
      ;(first ?? sheetRef.current)?.focus({ preventScroll: true })
    } else if (returnTo.current) {
      returnTo.current.focus?.({ preventScroll: true })
      returnTo.current = null
    }
  }, [open])

  return (
    <div className={`ua-sheet-layer${open ? ' is-open' : ''}`} inert={!open}>
      <div className="ua-scrim" onClick={onClose} aria-hidden="true" />
      <div
        ref={sheetRef}
        className="ua-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
      >
        <div className="ua-sheet-handle" aria-hidden="true" />
        <div className="ua-sheet-head">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="ua-icon-btn" onClick={onClose} aria-label="Cerrar">
            <Icon name="close" />
          </button>
        </div>
        <div className="ua-sheet-body">{children}</div>
      </div>
    </div>
  )
}

export function Snackbar({ message, actionLabel, onAction }) {
  return (
    <div className={`ua-snackbar${message ? ' is-visible' : ''}`} role="status" aria-live="polite">
      {message && (
        <>
          <span>{message}</span>
          {actionLabel && (
            <button type="button" onClick={onAction}>
              {actionLabel}
            </button>
          )}
        </>
      )}
    </div>
  )
}

export function SubjectTag({ id, full = false }) {
  const s = subjectById[id]
  return <span className={`ua-tag ua-tone-${s.tone}`}>{full ? s.name : s.code}</span>
}

export function Switch({ checked, onChange, label, labelledBy }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-labelledby={labelledBy}
      className="ua-switch"
      onClick={() => onChange(!checked)}
    >
      <span className="ua-switch-thumb">{checked && <Icon name="check" size={14} />}</span>
    </button>
  )
}

/** Anillo de progreso en SVG. value entre 0 y 1. */
export function Ring({ value, size = 56, stroke = 6, className = '', children }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const v = Math.max(0, Math.min(1, value))
  return (
    <div className={`ua-ring ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle className="ua-ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none" />
        <circle
          className="ua-ring-value"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {children && <div className="ua-ring-label">{children}</div>}
    </div>
  )
}
