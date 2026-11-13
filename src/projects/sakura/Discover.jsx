import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import Cover from './Cover.jsx'
import { Icon } from './icons.jsx'
import { EASE_OUT } from './motion.js'
import { genreProfile, recommendations } from './store.js'

// Las barras de géneros solo se animan la primera vez que se abre Descubrir en la visita.
let profileSeen = false
function markProfileSeen() {
  profileSeen = true
}

export default function Discover({ store, onOpen }) {
  const [skipped, setSkipped] = useState([])
  const profile = genreProfile(store.list).slice(0, 5)
  const recs = recommendations(store.list, skipped)
  const [firstVisit] = useState(() => !profileSeen)
  useEffect(() => {
    markProfileSeen()
  }, [])

  const like = (rec) => {
    store.add(rec.anime.id)
    toast.success(`${rec.anime.title} añadido a Pendiente`, {
      action: { label: 'Deshacer', onClick: () => store.remove(rec.anime.id) },
    })
  }
  const pass = (rec) => setSkipped((s) => [...s, rec.anime.id])

  return (
    <section className="sk-section sk-wrap sk-discover" aria-labelledby="sk-discover-title">
      <div className="sk-discover-grid">
        <div>
          <h2 id="sk-discover-title" className="sk-h2">
            Descubrir
          </h2>
          <p className="sk-lead">Recomendaciones según los géneros de tu lista: lo que terminas y puntúas alto pesa más.</p>

          <h3 className="sk-label sk-profile-title">Tus géneros</h3>
          <ol className="sk-profile">
            {profile.map((p, i) => (
              <li key={p.genre}>
                <span className="sk-profile-name">{p.genre}</span>
                <span className="sk-profile-track" aria-hidden="true">
                  <motion.span
                    className="sk-profile-fill"
                    initial={firstVisit ? { scaleX: 0 } : false}
                    animate={{ scaleX: Math.max(p.share, 0.04) }}
                    // El primero (el más importante) sale antes; los huecos se acortan
                    transition={{ duration: 0.7, ease: EASE_OUT, delay: firstVisit ? 0.1 + i * 0.07 - i * i * 0.006 : 0 }}
                  />
                </span>
                <span className="sk-profile-pct">{Math.round(Math.max(p.share, 0) * 100)} %</span>
              </li>
            ))}
          </ol>
        </div>

        <Deck recs={recs} onLike={like} onPass={pass} onOpen={onOpen} onReset={() => setSkipped([])} />
      </div>
    </section>
  )
}

/** Baraja: solo la carta de arriba se arrastra; la de debajo crece según lo lejos que va la de arriba. */
function Deck({ recs, onLike, onPass, onOpen, onReset }) {
  const x = useMotionValue(0)
  const reduce = useReducedMotion()
  const leaving = useRef(false)
  const [top, second, third] = recs

  // Valores enlazados: una sola fuente de verdad (la x de la carta de arriba).
  const rotate = useTransform(x, [-260, 260], [-14, 14])
  const likeOpacity = useTransform(x, [30, 130], [0, 1])
  const passOpacity = useTransform(x, [-130, -30], [1, 0])
  const nextScale = useTransform(x, [-220, 0, 220], [1, 0.94, 1])
  const nextY = useTransform(x, [-220, 0, 220], [0, 14, 0])

  const fly = async (dir, velocity = 0) => {
    if (!top || leaving.current) return
    leaving.current = true
    const rec = top
    const target = dir * (window.innerWidth * 0.75 + 200)
    if (reduce) {
      x.set(0)
    } else {
      // Sale con la velocidad con la que la soltaste
      await animate(x, target, { type: 'spring', velocity, stiffness: 260, damping: 32, restDelta: 40 })
    }
    if (dir > 0) onLike(rec)
    else onPass(rec)
    x.jump(0)
    leaving.current = false
  }

  if (!top) {
    return (
      <motion.div
        className="sk-deck sk-deck-empty"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
      >
        <Icon name="petal" size={36} />
        <p>Ya viste todas las recomendaciones.</p>
        <button type="button" className="sk-btn sk-btn-ghost" onClick={onReset}>
          Volver a verlas
        </button>
      </motion.div>
    )
  }

  return (
    <div
      className="sk-deck-wrap"
      tabIndex={0}
      aria-label="Recomendaciones. Flecha derecha: me interesa. Flecha izquierda: paso."
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') fly(1)
        if (e.key === 'ArrowLeft') fly(-1)
      }}
    >
      <div className="sk-deck">
        {third && <DeckCard key={third.anime.id} rec={third} className="is-third" />}
        {second && (
          <motion.div key={second.anime.id} className="sk-deck-slot" style={{ scale: nextScale, y: nextY }}>
            <DeckCard rec={second} />
          </motion.div>
        )}
        <motion.div
          key={top.anime.id}
          className="sk-deck-slot is-top"
          style={{ x, rotate }}
          drag="x"
          dragMomentum={false} // la salida la decide onDragEnd con la velocidad real
          onDragEnd={(e, info) => {
            const { offset, velocity } = info
            if (offset.x > 120 || velocity.x > 650) fly(1, velocity.x)
            else if (offset.x < -120 || velocity.x < -650) fly(-1, velocity.x)
            else animate(x, 0, { type: 'spring', stiffness: 520, damping: 34, velocity: velocity.x }) // vuelta rápida
          }}
          initial={{ scale: 0.94, y: 14 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
        >
          <DeckCard rec={top} onOpen={onOpen} />
          <motion.span className="sk-stamp is-like" style={{ opacity: likeOpacity }} aria-hidden="true">
            Me interesa
          </motion.span>
          <motion.span className="sk-stamp is-pass" style={{ opacity: passOpacity }} aria-hidden="true">
            Paso
          </motion.span>
        </motion.div>
      </div>

      <div className="sk-deck-actions">
        <button type="button" className="sk-round-btn is-pass" onClick={() => fly(-1)} aria-label={`Pasar de ${top.anime.title}`}>
          <Icon name="x" size={26} />
        </button>
        <button type="button" className="sk-round-btn is-like" onClick={() => fly(1)} aria-label={`Me interesa ${top.anime.title}`}>
          <Icon name="heart" size={26} />
        </button>
      </div>
      <p className="sk-deck-hint">Arrastra la carta o usa los botones · {recs.length} por ver</p>
    </div>
  )
}

function DeckCard({ rec, onOpen, className = '' }) {
  const a = rec.anime
  return (
    <article className={`sk-deck-card ${className}`}>
      <div className="sk-deck-cover">
        <Cover anime={a} />
      </div>
      <div className="sk-deck-body">
        <p className="sk-because">Porque te gusta {rec.because}</p>
        <h3>{a.title}</h3>
        <p className="sk-deck-es">
          {a.es} · {a.episodes} capítulos
        </p>
        <p className="sk-deck-syn">{a.synopsis}</p>
        {onOpen && (
          <button type="button" className="sk-text-btn" onClick={() => onOpen(a.id)} onPointerDownCapture={(e) => e.stopPropagation()}>
            Ver ficha
          </button>
        )}
      </div>
    </article>
  )
}
