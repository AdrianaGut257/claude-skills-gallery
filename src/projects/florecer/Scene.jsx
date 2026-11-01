import Flower from './Flower.jsx'

// Escena del jardín: cielo, sol o luna, dos colinas y hasta tres flores.
// plants: [{ key, stage, color, waiting?, fresh?, title? }]
export default function Scene({ plants, sky, className = '' }) {
  return (
    <div className={`fl-scene ${className}`} data-sky={sky}>
      <span className="fl-scene-sun" aria-hidden="true" />
      <svg className="fl-scene-hills" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 58 C70 26 140 30 210 50 C280 70 340 40 400 34 L400 120 L0 120Z" className="fl-hill-back" />
        <path d="M0 84 C80 62 160 60 240 72 C310 82 360 70 400 64 L400 120 L0 120Z" className="fl-hill-front" />
      </svg>
      <div className="fl-scene-plants">
        {plants.map((p) => (
          <div key={p.key} className="fl-scene-plant">
            <Flower
              key={p.stage}
              stage={p.stage}
              color={p.color}
              waiting={p.waiting}
              fresh={p.fresh}
              title={p.title}
              className="is-growing"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
