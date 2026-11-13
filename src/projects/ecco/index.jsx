import { useState } from 'react'
import BagDrawer from './BagDrawer.jsx'
import { useBag, useWide } from './cart.js'
import { productById } from './data.js'
import { Icon } from './icons.jsx'
import Product from './Product.jsx'
import Shop from './Shop.jsx'
import './ecco.css'

// "#/ecco" es la tienda y "#/ecco/<id>" la ficha de una prenda.
export default function Ecco({ subpath = '' }) {
  const bag = useBag()
  const wide = useWide()
  const [open, setOpen] = useState(false)
  const product = productById[subpath]

  const jumpTo = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <div className="ec">
      <header className="ec-header">
        <div className="ec-wrap ec-header-row">
          <a className="ec-logo" href="#/ecco" aria-label="Ecco, inicio de la tienda">
            ecco
          </a>
          <nav className="ec-nav" aria-label="Tienda">
            <a href={product ? '#/ecco' : '#coleccion'} onClick={product ? undefined : (e) => jumpTo(e, 'coleccion')}>
              Colección
            </a>
            {!product && (
              <a href="#medimos" onClick={(e) => jumpTo(e, 'medimos')}>
                Cómo medimos
              </a>
            )}
          </nav>
          <button type="button" className="ec-bag-btn" onClick={() => setOpen(true)}>
            <Icon name="bag" />
            <span>Bolsa</span>
            <span className="ec-bag-count" aria-label={`${bag.totals.count} prendas`}>
              {bag.totals.count}
            </span>
          </button>
        </div>
      </header>

      <main>
        {product ? (
          <Product
            key={product.id}
            product={product}
            onAdd={(id, size) => {
              bag.add(id, size)
              setOpen(true)
            }}
          />
        ) : (
          <Shop onOpenBag={() => setOpen(true)} jumpTo={jumpTo} />
        )}
      </main>

      <footer className="ec-footer">
        <div className="ec-wrap ec-footer-row">
          <p className="ec-logo is-small">ecco</p>
          <p>Ecco es una marca de demostración creada para este portafolio. Las cifras de impacto son estimaciones de ejemplo.</p>
          <p>Fotografías: Unsplash vía Wikimedia Commons (CC0).</p>
        </div>
      </footer>

      <BagDrawer open={open} onOpenChange={setOpen} bag={bag} wide={wide} />
    </div>
  )
}
