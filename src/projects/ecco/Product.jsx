import { useId, useState } from 'react'
import { PRODUCTS, SIZES, formatBs } from './data.js'
import GreenTag from './GreenTag.jsx'
import { Icon } from './icons.jsx'
import { ProductCard } from './Shop.jsx'

export default function Product({ product: p, onAdd }) {
  const [size, setSize] = useState('')
  const [error, setError] = useState(false)
  const errorId = useId()
  const others = PRODUCTS.filter((o) => o.id !== p.id && o.tags.some((t) => p.tags.includes(t))).slice(0, 3)

  const add = () => {
    if (!size) {
      setError(true)
      return
    }
    onAdd(p.id, size)
  }

  return (
    <>
      <section className="ec-pdp" aria-labelledby="ec-pdp-title">
        <div className="ec-wrap ec-pdp-grid">
          <div className="ec-pdp-photo">
            <img src={p.photo} alt={p.alt} style={{ objectPosition: p.focus }} fetchPriority="high" />
          </div>

          <div className="ec-pdp-info">
            <a className="ec-back" href="#/ecco">
              <Icon name="arrowLeft" size={18} /> Colección
            </a>
            <h1 id="ec-pdp-title" className="ec-enter" style={{ '--d': 0 }}>
              {p.name}
            </h1>
            <p className="ec-pdp-price ec-enter" style={{ '--d': 1 }}>
              {formatBs(p.price)}
            </p>
            <p className="ec-pdp-note ec-enter" style={{ '--d': 2 }}>
              {p.note}
            </p>

            <fieldset className="ec-sizes" aria-describedby={error ? errorId : undefined}>
              <legend>Talla</legend>
              <div>
                {SIZES.map((s) => (
                  <label key={s}>
                    <input
                      type="radio"
                      name="size"
                      value={s}
                      checked={size === s}
                      onChange={() => {
                        setSize(s)
                        setError(false)
                      }}
                    />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
              {error && (
                <p id={errorId} className="ec-error">
                  Elige una talla para añadirla a la bolsa.
                </p>
              )}
            </fieldset>

            <button type="button" className="ec-btn ec-btn-solid ec-btn-block" onClick={add}>
              <Icon name="bag" size={20} /> Añadir a la bolsa
            </button>

            <GreenTag product={p} className="ec-pdp-tag" />
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="ec-section ec-related" aria-labelledby="ec-related-title">
          <div className="ec-wrap">
            <h2 id="ec-related-title">Prendas con la misma fibra u origen</h2>
            <ul className="ec-grid is-three">
              {others.map((o) => (
                <ProductCard key={o.id} p={o} />
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
