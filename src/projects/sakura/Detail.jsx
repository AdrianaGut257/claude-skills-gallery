import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import Cover from './Cover.jsx'
import { STATUSES, animeById } from './data.js'
import { Icon } from './icons.jsx'
import { EASE_OUT, SPRING } from './motion.js'
import { RollingNumber, Stars, StatusMenu } from './motionParts.jsx'

/**
 * Ficha de un anime. El cartel de la tarjeta se transforma en el de la ficha (layoutId):
 * es el mismo objeto que cambia de sitio. El panel entra una vez y su contenido viaja con él.
 */
export default function Detail({ id, store, onClose }) {
  return (
    <AnimatePresence>
      {id && <DetailPanel key={id} id={id} store={store} onClose={onClose} />}
    </AnimatePresence>
  )
}

function DetailPanel({ id, store, onClose }) {
  const a = animeById[id]
  const entry = store.list.find((e) => e.id === id)
  const [trackedAtOpen] = useState(() => Boolean(entry))
  const closeRef = useRef(null)

  // Foco al botón de cerrar y vuelta al disparador al salir.
  useEffect(() => {
    const opener = document.activeElement
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      opener?.focus?.({ preventScroll: true })
    }
  }, [onClose])

  return (
    <div className="sk-detail-layer">
      <motion.div
        className="sk-scrim"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="sk-detail"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sk-detail-title"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16, transition: { duration: 0.2, ease: EASE_OUT } }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
      >
        <motion.div layoutId={`cover-${id}`} className="sk-detail-cover" transition={SPRING}>
          <Cover anime={a} />
        </motion.div>

        <div className="sk-detail-body">
          <div className="sk-detail-top">
            <p className="sk-detail-meta">
              {a.year} · {a.episodes} capítulos
            </p>
            <button ref={closeRef} type="button" className="sk-icon-btn" onClick={onClose} aria-label="Cerrar ficha">
              <Icon name="close" />
            </button>
          </div>
          <h2 id="sk-detail-title" className="sk-detail-title">
            {a.title}
          </h2>
          <p className="sk-detail-es">{a.es}</p>
          <ul className="sk-genres">
            {a.genres.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
          <p className="sk-detail-synopsis">{a.synopsis}</p>

          {entry ? (
            <motion.div
              // Si acabas de añadirlo, el bloque llega en lugar de aparecer de golpe
              initial={trackedAtOpen ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              key="tracked"
              transition={{ duration: 0.25, ease: EASE_OUT }}
            >
              <div className="sk-detail-row">
                <div>
                  <p className="sk-label">Tu puntuación</p>
                  <Stars value={entry.rating} label={`Puntuación de ${a.title}`} onRate={(r) => store.rate(id, r)} />
                </div>
                <div className="sk-detail-status">
                  <p className="sk-label">Estado</p>
                  <div className="sk-status-line">
                    <span className={`sk-dot is-${entry.status}`} aria-hidden="true" />
                    {STATUSES.find((s) => s.id === entry.status).label}
                    <StatusMenu
                      current={entry.status}
                      align="start"
                      onPick={(status) => {
                        const before = { ...entry }
                        store.setStatus(id, status)
                        toast(`${a.title} pasó a ${STATUSES.find((s) => s.id === status).label}`, {
                          action: { label: 'Deshacer', onClick: () => store.restore(before) },
                        })
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="sk-episodes">
                <p className="sk-label">
                  Capítulos vistos: <RollingNumber value={entry.progress} /> de {a.episodes}
                </p>
                <ol className="sk-ep-grid" aria-label="Marca hasta qué capítulo has visto">
                  {Array.from({ length: a.episodes }, (_, i) => {
                    const n = i + 1
                    const seen = n <= entry.progress
                    return (
                      <li key={n}>
                        <button
                          type="button"
                          className={`sk-ep-dot${seen ? ' is-seen' : ''}`}
                          aria-pressed={seen}
                          aria-label={`Capítulo ${n}`}
                          onClick={() => store.setProgress(id, n === entry.progress ? n - 1 : n)}
                        >
                          <motion.span
                            className="sk-ep-dot-fill"
                            initial={false}
                            animate={{ scale: seen ? 1 : 0 }}
                            // Al marcar hasta el 8, los puntos se llenan en ola desde el que estaba
                            transition={{ ...SPRING, delay: seen ? Math.min(Math.max(n - 1 - 0, 0), 12) * 0.012 : 0 }}
                          />
                          <span className="sk-ep-num">{n}</span>
                        </button>
                      </li>
                    )
                  })}
                </ol>
              </div>
            </motion.div>
          ) : (
            <button
              type="button"
              className="sk-btn sk-btn-primary"
              onClick={() => {
                store.add(id)
                toast.success(`${a.title} añadido a Pendiente`)
              }}
            >
              <Icon name="plus" size={20} /> Añadir a mi lista
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
