import { formatKg, formatLitres } from './data.js'
import { Icon } from './icons.jsx'

/**
 * La "etiqueta verde": el impacto de la prenda escrito como una etiqueta de composición.
 * - variant "mini": dos cifras, para las tarjetas del catálogo.
 * - variant "full": la etiqueta completa, en la ficha y colgada del perchero en la portada.
 */
export default function GreenTag({ product, variant = 'full', className = '', ...rest }) {
  if (variant === 'mini') {
    return (
      <p className={`ec-tag-mini ${className}`} {...rest}>
        <span>
          <Icon name="drop" size={16} />
          <span className="ec-visually-hidden">Agua ahorrada: </span>−{formatLitres(product.water)}
        </span>
        <span>
          <Icon name="cloud" size={16} />
          <span className="ec-visually-hidden">CO₂ evitado: </span>−{formatKg(product.co2)}
        </span>
      </p>
    )
  }

  return (
    <div className={`ec-tag ${className}`} {...rest}>
      <span className="ec-tag-hole" aria-hidden="true" />
      <p className="ec-tag-brand">
        <span>ecco</span>
        <span>Etiqueta verde</span>
      </p>
      <dl className="ec-tag-rows">
        <div className="is-big">
          <dt>
            <Icon name="drop" size={18} /> Agua ahorrada
          </dt>
          <dd>{formatLitres(product.water)}</dd>
        </div>
        <div className="is-big">
          <dt>
            <Icon name="cloud" size={18} /> CO₂ evitado
          </dt>
          <dd>{formatKg(product.co2)}</dd>
        </div>
        <div>
          <dt>
            <Icon name="thread" size={18} /> Fibra
          </dt>
          <dd>{product.fibre}</dd>
        </div>
        <div>
          <dt>
            <Icon name="pin" size={18} /> Origen
          </dt>
          <dd>{product.origin}</dd>
        </div>
        <div>
          <dt>
            <Icon name="route" size={18} /> Recorrido
          </dt>
          <dd>{product.km} km hasta ti</dd>
        </div>
      </dl>
      <p className="ec-tag-foot">Frente a una prenda convencional equivalente</p>
    </div>
  )
}
