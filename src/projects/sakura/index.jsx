import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'motion/react'
import { useCallback, useState } from 'react'
import { Toaster } from 'sonner'
import Detail from './Detail.jsx'
import Discover from './Discover.jsx'
import { Icon } from './icons.jsx'
import ListView, { Hero } from './ListView.jsx'
import { EASE_OUT, SNAPPY } from './motion.js'
import { useList } from './store.js'
import './sakura.css'

const VIEWS = [
  { id: '', label: 'Mi lista', icon: 'list' },
  { id: 'descubrir', label: 'Descubrir', icon: 'compass' },
]

// "#/sakura" es la lista y "#/sakura/descubrir" las recomendaciones.
export default function Sakura({ subpath = '' }) {
  const store = useList()
  const view = subpath === 'descubrir' ? 'descubrir' : ''
  const index = VIEWS.findIndex((v) => v.id === view)
  const [{ prevIndex, dir }, setNav] = useState({ prevIndex: index, dir: 1 })
  const [openId, setOpenId] = useState(null)

  // Dirección según el sentido de la navegación: adelante entra por la derecha, atrás por la izquierda.
  if (prevIndex !== index) setNav({ prevIndex: index, dir: index > prevIndex ? 1 : -1 })

  const go = (id) => window.location.replace(`#/sakura${id ? `/${id}` : ''}`)
  const close = useCallback(() => setOpenId(null), [])

  return (
    // reducedMotion="user": con "reducir movimiento", Motion quita los desplazamientos y deja las opacidades
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <div className="sk">
          <header className="sk-header">
            <div className="sk-wrap sk-header-row">
              <a className="sk-logo" href="#/sakura">
                <Icon name="petal" size={22} /> Sakura List
              </a>
              <nav className="sk-nav" aria-label="Secciones">
                {VIEWS.map((v) => (
                  <a
                    key={v.label}
                    href={`#/sakura${v.id ? `/${v.id}` : ''}`}
                    aria-current={view === v.id ? 'page' : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      go(v.id)
                    }}
                  >
                    {view === v.id && <motion.span layoutId="sk-nav-pill" className="sk-nav-pill" transition={SNAPPY} />}
                    <Icon name={v.icon} size={20} />
                    <span>{v.label}</span>
                  </a>
                ))}
              </nav>
            </div>
          </header>

          <main className="sk-main">
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.div
                key={view || 'lista'}
                custom={dir}
                variants={{
                  enter: (d) => ({ opacity: 0, x: d * 40 }),
                  center: { opacity: 1, x: 0 },
                  exit: (d) => ({ opacity: 0, x: d * -40, transition: { duration: 0.18, ease: EASE_OUT } }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: EASE_OUT }}
              >
                {view === 'descubrir' ? (
                  <Discover store={store} onOpen={setOpenId} />
                ) : (
                  <>
                    <Hero count={store.list.length} watching={store.list.filter((e) => e.status === 'viendo').length} />
                    <ListView store={store} onOpen={setOpenId} />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          <footer className="sk-footer sk-wrap">
            <p>Los animes, sinopsis y carteles de esta demostración son inventados.</p>
            <button type="button" className="sk-text-btn" onClick={store.reset}>
              Restablecer la lista de ejemplo
            </button>
          </footer>

          <Detail id={openId} store={store} onClose={close} />
        </div>

        <Toaster
          theme="dark"
          position="bottom-center"
          offset={24}
          toastOptions={{
            className: 'sk-toast',
            style: {
              background: '#2b1f48',
              color: '#fff1f8',
              border: '1px solid rgba(255, 143, 199, 0.28)',
              fontFamily: "'M PLUS Rounded 1c', system-ui, sans-serif",
              fontSize: '15px',
            },
          }}
        />
      </LayoutGroup>
    </MotionConfig>
  )
}
