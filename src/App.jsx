import { Suspense, useEffect, useState } from 'react'
import Gallery from './gallery/Gallery.jsx'
import { projects } from './projects/registry.js'

// Rutas con hash: "#/" es la galería, "#/<slug>" abre un proyecto
// y "#/<slug>/<subruta>" se pasa al proyecto (p. ej. "#/dayflow/app").
function getRoute() {
  return window.location.hash.replace(/^#\/?/, '')
}

export default function App() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRoute())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const [slug, ...rest] = route.split('/')
  const subpath = rest.join('/')
  const project = projects.find((p) => p.slug === slug)

  useEffect(() => {
    document.documentElement.dataset.page = project ? project.slug : 'gallery'
    document.title = project ? `${project.title} · Skills Gallery` : 'Skills Gallery'
  }, [project])

  if (!project) return <Gallery projects={projects} />

  const Page = project.component
  return (
    <>
      <div className="project-bar">
        <a href="#/">
          <span aria-hidden="true">←</span> Galería
        </a>
        <span>
          Proyecto {project.number} · {project.title}
        </span>
      </div>
      <Suspense fallback={<div className="page-loading">Cargando…</div>}>
        <Page subpath={subpath} />
      </Suspense>
      <BackButton />
    </>
  )
}

// Botón flotante para volver; solo aparece después de bajar una pantalla.
function BackButton() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <a
      className={`back-to-gallery${visible ? ' is-visible' : ''}`}
      href="#/"
      aria-label="Volver a la galería"
      tabIndex={visible ? 0 : -1}
    >
      <span aria-hidden="true">←</span>
      <span className="back-to-gallery-text">Galería</span>
    </a>
  )
}
