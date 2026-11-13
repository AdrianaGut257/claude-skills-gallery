import { useState } from 'react'
import { Drawer } from 'vaul'
import { formatBs, formatKg, formatLitres, productById, showers } from './data.js'
import { Icon } from './icons.jsx'

/**
 * La bolsa, con Vaul (gestures: un cajón bien hecho no se improvisa).
 * Escritorio: entra por la derecha. Móvil: hoja inferior que se arrastra hacia abajo para cerrar,
 * con la velocidad del gesto, y que se puede atrapar a medio camino.
 */
export default function BagDrawer({ open, onOpenChange, bag, wide }) {
  const [note, setNote] = useState(false)
  const { lines, setQty, totals } = bag

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        if (!v) setNote(false)
      }}
      direction={wide ? 'right' : 'bottom'}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="ec-overlay" />
        <Drawer.Content className={`ec-drawer ${wide ? 'is-side' : 'is-sheet'}`} aria-describedby={undefined}>
          {!wide && <div className="ec-drawer-handle" aria-hidden="true" />}
          <header className="ec-drawer-head">
            <Drawer.Title className="ec-drawer-title">
              Tu bolsa <span>{totals.count ? `${totals.count} ${totals.count === 1 ? 'prenda' : 'prendas'}` : ''}</span>
            </Drawer.Title>
            <Drawer.Close className="ec-icon-btn" aria-label="Cerrar la bolsa">
              <Icon name="close" />
            </Drawer.Close>
          </header>

          {lines.length === 0 ? (
            <div className="ec-drawer-empty">
              <Icon name="bag" size={32} />
              <p>Tu bolsa está vacía.</p>
              <Drawer.Close className="ec-btn ec-btn-ghost">Seguir mirando</Drawer.Close>
            </div>
          ) : (
            <>
              <ul className="ec-lines" data-vaul-no-drag>
                {lines.map((l) => {
                  const p = productById[l.id]
                  return (
                    <li key={`${l.id}-${l.size}`} className="ec-line">
                      <img src={p.photo} alt="" style={{ objectPosition: p.focus }} />
                      <div className="ec-line-main">
                        <p className="ec-line-name">{p.name}</p>
                        <p className="ec-line-meta">
                          Talla {l.size} · <Icon name="drop" size={14} /> −{formatLitres(p.water * l.qty)}
                        </p>
                        <div className="ec-qty">
                          <button
                            type="button"
                            className="ec-icon-btn is-small"
                            aria-label={l.qty === 1 ? `Quitar ${p.name}` : `Una ${p.name} menos`}
                            onClick={() => setQty(l.id, l.size, l.qty - 1)}
                          >
                            <Icon name={l.qty === 1 ? 'close' : 'minus'} size={18} />
                          </button>
                          <output aria-label="Cantidad">{l.qty}</output>
                          <button
                            type="button"
                            className="ec-icon-btn is-small"
                            aria-label={`Una ${p.name} más`}
                            disabled={l.qty >= 9}
                            onClick={() => setQty(l.id, l.size, l.qty + 1)}
                          >
                            <Icon name="plus" size={18} />
                          </button>
                        </div>
                      </div>
                      <p className="ec-line-price">{formatBs(p.price * l.qty)}</p>
                    </li>
                  )
                })}
              </ul>

              <section className="ec-impact" aria-label="Lo que ahorra tu pedido">
                <p className="ec-impact-title">Con este pedido ahorras</p>
                <div className="ec-impact-nums">
                  <p>
                    <Icon name="drop" size={20} />
                    <span className="ec-num" key={totals.water}>
                      {formatLitres(totals.water)}
                    </span>
                    <span className="ec-impact-unit">de agua</span>
                  </p>
                  <p>
                    <Icon name="cloud" size={20} />
                    <span className="ec-num" key={totals.co2}>
                      {formatKg(totals.co2)}
                    </span>
                    <span className="ec-impact-unit">de CO₂</span>
                  </p>
                </div>
                <p className="ec-impact-note">Unas {showers(totals.water)} duchas de cinco minutos.</p>
              </section>

              <footer className="ec-drawer-foot">
                <p className="ec-subtotal">
                  <span>Subtotal</span>
                  <strong>{formatBs(totals.price)}</strong>
                </p>
                <button type="button" className="ec-btn ec-btn-solid ec-btn-block" onClick={() => setNote(true)}>
                  Ir a pagar <Icon name="arrowRight" size={20} />
                </button>
                <p className="ec-drawer-note" role="status">
                  {note ? 'Ecco es una tienda de demostración: el pago no está conectado y no se cobra nada.' : ''}
                </p>
              </footer>
            </>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
