import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  CLIENTS,
  KPIS,
  REPORTS,
  REPORT_STEPS,
  STATUS,
  TEAM,
  bs,
  clientById,
  dueLabel,
  fmt,
} from './data.js'
import { Icon } from './icons.jsx'
import LiveChart from './LiveChart.jsx'

/* ---------- Piezas compartidas ---------- */

export function Avatar({ id, size = 28 }) {
  const p = TEAM[id]
  return (
    <span
      className="gs-avatar"
      style={{ '--h': p.hue, width: size, height: size, fontSize: size * 0.4 }}
      title={p.name}
      aria-hidden="true"
    >
      {p.initials}
    </span>
  )
}

export function StatusBadge({ status }) {
  const s = STATUS[status]
  return (
    <span className={`gs-badge is-${s.tone}`}>
      <span className="gs-badge-dot" aria-hidden="true" />
      {s.label}
    </span>
  )
}

/** Control segmentado. El indicador se desliza entre opciones iguales: 200 ms ease-out (animate). */
export function Segmented({ options, value, onChange, label, size = 'md' }) {
  const index = Math.max(0, options.findIndex((o) => o.id === value))
  return (
    <div
      className={`gs-seg is-${size}`}
      role="radiogroup"
      aria-label={label}
      style={{ '--n': options.length, '--i': index }}
    >
      <span className="gs-seg-thumb" aria-hidden="true" />
      {options.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={o.id === value} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Delta({ now, before, goodWhenDown = false }) {
  const pct = before ? ((now - before) / before) * 100 : 0
  const up = pct >= 0
  const good = goodWhenDown ? !up : up
  return (
    <span className={`gs-delta ${good ? 'is-good' : 'is-bad'}`}>
      <Icon name={up ? 'arrowUp' : 'arrowDown'} size={14} />
      {Math.abs(pct).toLocaleString('es-BO', { maximumFractionDigits: 1 })} %
    </span>
  )
}

const PERIODS = [
  { id: 'semana', label: 'Semana' },
  { id: 'mes', label: 'Mes' },
  { id: 'trimestre', label: 'Trimestre' },
]

/* ---------- Resumen ---------- */

export function Overview({ projects, onOpenProject, go, compact = false }) {
  const [period, setPeriod] = useState('semana')
  const k = KPIS[period]
  const prevName = { semana: 'la semana anterior', mes: 'el mes anterior', trimestre: 'el trimestre anterior' }[period]
  const atRisk = projects.filter((p) => p.status === 'riesgo')
  const upcoming = projects
    .filter((p) => p.status !== 'entregado' && p.due >= 0 && p.due <= 30)
    .sort((a, b) => a.due - b.due)
    .slice(0, compact ? 3 : 5)

  return (
    <div className="gs-view">
      <div className="gs-view-head">
        <div>
          {/* Dentro del marco de la web es una vista previa: no compite con el h1 de la página */}
          {compact ? <p className="gs-h1">Resumen</p> : <h1 className="gs-h1">Resumen</h1>}
          <p className="gs-muted">Lo que pasa hoy en los proyectos del equipo.</p>
        </div>
        <Segmented options={PERIODS} value={period} onChange={setPeriod} label="Periodo" />
      </div>

      <dl className="gs-kpis">
        <div>
          <dt>Horas registradas</dt>
          <dd>{fmt(k.hours[0])}</dd>
          <p>
            <Delta now={k.hours[0]} before={k.hours[1]} /> frente a {prevName}
          </p>
        </div>
        <div>
          <dt>Facturado</dt>
          <dd>{bs(k.billed[0])}</dd>
          <p>
            <Delta now={k.billed[0]} before={k.billed[1]} /> frente a {prevName}
          </p>
        </div>
        <div>
          <dt>Entregas</dt>
          <dd>{k.delivered[0]}</dd>
          <p>
            <Delta now={k.delivered[0]} before={k.delivered[1]} /> frente a {prevName}
          </p>
        </div>
        <div>
          <dt>Incidencias abiertas</dt>
          <dd>{k.incidents[0]}</dd>
          <p>
            <Delta now={k.incidents[0]} before={k.incidents[1]} goodWhenDown /> frente a {prevName}
          </p>
        </div>
      </dl>

      <div className="gs-row">
        <section className="gs-panel gs-panel-chart" aria-labelledby="gs-live-title">
          <header className="gs-panel-head">
            <h2 id="gs-live-title">Peticiones a la API por minuto</h2>
            <span className="gs-live-tag">
              <span className="gs-live-pulse" aria-hidden="true" /> En vivo
            </span>
          </header>
          <LiveChart compact={compact} />
        </section>

        <section className="gs-panel" aria-labelledby="gs-risk-title">
          <header className="gs-panel-head">
            <h2 id="gs-risk-title">En riesgo</h2>
            <span className="gs-count is-warn">{atRisk.length}</span>
          </header>
          {atRisk.length ? (
            <ul className="gs-risk">
              {atRisk.map((p) => (
                <li key={p.id}>
                  <button type="button" onClick={() => onOpenProject(p.id)}>
                    <Icon name="alert" size={18} />
                    <span>
                      <strong>{p.name}</strong>
                      <span className="gs-muted"> · {clientById[p.client].name}</span>
                      <span className="gs-risk-why">{p.risk}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="gs-empty">
              <Icon name="check" size={18} /> Ningún proyecto en riesgo.
            </p>
          )}
        </section>
      </div>

      {!compact && (
        <section className="gs-panel" aria-labelledby="gs-next-title">
          <header className="gs-panel-head">
            <h2 id="gs-next-title">Entregas de los próximos 30 días</h2>
            <button type="button" className="gs-link" onClick={() => go('proyectos')}>
              Ver proyectos <Icon name="arrowRight" size={16} />
            </button>
          </header>
          <ol className="gs-upcoming">
            {upcoming.map((p) => (
              <li key={p.id}>
                <span className="gs-upcoming-when">{dueLabel(p.due)}</span>
                <button type="button" className="gs-upcoming-name" onClick={() => onOpenProject(p.id)}>
                  {p.name}
                </button>
                <span className="gs-muted">{clientById[p.client].name}</span>
                <span className="gs-progress" aria-label={`Avance ${p.progress} %`}>
                  <span style={{ transform: `scaleX(${p.progress / 100})` }} />
                </span>
                <span className="gs-num">{p.progress} %</span>
                <StatusBadge status={p.status} />
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}

/* ---------- Proyectos ---------- */

const FILTERS = [{ id: 'todos', label: 'Todos' }, ...Object.entries(STATUS).map(([id, s]) => ({ id, label: s.label }))]

const COLUMNS = [
  { id: 'name', label: 'Proyecto', get: (p) => p.name },
  { id: 'client', label: 'Cliente', get: (p) => clientById[p.client].name },
  { id: 'status', label: 'Estado', get: (p) => Object.keys(STATUS).indexOf(p.status) },
  { id: 'progress', label: 'Avance', get: (p) => p.progress, num: true },
  // Lo ya entregado va al final al ordenar por fecha: lo urgente primero
  { id: 'due', label: 'Entrega', get: (p) => (p.status === 'entregado' ? 1e6 - p.due : p.due), num: true },
  { id: 'hours', label: 'Horas', get: (p) => p.hoursUsed / p.hoursBudget, num: true },
]

export function Projects({ projects, onOpenProject }) {
  const [filter, setFilter] = useState('todos')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState({ by: 'due', dir: 1 })

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const col = COLUMNS.find((c) => c.id === sort.by)
    return projects
      .filter((p) => filter === 'todos' || p.status === filter)
      .filter((p) => !q || `${p.name} ${clientById[p.client].name} ${TEAM[p.lead].name}`.toLowerCase().includes(q))
      .sort((a, b) => {
        const x = col.get(a)
        const y = col.get(b)
        return (typeof x === 'string' ? x.localeCompare(y, 'es') : x - y) * sort.dir
      })
  }, [projects, filter, query, sort])

  return (
    <div className="gs-view">
      <div className="gs-view-head">
        <div>
          <h1 className="gs-h1">Proyectos</h1>
          <p className="gs-muted">
            {projects.filter((p) => p.status !== 'entregado').length} activos · {projects.length} en total
          </p>
        </div>
      </div>

      <div className="gs-toolbar">
        <label className="gs-search">
          <Icon name="search" size={18} />
          <span className="gs-visually-hidden">Buscar proyecto, cliente o responsable</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar proyecto, cliente o persona"
            enterKeyHint="search"
          />
        </label>
        <Segmented options={FILTERS} value={filter} onChange={setFilter} label="Filtrar por estado" size="sm" />
      </div>

      <div className="gs-table-wrap">
        <table className="gs-table">
          <thead>
            <tr>
              {COLUMNS.map((c) => (
                <th key={c.id} aria-sort={sort.by === c.id ? (sort.dir > 0 ? 'ascending' : 'descending') : 'none'} className={c.num ? 'is-num' : ''}>
                  {/* Ordenar es frecuente: cambio inmediato, sin animación */}
                  <button type="button" onClick={() => setSort((s) => ({ by: c.id, dir: s.by === c.id ? -s.dir : 1 }))}>
                    {c.label}
                    <Icon
                      name={sort.by === c.id ? (sort.dir > 0 ? 'arrowUp' : 'arrowDown') : 'sort'}
                      size={14}
                      className={sort.by === c.id ? 'is-on' : ''}
                    />
                  </button>
                </th>
              ))}
              <th>
                <span className="gs-visually-hidden">Responsable</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const over = p.hoursUsed > p.hoursBudget
              return (
                <tr key={p.id} onClick={() => onOpenProject(p.id)}>
                  <td>
                    <button type="button" className="gs-row-link" onClick={(e) => (e.stopPropagation(), onOpenProject(p.id))}>
                      {p.name}
                    </button>
                  </td>
                  <td className="gs-muted">{clientById[p.client].name}</td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="is-num">
                    <span className="gs-cell-progress">
                      <span className="gs-progress" aria-hidden="true">
                        <span style={{ transform: `scaleX(${p.progress / 100})` }} />
                      </span>
                      {p.progress} %
                    </span>
                  </td>
                  <td className="is-num">{dueLabel(p.due)}</td>
                  <td className={`is-num${over ? ' is-over' : ''}`}>
                    {fmt(p.hoursUsed)} / {fmt(p.hoursBudget)}
                    {over && <span className="gs-visually-hidden"> (por encima del presupuesto)</span>}
                  </td>
                  <td>
                    <Avatar id={p.lead} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="gs-empty">
            Ningún proyecto coincide con «{query}».{' '}
            <button type="button" className="gs-link" onClick={() => (setQuery(''), setFilter('todos'))}>
              Quitar filtros
            </button>
          </p>
        )}
      </div>
    </div>
  )
}

/* ---------- Clientes ---------- */

function healthLabel(h) {
  if (h >= 75) return { label: 'Buena', tone: 'ok' }
  if (h >= 55) return { label: 'Atenta', tone: 'warn' }
  return { label: 'Crítica', tone: 'bad' }
}

export function Clients({ projects }) {
  const rows = [...CLIENTS].sort((a, b) => a.health - b.health)
  return (
    <div className="gs-view">
      <div className="gs-view-head">
        <div>
          <h1 className="gs-h1">Clientes</h1>
          <p className="gs-muted">Ordenados por salud de la relación: primero los que piden atención.</p>
        </div>
      </div>
      <div className="gs-table-wrap">
        <table className="gs-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Salud</th>
              <th className="is-num">Último contacto</th>
              <th className="is-num">Facturas abiertas</th>
              <th className="is-num">Proyectos</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const h = healthLabel(c.health)
              const count = projects.filter((p) => p.client === c.id && p.status !== 'entregado').length
              return (
                <tr key={c.id} className="is-static">
                  <td>
                    <strong>{c.name}</strong>
                    <span className="gs-sub">
                      {c.sector} · cliente desde {c.since}
                    </span>
                  </td>
                  <td>
                    <span className={`gs-health is-${h.tone}`}>
                      <span className="gs-progress" aria-hidden="true">
                        <span style={{ transform: `scaleX(${c.health / 100})` }} />
                      </span>
                      <span className="gs-num">{c.health}</span>
                      <span className="gs-health-label">{h.label}</span>
                    </span>
                  </td>
                  <td className={`is-num${c.lastContact < -14 ? ' is-over' : ''}`}>Hace {-c.lastContact} d</td>
                  <td className="is-num">{c.invoices}</td>
                  <td className="is-num">{count}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ---------- Reportes ---------- */

function reportData(type, projects) {
  if (type === 'horas') {
    return {
      columns: ['Cliente', 'Horas', 'Proyectos'],
      rows: CLIENTS.map((c) => {
        const ps = projects.filter((p) => p.client === c.id)
        return [c.name, ps.reduce((s, p) => s + p.hoursUsed, 0), ps.length]
      })
        .filter((r) => r[1] > 0)
        .sort((a, b) => b[1] - a[1]),
      bar: 1,
    }
  }
  if (type === 'riesgos') {
    return {
      columns: ['Proyecto', 'Cliente', 'Motivo'],
      rows: projects
        .filter((p) => p.status === 'riesgo' || p.hoursUsed / p.hoursBudget > 0.9)
        .map((p) => [p.name, clientById[p.client].name, p.risk ?? `Usó el ${Math.round((p.hoursUsed / p.hoursBudget) * 100)} % de las horas`]),
    }
  }
  return {
    columns: ['Proyecto', 'Avance', 'Horas usadas', 'Desvío'],
    rows: projects
      .filter((p) => p.status !== 'entregado')
      .map((p) => {
        const expected = Math.round((p.hoursUsed / p.hoursBudget) * 100)
        return [p.name, `${p.progress} %`, `${Math.round((p.hoursUsed / p.hoursBudget) * 100)} %`, `${p.progress - expected > 0 ? '+' : ''}${p.progress - expected} pts`]
      }),
  }
}

function toCSV(data) {
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`
  return [data.columns, ...data.rows].map((r) => r.map(esc).join(';')).join('\n')
}

/**
 * Reportes: el "-70 % de tiempo" del caso. Generar uno enseña los pasos en orden (indicar estado):
 * cada paso se marca al terminar y la barra avanza lineal, porque representa tiempo.
 */
export function Reports({ projects, notify }) {
  const [type, setType] = useState('avance')
  const [phase, setPhase] = useState({ state: 'idle', step: 0 }) // idle | running | done
  const [result, setResult] = useState(null)
  const timers = useRef([])
  const statusId = useId()
  const steps = REPORT_STEPS[type]

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const run = () => {
    timers.current.forEach(clearTimeout)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stepMs = reduce ? 150 : 650
    setResult(null)
    setPhase({ state: 'running', step: 0 })
    timers.current = steps.map((_, i) =>
      setTimeout(() => {
        if (i < steps.length - 1) setPhase({ state: 'running', step: i + 1 })
        else {
          setPhase({ state: 'done', step: steps.length })
          setResult({ type, data: reportData(type, projects), at: new Date() })
        }
      }, stepMs * (i + 1)),
    )
  }

  const download = () => {
    const blob = new Blob(['﻿' + toCSV(result.data)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = Object.assign(document.createElement('a'), { href: url, download: `pulso-${result.type}.csv` })
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    notify('CSV descargado')
  }

  const report = REPORTS.find((r) => r.id === type)
  const max = result?.data.bar !== undefined ? Math.max(...result.data.rows.map((r) => r[result.data.bar])) : 0

  return (
    <div className="gs-view">
      <div className="gs-view-head">
        <div>
          <h1 className="gs-h1">Reportes</h1>
          <p className="gs-muted">Lo que antes era una tarde con hojas de cálculo, en unos segundos.</p>
        </div>
      </div>

      <div className="gs-reports">
        <section className="gs-panel" aria-labelledby="gs-rep-type">
          <h2 id="gs-rep-type" className="gs-panel-title">
            Tipo de reporte
          </h2>
          <div className="gs-choices" role="radiogroup" aria-labelledby="gs-rep-type">
            {REPORTS.map((r) => (
              <label key={r.id} className="gs-choice">
                <input
                  type="radio"
                  name="report"
                  value={r.id}
                  checked={type === r.id}
                  onChange={() => {
                    setType(r.id)
                    setPhase({ state: 'idle', step: 0 })
                  }}
                />
                <span>
                  <strong>{r.label}</strong>
                  <span className="gs-sub">{r.desc}</span>
                </span>
              </label>
            ))}
          </div>
          <button type="button" className="gs-btn gs-btn-primary gs-btn-block" onClick={run} disabled={phase.state === 'running'}>
            <Icon name="reports" size={18} />
            {phase.state === 'running' ? 'Generando…' : `Generar «${report.label}»`}
          </button>

          {phase.state !== 'idle' && (
            <div className="gs-steps" aria-live="polite" id={statusId}>
              <span className="gs-steps-bar" aria-hidden="true">
                <span style={{ transform: `scaleX(${phase.step / steps.length})` }} />
              </span>
              <ol>
                {steps.map((s, i) => (
                  <li key={s} className={i < phase.step ? 'is-done' : i === phase.step && phase.state === 'running' ? 'is-now' : ''}>
                    <span className="gs-step-mark" aria-hidden="true">
                      {i < phase.step && <Icon name="check" size={14} />}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>

        <section className="gs-panel gs-report" aria-labelledby="gs-rep-result">
          {result ? (
            <div className="gs-report-in" key={result.at.getTime()}>
              <header className="gs-panel-head">
                <div>
                  <h2 id="gs-rep-result">{REPORTS.find((r) => r.id === result.type).label}</h2>
                  <p className="gs-sub">
                    Generado a las {result.at.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })} · {result.data.rows.length} filas
                  </p>
                </div>
                <button type="button" className="gs-btn gs-btn-ghost" onClick={download}>
                  <Icon name="download" size={18} /> Descargar CSV
                </button>
              </header>
              <table className="gs-table is-compact">
                <thead>
                  <tr>
                    {result.data.columns.map((c, i) => (
                      <th key={c} className={i ? 'is-num' : ''}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.data.rows.map((r) => (
                    <tr key={r[0]} className="is-static">
                      {r.map((v, i) => (
                        <td key={i} className={i ? 'is-num' : ''}>
                          {i === result.data.bar ? (
                            <span className="gs-cell-progress">
                              <span className="gs-progress" aria-hidden="true">
                                <span style={{ transform: `scaleX(${v / max})` }} />
                              </span>
                              {fmt(v)} h
                            </span>
                          ) : (
                            v
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="gs-report-empty">
              <Icon name="reports" size={28} />
              <h2 id="gs-rep-result">El reporte aparecerá aquí</h2>
              <p className="gs-muted">Elige un tipo y pulsa Generar.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
