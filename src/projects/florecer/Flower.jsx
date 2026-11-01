import { useId } from 'react'
import { tint } from './store.js'

// Flor ilustrada en SVG. Crece por etapas (0 semilla → 5 plena floración).
// waiting: lleva días sin regarse; se cierra como un tulipán y se inclina, pero nunca se marchita.
// fresh: regada hoy; brillo suave detrás y gotas de rocío.

const BASE_Y = 154
const STEM_TOP = [BASE_Y, 130, 104, 78, 66, 58]
const LEAF = '#6FA77A'
const LEAF_DARK = '#4F8A5E'

// Pétalo que apunta hacia arriba desde el origen: base en punta y extremo redondeado.
function petalPath(l, w) {
  return `M0 0 C${-w} ${-l * 0.3} ${-w * 0.8} ${-l * 0.88} 0 ${-l} C${w * 0.8} ${-l * 0.88} ${w} ${-l * 0.3} 0 0Z`
}

function Leaf({ x, y, angle, size = 1, flip = false, gid }) {
  const l = 26 * size
  const w = 9 * size
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${flip ? -1 : 1} 1)`}>
      <path d={`M0 0 Q${l / 2} ${-w} ${l} 0 Q${l / 2} ${w} 0 0Z`} fill={`url(#${gid}-leaf)`} />
      <path d={`M1 0 Q${l / 2} ${-w * 0.12} ${l * 0.86} 0`} stroke="#A9D2AE" strokeWidth="1" fill="none" opacity=".7" />
    </g>
  )
}

function Bloom({ x, y, l, n, closed, gid }) {
  if (closed) {
    // Cerrada: pétalos en abanico hacia arriba.
    return (
      <g transform={`translate(${x} ${y})`}>
        {[-30, 30].map((a) => (
          <path key={a} d={petalPath(l * 0.85, l * 0.42)} fill={`url(#${gid}-back)`} transform={`rotate(${a})`} />
        ))}
        {[-14, 14, 0].map((a) => (
          <path key={a} d={petalPath(l * 0.95, l * 0.46)} fill={`url(#${gid}-petal)`} transform={`rotate(${a})`} />
        ))}
      </g>
    )
  }
  const step = 360 / n
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: n }, (_, i) => (
        <path
          key={`b${i}`}
          d={petalPath(l * 0.92, l * 0.5)}
          fill={`url(#${gid}-back)`}
          transform={`rotate(${step * i + step / 2})`}
        />
      ))}
      {Array.from({ length: n }, (_, i) => (
        <path key={`f${i}`} d={petalPath(l, l * 0.52)} fill={`url(#${gid}-petal)`} transform={`rotate(${step * i})`} />
      ))}
      <circle r={l * 0.3} fill={`url(#${gid}-center)`} />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle
          key={a}
          cx={Math.cos((a * Math.PI) / 180) * l * 0.14}
          cy={Math.sin((a * Math.PI) / 180) * l * 0.14}
          r={l * 0.035}
          fill="#C98A1E"
          opacity=".55"
        />
      ))}
    </g>
  )
}

function Stem({ top, width = 3 }) {
  const h = BASE_Y - top
  return (
    <path
      d={`M60 ${BASE_Y} C57 ${BASE_Y - h * 0.35} 63.5 ${BASE_Y - h * 0.7} 60 ${top}`}
      stroke={LEAF_DARK}
      strokeWidth={width}
      strokeLinecap="round"
      fill="none"
    />
  )
}

function Drop({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -6 C3 -2 4 1 4 2.5 A4 4 0 0 1 -4 2.5 C-4 1 -3 -2 0 -6Z" fill="#BFE2F4" />
      <circle cx="-1.3" cy="1.8" r="1" fill="#fff" opacity=".9" />
    </g>
  )
}

export default function Flower({ stage, color, waiting = false, fresh = false, ground = true, className = '', title }) {
  const gid = `fl${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const top = STEM_TOP[stage]
  const tilt = waiting && stage >= 3 ? -12 : 0
  const big = stage >= 4

  return (
    <svg
      className={`fl-flower ${className}`}
      viewBox="0 0 120 160"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      overflow="visible"
    >
      <defs>
        <linearGradient id={`${gid}-petal`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={tint(color, -0.08)} />
          <stop offset="1" stopColor={tint(color, 0.42)} />
        </linearGradient>
        <linearGradient id={`${gid}-back`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={tint(color, -0.22)} />
          <stop offset="1" stopColor={tint(color, 0.12)} />
        </linearGradient>
        <linearGradient id={`${gid}-leaf`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={LEAF_DARK} />
          <stop offset="1" stopColor="#93C79A" />
        </linearGradient>
        <radialGradient id={`${gid}-center`} cx=".4" cy=".35" r=".7">
          <stop offset="0" stopColor="#FFE7A3" />
          <stop offset="1" stopColor="#F2B53D" />
        </radialGradient>
        <radialGradient id={`${gid}-glow`}>
          <stop offset="0" stopColor={tint(color, 0.55)} stopOpacity=".75" />
          <stop offset="1" stopColor={tint(color, 0.55)} stopOpacity="0" />
        </radialGradient>
      </defs>

      {ground && <ellipse cx="60" cy={BASE_Y + 1} rx="30" ry="4.5" fill="rgba(76, 52, 40, 0.12)" />}

      {/* Brillo: regada hoy */}
      {fresh && stage >= 3 && <circle className="fl-glow" cx="60" cy={top - 6} r="38" fill={`url(#${gid}-glow)`} />}

      {stage === 0 && (
        <g className="fl-flower-head">
          <path d={`M44 ${BASE_Y} Q60 ${BASE_Y - 14} 76 ${BASE_Y}Z`} fill="#D8C0A6" />
          <ellipse cx="60" cy={BASE_Y - 6.5} rx="5" ry="3.6" fill="#9B6B47" transform={`rotate(-18 60 ${BASE_Y - 6.5})`} />
          <ellipse cx="58.6" cy={BASE_Y - 7.6} rx="1.6" ry="1" fill="#C89A74" />
        </g>
      )}

      {stage >= 1 && (
        <g transform={`rotate(${tilt} 60 ${BASE_Y})`} className="fl-flower-body">
          <Stem top={top} width={big ? 3.4 : 2.8} />

          {stage === 1 && (
            <g className="fl-flower-head">
              <Leaf x={60} y={top + 1} angle={-35} size={0.62} flip gid={gid} />
              <Leaf x={60} y={top + 1} angle={-35} size={0.62} gid={gid} />
            </g>
          )}

          {stage >= 2 && (
            <>
              <Leaf x={59} y={140} angle={-32} size={big ? 1.12 : 0.92} flip gid={gid} />
              <Leaf x={61} y={stage >= 3 ? 120 : 122} angle={-28} size={big ? 1 : 0.82} gid={gid} />
            </>
          )}

          {stage === 2 && <circle className="fl-flower-head" cx="60" cy={top} r="3.6" fill={LEAF} />}

          {stage === 3 && (
            <g className="fl-flower-head" transform={`translate(60 ${top + 4})`}>
              <path d={petalPath(24, 11)} fill={`url(#${gid}-petal)`} />
              <path d={petalPath(18, 7)} fill={`url(#${gid}-back)`} transform="rotate(-16)" opacity=".9" />
              <path d="M-8 1 Q-4 -9 0 -10 Q4 -9 8 1 Q0 5 -8 1Z" fill={LEAF} />
            </g>
          )}

          {big && (
            <g className="fl-flower-head">
              <Bloom x={60} y={top} l={stage === 5 ? 25 : 21} n={stage === 5 ? 8 : 6} closed={waiting} gid={gid} />
            </g>
          )}
        </g>
      )}

      {/* En plena floración brotan dos flores pequeñas */}
      {stage === 5 && (
        <g className="fl-flower-extra">
          <path d={`M60 ${BASE_Y} C46 ${BASE_Y - 8} 32 ${BASE_Y - 18} 28 128`} stroke={LEAF_DARK} strokeWidth="2.2" fill="none" />
          <Bloom x={28} y={126} l={10} n={5} closed={waiting} gid={gid} />
          <path d={`M60 ${BASE_Y} C74 ${BASE_Y - 6} 88 ${BASE_Y - 14} 93 134`} stroke={LEAF_DARK} strokeWidth="2.2" fill="none" />
          <Bloom x={93} y={132} l={9} n={5} closed={waiting} gid={gid} />
        </g>
      )}

      {/* Rocío: regada hoy */}
      {fresh && stage >= 1 && (
        <g className="fl-dew">
          <Drop x={stage >= 4 ? 30 : 40} y={top + 8} s={0.9} />
          <Drop x={stage >= 4 ? 92 : 82} y={top - 4} s={0.75} />
          <Drop x={stage >= 4 ? 88 : 80} y={top + 30} s={0.6} />
        </g>
      )}
    </svg>
  )
}
