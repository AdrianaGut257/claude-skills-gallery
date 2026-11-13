import { useCallback, useEffect, useState } from 'react'
import { Toaster, toast } from 'sonner'
import { Drawer } from 'vaul'
import { SEED_PROJECTS, STATUS, TEAM, bs, clientById, dueLabel, fmt } from './data.js'
import { Icon } from './icons.jsx'
import { Avatar, Clients, Overview, Projects, Reports, Segmented, StatusBadge } from './views.jsx'

const NAV = [
  { id: '', label: 'Resumen', icon: 'overview' },
  { id: 'proyectos', label: 'Proyectos', icon: 'projects' },
  { id: 'clientes', label: 'Clientes', icon: 'clients' },
  { id: 'reportes', label: 'Reportes', icon: 'reports' },
]

const KEY = 'pulso-projects-v1'

function useProjects() {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY))
      if (Array.isArray(saved) && saved.length === SEED_PROJECTS.length) return saved
    } catch {
      /* sin almacenamiento */
    }
    return SEED_PROJECTS
  })
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(projects))
    } catch {
      /* modo privado */
    }
  }, [projects])
  return [projects, setProjects]
}

function useWide(query = '(min-width: 900px)') {
  const [wide, setWide] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return wide
}

export default function Panel({ view = '' }) {
  const [projects, setProjects] = useProjects()
  const wide = useWide()
  const current = NAV.some((n) => n.id === view) ? view : ''
  // El cajón pertenece a la sección donde se abrió: al cambiar de sección se cierra solo.
  const [open, setOpen] = useState({ id: null, view: current })
  const openId = open.view === current ? open.id : null
  const setOpenId = useCallback((id) => setOpen({ id, view: current }), [current])

  // Navegar entre secciones se hace cien veces al día: cambio inmediato, sin animación.
  const go = useCallback((id) => window.location.replace(`#/pulso/panel${id ? `/${id}` : ''}`), [])
  const notify = useCallback((msg, opts) => toast(msg, opts), [])

  const setStatus = (id, status) => {
    const before = projects.find((p) => p.id === id)
    setProjects((ps) =>
      ps.map((p) => (p.id === id ? { ...p, status, progress: status === 'entregado' ? 100 : p.progress } : p)),
    )
    toast(`${before.name}: ${STATUS[status].label}`, {
      action: { label: 'Deshacer', onClick: () => setProjects((ps) => ps.map((p) => (p.id === id ? before : p))) },
    })
  }

  const project = projects.find((p) => p.id === openId)

  return (
    <div className="gs-app">
      <aside className="gs-side" aria-label="Navegación del panel">
        <a className="gs-brand" href="#/pulso">
          <span className="gs-brand-mark" aria-hidden="true">
            P
          </span>
          Pulso
        </a>
        <nav className="gs-nav">
          {NAV.map((n) => (
            <a
              key={n.label}
              href={`#/pulso/panel${n.id ? `/${n.id}` : ''}`}
              aria-current={current === n.id ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault()
                go(n.id)
              }}
            >
              <Icon name={n.icon} />
              <span>{n.label}</span>
              {n.id === 'proyectos' && (
                <span className="gs-nav-count" aria-label={`${projects.filter((p) => p.status === 'riesgo').length} en riesgo`}>
                  {projects.filter((p) => p.status === 'riesgo').length}
                </span>
              )}
            </a>
          ))}
        </nav>
        <div className="gs-side-foot">
          <Avatar id="elena" size={32} />
          <span>
            <strong>{TEAM.elena.name}</strong>
            <span>{TEAM.elena.role}</span>
          </span>
        </div>
      </aside>

      <main className="gs-main">
        <div className="gs-topbar">
          <p className="gs-demo">
            <Icon name="pulse" size={16} /> Datos de demostración
          </p>
          <a className="gs-link" href="#/pulso">
            Web de Pulso <Icon name="external" size={15} />
          </a>
        </div>

        {current === '' && <Overview projects={projects} onOpenProject={setOpenId} go={go} />}
        {current === 'proyectos' && <Projects projects={projects} onOpenProject={setOpenId} />}
        {current === 'clientes' && <Clients projects={projects} />}
        {current === 'reportes' && <Reports projects={projects} notify={notify} />}
      </main>

      <Drawer.Root open={Boolean(project)} onOpenChange={(v) => !v && setOpenId(null)} direction={wide ? 'right' : 'bottom'}>
        <Drawer.Portal>
          <Drawer.Overlay className="gs-overlay" />
          <Drawer.Content className={`gs-drawer ${wide ? 'is-side' : 'is-sheet'}`} aria-describedby={undefined}>
            {project && <ProjectDetail project={project} onStatus={(s) => setStatus(project.id, s)} />}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'gs-toast',
          style: { fontFamily: "'Onest', system-ui, sans-serif", fontSize: '14px' },
        }}
      />
    </div>
  )
}

function ProjectDetail({ project: p, onStatus }) {
  const c = clientById[p.client]
  const lead = TEAM[p.lead]
  const used = Math.round((p.hoursUsed / p.hoursBudget) * 100)
  return (
    <div className="gs-detail">
      <header className="gs-detail-head">
        <div>
          <p className="gs-sub">{c.name}</p>
          <Drawer.Title className="gs-detail-title">{p.name}</Drawer.Title>
        </div>
        <Drawer.Close className="gs-icon-btn" aria-label="Cerrar">
          <Icon name="close" />
        </Drawer.Close>
      </header>

      <div className="gs-detail-body" data-vaul-no-drag>
        <StatusBadge status={p.status} />
        {p.risk && (
          <p className="gs-detail-risk">
            <Icon name="alert" size={18} /> {p.risk}
          </p>
        )}

        <dl className="gs-facts">
          <div>
            <dt>Avance</dt>
            <dd>
              <span className="gs-progress is-big" aria-hidden="true">
                <span style={{ transform: `scaleX(${p.progress / 100})` }} />
              </span>
              {p.progress} %
            </dd>
          </div>
          <div>
            <dt>Horas</dt>
            <dd className={used > 100 ? 'is-over' : ''}>
              {fmt(p.hoursUsed)} de {fmt(p.hoursBudget)} ({used} %)
            </dd>
          </div>
          <div>
            <dt>Entrega</dt>
            <dd>{dueLabel(p.due)}</dd>
          </div>
          <div>
            <dt>Responsable</dt>
            <dd className="gs-person">
              <Avatar id={p.lead} size={24} /> {lead.name} · {lead.role}
            </dd>
          </div>
          <div>
            <dt>Coste estimado</dt>
            <dd>{bs(p.hoursUsed * 180)}</dd>
          </div>
        </dl>

        <p className="gs-label">Cambiar estado</p>
        <Segmented
          options={Object.entries(STATUS).map(([id, s]) => ({ id, label: s.label }))}
          value={p.status}
          onChange={(s) => s !== p.status && onStatus(s)}
          label="Estado del proyecto"
          size="sm"
        />
      </div>
    </div>
  )
}
