import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { toast } from 'sonner'
import Cover from './Cover.jsx'
import { STATUSES, animeById } from './data.js'
import { Icon } from './icons.jsx'
import { EASE_OUT, SNAPPY, SPRING } from './motion.js'
import { PetalBurst, RollingNumber, StatusMenu } from './motionParts.jsx'
import Petals from './Petals.jsx'

/* ---------- Portada ---------- */

// Retrasos que se acortan letra a letra (45 → 25 ms): una ola que acelera, no un metrónomo.
const letterDelay = (i) => 0.045 * i - 0.0012 * i * i

function SplitWord({ text, start, className = '' }) {
  return (
    <span className={`sk-word ${className}`} aria-hidden="true">
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          className="sk-letter"
          initial={{ y: '40%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: start + Math.max(letterDelay(i), 0) }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

export function Hero({ count, watching }) {
  const reduce = useReducedMotion()
  const rise = (delay, y) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
      : { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: EASE_OUT, delay } }

  return (
    <section className="sk-hero" aria-labelledby="sk-title">
      <Petals />
      <div className="sk-wrap sk-hero-inner">
        <h1 id="sk-title" className="sk-title">
          <span className="sk-visually-hidden">Sakura List</span>
          <SplitWord text="Sakura" start={0} className="is-pink" />
          <SplitWord text="List" start={0.18} />
        </h1>
        <motion.p className="sk-hero-sub" {...rise(0.32, 8)}>
          Tu lista de anime: lo que ves, lo que terminaste y lo próximo, con recomendaciones según tus géneros.
        </motion.p>
        <motion.p className="sk-hero-stats" {...rise(0.4, 6)}>
          <span>
            <strong>{count}</strong> en tu lista
          </span>
          <span>
            <strong>{watching}</strong> viendo ahora
          </span>
          <span className="sk-hero-hint">
            <Icon name="petal" size={18} /> Mueve el ratón: los pétalos sienten el viento
          </span>
        </motion.p>
      </div>
    </section>
  )
}

/* ---------- Lista ---------- */

export default function ListView({ store, onOpen }) {
  const [tab, setTab] = useState('viendo')
  const items = store.list.filter((e) => e.status === tab)
  const counts = Object.fromEntries(STATUSES.map((s) => [s.id, store.list.filter((e) => e.status === s.id).length]))

  return (
    <section className="sk-section sk-wrap" aria-labelledby="sk-list-title">
      <h2 id="sk-list-title" className="sk-h2">
        Mi lista
      </h2>

      {/* El indicador es un solo objeto que viaja entre pestañas (layoutId) */}
      <div className="sk-tabs" role="tablist" aria-label="Estado">
        {STATUSES.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={tab === s.id}
            className="sk-tab"
            onClick={() => setTab(s.id)}
          >
            {tab === s.id && <motion.span layoutId="sk-tab-pill" className="sk-tab-pill" transition={SNAPPY} />}
            <span className="sk-tab-label">
              {s.label} <span className="sk-tab-count">{counts[s.id]}</span>
            </span>
          </button>
        ))}
      </div>

      <motion.ul className="sk-grid" role="tabpanel" layout>
        {/* popLayout: la tarjeta que se va deja de ocupar sitio al instante y las demás cierran el hueco mientras se desvanece */}
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((entry) => (
            <AnimeCard key={entry.id} entry={entry} store={store} onOpen={onOpen} />
          ))}
        </AnimatePresence>
      </motion.ul>

      {items.length === 0 && (
        <motion.p className="sk-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          No hay nada en «{STATUSES.find((s) => s.id === tab).label}». Busca algo nuevo en Descubrir.
        </motion.p>
      )}
    </section>
  )
}

function AnimeCard({ entry, store, onOpen }) {
  const a = animeById[entry.id]
  const [burst, setBurst] = useState(0)
  const done = entry.progress >= a.episodes

  const step = () => {
    const next = entry.progress + 1
    store.setProgress(a.id, next)
    if (next === a.episodes) {
      setBurst((b) => b + 1)
      toast.success(`Terminaste ${a.title}`, {
        description: `${a.episodes} de ${a.episodes} capítulos`,
        action: { label: 'Pasar a Completado', onClick: () => store.setStatus(a.id, 'completado') },
      })
    }
  }

  const move = (status) => {
    const before = { ...entry }
    store.setStatus(a.id, status)
    toast(`${a.title} pasó a ${STATUSES.find((s) => s.id === status).label}`, {
      action: { label: 'Deshacer', onClick: () => store.restore(before) },
    })
  }

  return (
    <motion.li
      layout
      className="sk-card"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15, ease: EASE_OUT } }}
      transition={{ ...SPRING, opacity: { duration: 0.2 } }}
    >
      <button type="button" className="sk-card-open" onClick={() => onOpen(a.id)} aria-label={`Ver ficha de ${a.title}`}>
        <motion.span layoutId={`cover-${a.id}`} className="sk-card-cover" transition={SPRING}>
          <Cover anime={a} />
        </motion.span>
      </button>

      <div className="sk-card-body">
        <div className="sk-card-head">
          <div>
            <h3 className="sk-card-title">{a.title}</h3>
            <p className="sk-card-es">{a.es}</p>
          </div>
          <StatusMenu current={entry.status} onPick={move} />
        </div>

        <div className="sk-progress">
          <div className="sk-bar" aria-hidden="true">
            <motion.span
              className="sk-bar-fill"
              initial={false}
              animate={{ scaleX: entry.progress / a.episodes }}
              transition={SPRING}
            />
          </div>
          <div className="sk-ep">
            <span className="sk-ep-count" aria-label={`Capítulo ${entry.progress} de ${a.episodes}`}>
              <RollingNumber value={entry.progress} />
              <span className="sk-ep-total">/ {a.episodes}</span>
            </span>
            <span className="sk-ep-btn-wrap">
              <button
                type="button"
                className="sk-ep-btn"
                onClick={step}
                disabled={done}
                aria-label={done ? 'Todos los capítulos vistos' : `Marcar el capítulo ${entry.progress + 1} como visto`}
              >
                {done ? <Icon name="check" size={20} /> : <Icon name="plus" size={20} />}
              </button>
              <PetalBurst fire={burst} />
            </span>
          </div>
        </div>
      </div>
    </motion.li>
  )
}
