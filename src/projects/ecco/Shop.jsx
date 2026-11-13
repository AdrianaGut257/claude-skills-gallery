import { useState } from 'react'
import { FILTERS, PRODUCTS, SORTS, formatBs, productById } from './data.js'
import GreenTag from './GreenTag.jsx'
import { Icon } from './icons.jsx'

const HERO_TAG = productById['chaqueta-mezclilla']
const RACK = `${import.meta.env.BASE_URL}ecco/perchero.jpg`
const HANDS = `${import.meta.env.BASE_URL}ecco/manos-tejiendo.jpg`

export function ProductCard({ p }) {
  return (
    <li>
      <a className="ec-card" href={`#/ecco/${p.id}`}>
        <span className="ec-card-photo">
          <img src={p.photo} alt={p.alt} loading="lazy" style={{ objectPosition: p.focus }} />
        </span>
        <span className="ec-card-row">
          <span className="ec-card-name">{p.name}</span>
          <span className="ec-card-price">{formatBs(p.price)}</span>
        </span>
        <GreenTag product={p} variant="mini" />
      </a>
    </li>
  )
}

export default function Shop({ onOpenBag, jumpTo }) {
  const [filter, setFilter] = useState('todas')
  const [sort, setSort] = useState('agua')

  const list = PRODUCTS.filter((p) => filter === 'todas' || p.tags.includes(filter)).sort((a, b) =>
    sort === 'agua' ? b.water - a.water : sort === 'co2' ? b.co2 - a.co2 : a.price - b.price,
  )

  return (
    <>
      <section className="ec-hero" aria-labelledby="ec-hero-title">
        <div className="ec-wrap ec-hero-grid">
          <div className="ec-hero-copy">
            <h1 id="ec-hero-title" className="ec-enter" style={{ '--d': 0 }}>
              Ropa sostenible con su impacto escrito en la etiqueta
            </h1>
            <p className="ec-lead ec-enter" style={{ '--d': 1 }}>
              Cada prenda dice cuánta agua y cuánto CO₂ ahorra frente a una convencional, de qué fibra está hecha y
              cuántos kilómetros viaja hasta ti.
            </p>
            <p className="ec-fact ec-enter" style={{ '--d': 2 }}>
              <Icon name="drop" size={20} />
              Una camiseta de algodón convencional gasta unos 2.700 litros de agua.
            </p>
            <div className="ec-actions ec-enter" style={{ '--d': 3 }}>
              <a className="ec-btn ec-btn-solid" href="#coleccion" onClick={(e) => jumpTo(e, 'coleccion')}>
                Ver la colección <Icon name="arrowRight" size={20} />
              </a>
              <a className="ec-btn ec-btn-ghost" href="#medimos" onClick={(e) => jumpTo(e, 'medimos')}>
                Cómo medimos
              </a>
            </div>
          </div>

          <div className="ec-hero-visual">
            <img
              className="ec-hero-photo"
              src={RACK}
              alt="Perchero con una chaqueta de color tabaco, una blusa rosa y unos vaqueros colgados"
              fetchPriority="high"
            />
            {/* La etiqueta cuelga de la percha y se balancea una vez al cargar */}
            <a className="ec-hang" href={`#/ecco/${HERO_TAG.id}`} aria-label={`Etiqueta verde de ${HERO_TAG.name}`}>
              <span className="ec-hang-string" aria-hidden="true" />
              <GreenTag product={HERO_TAG} className="ec-hang-tag" />
            </a>
          </div>
        </div>
      </section>

      <section id="coleccion" className="ec-section ec-collection" aria-labelledby="ec-col-title">
        <div className="ec-wrap">
          <div className="ec-col-head">
            <div>
              <h2 id="ec-col-title">La colección de otoño</h2>
              <p className="ec-sub">Ocho prendas de fibras recicladas, orgánicas y de camélidos, hechas en Bolivia.</p>
            </div>
            <label className="ec-sort">
              <span>Ordenar</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="ec-filters" role="group" aria-label="Filtrar por tipo de fibra o de origen">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className="ec-chip"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {filter === f.id && <Icon name="check" size={16} />}
                {f.label}
              </button>
            ))}
          </div>

          <ul className="ec-grid" aria-live="polite">
            {list.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </ul>
        </div>
      </section>

      <section id="medimos" className="ec-section ec-method" aria-labelledby="ec-method-title">
        <div className="ec-wrap ec-method-grid">
          <div className="ec-method-copy">
            <h2 id="ec-method-title">Cómo medimos cada etiqueta</h2>
            <p className="ec-big-number" aria-hidden="true">
              2.700 <span>litros</span>
            </p>
            <p className="ec-method-lead">
              es el agua que pide una sola camiseta de algodón convencional. La etiqueta verde compara cada prenda con esa
              referencia de su misma categoría.
            </p>
            <dl className="ec-method-rows">
              <div>
                <dt>
                  <Icon name="drop" /> Agua
                </dt>
                <dd>Riego, teñido y lavados de la fibra, restados a los de la prenda convencional.</dd>
              </div>
              <div>
                <dt>
                  <Icon name="cloud" /> CO₂
                </dt>
                <dd>Hilado, tejido, confección y transporte, en kilos de CO₂ equivalente.</dd>
              </div>
              <div>
                <dt>
                  <Icon name="route" /> Recorrido
                </dt>
                <dd>Kilómetros por carretera desde el taller hasta Cochabamba.</dd>
              </div>
            </dl>
            <p className="ec-method-note">En esta demostración las cifras son estimaciones de ejemplo.</p>
          </div>
          <div className="ec-method-photo">
            <img src={HANDS} alt="Manos de una artesana tejiendo una prenda de lana rosa con agujas" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="ec-section ec-close" aria-labelledby="ec-close-title">
        <div className="ec-wrap">
          <h2 id="ec-close-title">Tu bolsa suma el agua y el CO₂ que ahorras</h2>
          <p className="ec-sub">Añade prendas y mira cómo crece la cuenta antes de pagar.</p>
          <button type="button" className="ec-btn ec-btn-solid" onClick={onOpenBag}>
            <Icon name="bag" size={20} /> Abrir la bolsa
          </button>
        </div>
      </section>
    </>
  )
}
