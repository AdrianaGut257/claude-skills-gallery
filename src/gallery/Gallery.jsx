import './gallery.css'

const dateFormat = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

export default function Gallery({ projects }) {
  const skillCount = new Set(projects.flatMap((p) => p.skills)).size
  const nextNumber = String(projects.length + 1).padStart(2, '0')

  return (
    <div className="gl">
      <div className="gl-inner">
        <div className="gl-top">
          <span>Claude Skills Gallery</span>
          <span>Skills de wondelai</span>
        </div>

        <header className="gl-header">
          <h1 className="gl-title">
            Laboratorio <em>de skills</em>
          </h1>
          <div className="gl-aside">
            <p className="gl-intro">
              Proyectos de prueba creados con skills de Claude. Cada uno indica qué skills se
              usaron. Elige uno para abrirlo.
            </p>
            <dl className="gl-stats">
              <div>
                <dt>Proyectos</dt>
                <dd>{projects.length}</dd>
              </div>
              <div>
                <dt>Skills usadas</dt>
                <dd>{skillCount}</dd>
              </div>
            </dl>
          </div>
        </header>

        <main>
          <div className="gl-section-head">
            <h2>Proyectos</h2>
            <span>{projects.length} en total</span>
          </div>

          <ul className="gl-grid">
            {projects.map((p) => (
              <li key={p.slug}>
                <a className="gl-card" href={`#/${p.slug}`}>
                  <div
                    className="gl-preview"
                    style={{
                      '--pv-bg': p.preview.bg,
                      '--pv-fg': p.preview.fg,
                      '--pv-deco': p.preview.deco,
                      '--pv-font': p.preview.font,
                    }}
                  >
                    <span className="gl-preview-text">{p.preview.text}</span>
                  </div>
                  <div className="gl-card-body">
                    <div className="gl-meta">
                      <span>{p.number}</span>
                      <span>{p.kind}</span>
                      <time dateTime={p.date}>{dateFormat.format(new Date(p.date))}</time>
                    </div>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    <ul className="gl-tags" aria-label="Skills usadas">
                      {p.skills.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                    <span className="gl-open">
                      Abrir proyecto <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </a>
              </li>
            ))}

            <li className="gl-empty">
              <span className="gl-empty-num">{nextNumber}</span>
              <p>Próximo proyecto</p>
              <span className="gl-empty-hint">
                Se añade en <code>src/projects/registry.js</code>
              </span>
            </li>
          </ul>
        </main>

        <footer className="gl-footer">
          <span>Cada proyecto vive en su carpeta: <code>src/projects/&lt;nombre&gt;/</code></span>
          <span>© 2026</span>
        </footer>
      </div>
    </div>
  )
}
