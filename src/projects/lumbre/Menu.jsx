import { useLayoutEffect, useRef, useState } from 'react'
import { CATEGORIES, MENU, formatBs } from './data.js'
import { Icon } from './icons.jsx'

// Pestañas con transición de color perfecta (técnica de Emil Kowalski): hay dos
// copias de la lista; la de encima tiene el estilo activo y un clip-path que solo
// deja ver la pestaña elegida. Al cambiar, se anima el recorte, no los colores.
function Tabs({ active, onChange }) {
  const baseRef = useRef(null)
  const [clip, setClip] = useState('inset(0 100% 100% 0)')

  useLayoutEffect(() => {
    const base = baseRef.current
    if (!base) return
    const measure = () => {
      const btn = base.querySelector(`[data-id="${active}"]`)
      if (!btn) return
      const top = btn.offsetTop
      const left = btn.offsetLeft
      const right = base.offsetWidth - left - btn.offsetWidth
      const bottom = base.offsetHeight - top - btn.offsetHeight
      setClip(`inset(${top}px ${right}px ${bottom}px ${left}px round 999px)`)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(base)
    return () => ro.disconnect()
  }, [active])

  const onKeyDown = (e) => {
    const i = CATEGORIES.findIndex((c) => c.id === active)
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = CATEGORIES[(i + step + CATEGORIES.length) % CATEGORIES.length]
    onChange(next.id)
    baseRef.current?.querySelector(`[data-id="${next.id}"]`)?.focus()
  }

  return (
    <div className="lb-tabs">
      <div ref={baseRef} className="lb-tabs-list" role="tablist" aria-label="Categorías del menú" onKeyDown={onKeyDown}>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            id={`lb-tab-${c.id}`}
            data-id={c.id}
            aria-selected={active === c.id}
            aria-controls="lb-menu-panel"
            tabIndex={active === c.id ? 0 : -1}
            className="lb-tab"
            onClick={() => onChange(c.id)}
          >
            <Icon name={c.icon} size={18} />
            {c.label}
          </button>
        ))}
      </div>
      <div className="lb-tabs-list lb-tabs-active" aria-hidden="true" style={{ clipPath: clip }}>
        {CATEGORIES.map((c) => (
          <span key={c.id} className="lb-tab">
            <Icon name={c.icon} size={18} />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function Qty({ item, qty, onChange }) {
  if (!qty) {
    return (
      <button type="button" className="lb-add" onClick={() => onChange(1)} aria-label={`Añadir ${item.name}`}>
        <Icon name="plus" size={18} />
        Añadir
      </button>
    )
  }
  return (
    <div className="lb-qty" role="group" aria-label={`Cantidad de ${item.name}`}>
      <button type="button" onClick={() => onChange(qty - 1)} aria-label={`Quitar un ${item.name}`}>
        <Icon name="minus" size={16} />
      </button>
      <output aria-live="polite">{qty}</output>
      <button type="button" onClick={() => onChange(qty + 1)} aria-label={`Añadir otro ${item.name}`}>
        <Icon name="plus" size={16} />
      </button>
    </div>
  )
}

function orderMessage(lines, total) {
  const items = lines.map((l) => `• ${l.qty} × ${l.name} (${formatBs(l.qty * l.price)})`).join('\n')
  return `Hola, Café Lumbre. Quiero pedir:\n${items}\nTotal: ${formatBs(total)}`
}

export default function Menu({ onPickDrink }) {
  const [active, setActive] = useState(CATEGORIES[0].id)
  const [order, setOrder] = useState({})

  const setQty = (item, qty) => {
    setOrder((o) => {
      const next = { ...o }
      if (qty > 0) next[item.id] = Math.min(qty, 20)
      else delete next[item.id]
      return next
    })
    if (qty > 0 && item.drink) onPickDrink(item.drink)
  }

  const lines = MENU.filter((m) => order[m.id]).map((m) => ({ ...m, qty: order[m.id] }))
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const total = lines.reduce((s, l) => s + l.qty * l.price, 0)
  const summary = lines.map((l) => `${l.qty} ${l.name}`).join(', ')
  const waLink = `https://wa.me/?text=${encodeURIComponent(orderMessage(lines, total))}`

  return (
    <section id="menu" className="lb-menu" aria-labelledby="lb-menu-title">
      <div className="lb-wrap">
        <header className="lb-section-head">
          <p className="lb-eyebrow">La carta</p>
          <h2 id="lb-menu-title" className="lb-h2">
            Elige, suma y pídelo por WhatsApp.
          </h2>
          <p className="lb-lead">
            Arma tu pedido aquí y te lo dejamos listo para recoger. Al añadir un espresso, un capuchino o un mocha, la
            taza de arriba también cambia.
          </p>
        </header>

        <Tabs active={active} onChange={setActive} />

        <ul id="lb-menu-panel" className="lb-items" role="tabpanel" aria-labelledby={`lb-tab-${active}`} key={active}>
          {MENU.filter((m) => m.cat === active).map((item, i) => (
            <li key={item.id} className={`lb-item${order[item.id] ? ' is-picked' : ''}`} style={{ '--i': i }}>
              <div className="lb-item-text">
                <h3>
                  {item.name}
                  {item.tag && <span className="lb-tag">{item.tag}</span>}
                </h3>
                <p>{item.desc}</p>
              </div>
              <div className="lb-item-side">
                <span className="lb-price">{formatBs(item.price)}</span>
                <Qty item={item} qty={order[item.id] || 0} onChange={(q) => setQty(item, q)} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={`lb-orderbar${count ? ' is-open' : ''}`} aria-hidden={!count} inert={!count}>
        <div className="lb-orderbar-info">
          <span className="lb-orderbar-count">
            <Icon name="bag" size={18} />
            <span aria-live="polite">{count}</span>
          </span>
          <span className="lb-orderbar-summary">{summary}</span>
          <span className="lb-orderbar-total">{formatBs(total)}</span>
        </div>
        <a className="lb-btn lb-btn-primary lb-orderbar-cta" href={waLink} target="_blank" rel="noreferrer">
          <Icon name="message" size={18} />
          Pedir por WhatsApp
        </a>
      </div>
    </section>
  )
}
