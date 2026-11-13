import { useEffect, useRef } from 'react'
import { SEED_PROJECTS } from './data.js'
import { Icon } from './icons.jsx'
import { mountKit } from './kit.js'
import { Overview } from './views.jsx'

const ICONS = `${import.meta.env.BASE_URL}pulso/kit/icons/`

// Diagrama "fanin" de la skill: de dónde vienen los datos y adónde llegan.
const DIAGRAM = {
  layout: 'fanin',
  alt: 'Las horas de las hojas de cálculo, las entregas de GitHub y los clientes de MySQL llegan a una API en Node.js y de ahí al panel en Vue, en vivo.',
  sources: [
    { label: 'Hojas de cálculo', icon: 'google-sheets', sub: 'Horas del equipo' },
    { label: 'GitHub', icon: 'github', sub: 'Entregas' },
    { label: 'MySQL', icon: 'mysql', sub: 'Clientes y facturas' },
  ],
  target: { label: 'API REST', icon: 'nodejs', sub: 'Node.js en Docker' },
  then: { label: 'Panel', icon: 'vue', meta: 'en vivo' },
}

function scrollTo(e, id) {
  e.preventDefault()
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

export default function Landing() {
  const root = useRef(null)

  useEffect(() => {
    mountKit(root.current).catch(() => {
      /* si el kit no carga, todo queda en su estado final: cifras y frase legibles */
    })
  }, [])

  return (
    <div className="gs-site" ref={root} data-icon-base={ICONS}>
      <header className="gs-site-nav">
        <div className="gs-wrap gs-site-nav-row">
          <a className="gs-brand is-light" href="#/pulso">
            <span className="gs-brand-mark" aria-hidden="true">
              P
            </span>
            Pulso
          </a>
          <nav aria-label="Secciones">
            <a href="#funciones" onClick={(e) => scrollTo(e, 'funciones')}>
              Funciones
            </a>
            <a href="#arquitectura" onClick={(e) => scrollTo(e, 'arquitectura')}>
              Cómo funciona
            </a>
          </nav>
          <a className="gs-btn gs-btn-primary is-small" href="#/pulso/panel">
            Abrir el panel
          </a>
        </div>
      </header>

      <main>
        {/* Portada: sola en la primera pantalla, con el producto de verdad funcionando */}
        <section className="gs-hero" aria-labelledby="gs-hero-title">
          <div className="gs-wrap gs-hero-grid">
            <div className="gs-hero-copy">
              <h1 id="gs-hero-title" className="gs-in" style={{ '--d': 0 }}>
                Panel de proyectos, clientes y reportes para equipos de software
              </h1>
              <p className="gs-lead gs-in" style={{ '--d': 1 }}>
                Pulso junta lo que antes vivía en hojas de cálculo sueltas: el estado de cada proyecto, la salud de
                cada cliente y el reporte de la semana.
              </p>
              <p className="gs-fact gs-in" style={{ '--d': 2 }}>
                <Icon name="clock" size={18} /> Los reportes semanales tardan un 70 % menos que con hojas de cálculo.
              </p>
              <div className="gs-actions gs-in" style={{ '--d': 3 }}>
                <a className="gs-btn gs-btn-primary" href="#/pulso/panel">
                  Abrir el panel <Icon name="arrowRight" size={18} />
                </a>
                <a className="gs-btn gs-btn-ghost is-on-dark" href="#arquitectura" onClick={(e) => scrollTo(e, 'arquitectura')}>
                  Ver cómo funciona
                </a>
              </div>
            </div>

            <div className="gs-frame gs-in" style={{ '--d': 2 }} aria-label="El panel de Pulso, en vivo" role="group">
              <div className="gs-frame-bar" aria-hidden="true">
                <span />
                <span />
                <span />
                <p>admin.pulso.example</p>
              </div>
              <div className="gs-frame-body">
                <Overview projects={SEED_PROJECTS} onOpenProject={() => (window.location.hash = '#/pulso/panel/proyectos')} go={() => {}} compact />
              </div>
            </div>
          </div>
        </section>

        {/* Momento 1 (word-highlight): la frase se ilumina palabra a palabra al cruzar la pantalla */}
        <section className="gs-section gs-statement" data-moment="word-highlight" aria-label="El problema que resuelve">
          <div className="container gs-wrap">
            <p className="mo-wh__text">
              Antes, el estado de cada proyecto vivía en cinco hojas de cálculo y nadie sabía cuál era la buena. Ahora vive
              en <strong>un solo panel</strong> que todo el equipo mira a la vez.
            </p>
          </div>
        </section>

        <section id="funciones" className="gs-section" aria-labelledby="gs-feat-title">
          <div className="gs-wrap">
            <h2 id="gs-feat-title" className="gs-h2">
              Lo que el equipo mira cada mañana
            </h2>
            <ul className="gs-feats">
              <li className="gs-feat">
                <div className="gs-feat-ui" aria-hidden="true">
                  <p className="gs-frag-head">
                    En riesgo <span className="gs-count is-warn">2</span>
                  </p>
                  <p className="gs-frag-row">
                    <Icon name="alert" size={16} /> <strong>Inventario de farmacias</strong>
                    <span>Quedan 22 h para el 46 % del trabajo</span>
                  </p>
                  <p className="gs-frag-row">
                    <Icon name="alert" size={16} /> <strong>Rastreo de flota</strong>
                    <span>La API del GPS sigue sin acceso</span>
                  </p>
                </div>
                <h3>Los riesgos, antes de la entrega</h3>
                <p>Un proyecto pasa a «en riesgo» con su motivo escrito: horas que se acaban, accesos que faltan, fechas que no llegan.</p>
              </li>
              <li className="gs-feat">
                <div className="gs-feat-ui" aria-hidden="true">
                  <p className="gs-frag-head">Avance semanal</p>
                  <ol className="gs-frag-steps">
                    <li className="is-done">
                      <Icon name="check" size={14} /> Leyendo 1.240 registros de horas
                    </li>
                    <li className="is-done">
                      <Icon name="check" size={14} /> Agrupando por proyecto
                    </li>
                    <li className="is-now">Calculando el desvío frente al plan</li>
                  </ol>
                </div>
                <h3>El reporte de la semana en segundos</h3>
                <p>Avance, horas por cliente o proyectos en riesgo, listos para descargar en CSV y pegar en el correo del lunes.</p>
              </li>
              <li className="gs-feat">
                <div className="gs-feat-ui" aria-hidden="true">
                  <p className="gs-frag-head">Clientes por salud</p>
                  <p className="gs-frag-health is-bad">
                    <span>Clínica Ceibo Sur</span>
                    <b>38</b>
                  </p>
                  <p className="gs-frag-health is-warn">
                    <span>Transportes Q&apos;ochala</span>
                    <b>48</b>
                  </p>
                  <p className="gs-frag-health is-ok">
                    <span>Colegio Nuevo Horizonte</span>
                    <b>91</b>
                  </p>
                </div>
                <h3>Clientes que piden atención, arriba</h3>
                <p>Último contacto, facturas abiertas y proyectos activos dan una salud de 0 a 100 para cada cliente.</p>
              </li>
            </ul>
          </div>
        </section>

        <section id="arquitectura" className="gs-section gs-arch" aria-labelledby="gs-arch-title">
          <div className="gs-wrap gs-arch-grid">
            <div>
              <h2 id="gs-arch-title" className="gs-h2">
                Cómo llegan los datos al panel
              </h2>
              <p className="gs-lead is-dark">
                Las horas, las entregas y los clientes se leen de donde ya estaban. Una API REST en Node.js los junta y el
                panel en Vue los muestra en vivo, todo dentro de contenedores Docker.
              </p>
              <ul className="gs-stack" aria-label="Tecnologías">
                {[
                  ['vue', 'Vue'],
                  ['nodejs', 'Node.js'],
                  ['mysql', 'MySQL'],
                  ['docker', 'Docker'],
                ].map(([icon, label]) => (
                  <li key={icon}>
                    <img src={`${ICONS}${icon}.svg`} alt="" width="22" height="22" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="gs-arch-card">
              <div className="dg" data-diagram={JSON.stringify(DIAGRAM)} role="img" aria-label={DIAGRAM.alt} />
            </div>
          </div>
        </section>

        {/* Momento 2 (counter-rolls): las cifras del caso giran una vez, como un cuentakilómetros */}
        <section className="gs-section gs-figures" aria-labelledby="gs-fig-title">
          <div className="gs-wrap">
            <h2 id="gs-fig-title" className="gs-h2">
              Lo que cambió en el equipo
            </h2>
            <div className="gs-figs" data-moment="counter-rolls">
              <div>
                <p className="t-stat">70 %</p>
                <p>menos tiempo para preparar los reportes semanales</p>
              </div>
              <div>
                <p className="t-stat">10</p>
                <p>semanas desde el modelo de datos hasta el despliegue</p>
              </div>
            </div>
          </div>
        </section>

        <section className="gs-section gs-close" aria-labelledby="gs-close-title">
          <div className="gs-wrap">
            <h2 id="gs-close-title">Abre el panel y prueba con datos de ejemplo</h2>
            <a className="gs-btn gs-btn-primary" href="#/pulso/panel">
              Abrir el panel <Icon name="arrowRight" size={18} />
            </a>
          </div>
        </section>
      </main>

      <footer className="gs-site-foot">
        <div className="gs-wrap">
          <p>
            Pulso es un caso de portafolio. Las empresas, personas y cifras del panel son inventadas. Logos de Vue,
            Node.js, MySQL, Docker, GitHub y Google Sheets: Simple Icons.
          </p>
        </div>
      </footer>
    </div>
  )
}
