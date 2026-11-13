import { useId } from 'react'

// Cartel geométrico para cada anime inventado: cielo en degradado, un suelo y un motivo.
// Es geometría exacta en SVG, no un dibujo que imite una ilustración.

function Motif({ motif, accent, ground }) {
  switch (motif) {
    case 'sun':
      return (
        <>
          <circle cx="150" cy="260" r="92" fill={accent} opacity="0.92" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="40" y={270 + i * 16} width="220" height={6 - i} fill={ground} />
          ))}
        </>
      )
    case 'moon':
      return (
        <>
          <circle cx="196" cy="118" r="54" fill={accent} />
          <circle cx="218" cy="102" r="50" fill="var(--sk-cover-sky2)" />
          {[60, 104, 148, 192, 236].map((x, i) => (
            <g key={x}>
              <line x1={x} y1="0" x2={x} y2={210 + (i % 2) * 26} stroke={accent} strokeWidth="1.2" opacity="0.6" />
              <rect x={x - 9} y={210 + (i % 2) * 26} width="18" height="26" rx="6" fill={accent} opacity="0.9" />
            </g>
          ))}
        </>
      )
    case 'grid':
      return (
        <>
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`v${i}`} x1="150" y1="250" x2={-150 + i * 75} y2="420" stroke={accent} strokeWidth="1.5" opacity="0.7" />
          ))}
          {[268, 292, 324, 366, 418].map((y) => (
            <line key={y} x1="0" y1={y} x2="300" y2={y} stroke={accent} strokeWidth="1.5" opacity="0.7" />
          ))}
          <path d="M70 250 L150 120 L230 250 Z" fill={ground} />
          <path d="M150 120 L178 166 L122 166 Z" fill={accent} />
        </>
      )
    case 'stars':
      return (
        <>
          {[
            [40, 60, 3], [92, 40, 2], [140, 90, 3.5], [210, 50, 2.5], [258, 110, 3], [70, 140, 2],
            [182, 150, 2], [236, 190, 3.5], [30, 210, 2.5], [120, 200, 2],
          ].map(([x, y, r]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={accent} />
          ))}
          <path d="M150 300 a70 70 0 0 1 140 0 v120 h-140 Z" fill={accent} opacity="0.95" />
          <rect x="196" y="322" width="48" height="60" rx="6" fill="var(--sk-cover-sky1)" />
        </>
      )
    case 'arc':
      return (
        <>
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${20 + i * 18} 330 Q 150 ${60 + i * 34} ${280 - i * 18} 330`}
              fill="none"
              stroke={accent}
              strokeWidth={4 - i}
              strokeDasharray={i ? '6 8' : undefined}
            />
          ))}
          <path d="M226 92 l26 -26 l10 10 l-26 26 Z" fill={accent} />
          <circle cx="222" cy="98" r="9" fill={ground} />
        </>
      )
    case 'ripple':
      return (
        <>
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse key={i} cx="150" cy="300" rx={30 + i * 34} ry={10 + i * 11} fill="none" stroke={accent} strokeWidth="1.5" opacity={1 - i * 0.17} />
          ))}
          <path d="M150 300 L150 120" stroke={accent} strokeWidth="1.5" />
          <circle cx="150" cy="112" r="12" fill={accent} />
        </>
      )
    case 'planet':
      return (
        <>
          <circle cx="150" cy="170" r="70" fill={ground} />
          <ellipse cx="150" cy="170" rx="122" ry="26" fill="none" stroke={accent} strokeWidth="5" transform="rotate(-14 150 170)" />
          <rect x="88" y="300" width="124" height="70" rx="10" fill={accent} />
          <line x1="150" y1="300" x2="150" y2="370" stroke={ground} strokeWidth="4" />
          <line x1="88" y1="335" x2="212" y2="335" stroke={ground} strokeWidth="4" />
        </>
      )
    case 'rain':
      return (
        <>
          {Array.from({ length: 16 }, (_, i) => (
            <line key={i} x1={(i * 41) % 300} y1={(i * 67) % 260} x2={((i * 41) % 300) - 14} y2={((i * 67) % 260) + 38} stroke="#d9e4ff" strokeWidth="1.6" opacity="0.7" />
          ))}
          <path d="M80 270 a70 70 0 0 1 140 0 Z" fill={accent} />
          <line x1="150" y1="200" x2="150" y2="340" stroke={accent} strokeWidth="5" strokeLinecap="round" />
        </>
      )
    case 'slash':
      return (
        <>
          <path d="M-20 360 L320 120 L320 150 L-20 390 Z" fill={accent} />
          <path d="M-20 300 L320 60 L320 76 L-20 316 Z" fill={accent} opacity="0.55" />
          <circle cx="230" cy="250" r="34" fill={ground} />
        </>
      )
    case 'ears':
      return (
        <>
          <path d="M70 300 L100 200 L140 270 Z" fill={ground} />
          <path d="M230 300 L200 200 L160 270 Z" fill={ground} />
          <rect x="60" y="270" width="180" height="150" rx="40" fill={ground} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={40 + i * 60} y="60" width="38" height="110" rx="4" fill={accent} opacity={0.12 + i * 0.06} />
          ))}
        </>
      )
    case 'shards':
      return (
        <>
          <path d="M60 120 L130 90 L120 170 Z" fill={accent} opacity="0.95" />
          <path d="M170 60 L250 100 L190 150 Z" fill={accent} opacity="0.7" />
          <path d="M150 190 L240 220 L170 280 Z" fill={accent} opacity="0.85" />
          <path d="M40 230 L110 250 L70 300 Z" fill={accent} opacity="0.6" />
        </>
      )
    case 'burst':
      return (
        <>
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2
            return (
              <line key={i} x1={150 + Math.cos(a) * 22} y1={150 + Math.sin(a) * 22} x2={150 + Math.cos(a) * 88} y2={150 + Math.sin(a) * 88} stroke={accent} strokeWidth="3" strokeLinecap="round" />
            )
          })}
          <circle cx="150" cy="150" r="8" fill={accent} />
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2 + 0.3
            return <circle key={`d${i}`} cx={225 + Math.cos(a) * 36} cy={250 + Math.sin(a) * 36} r="3" fill="#8fd3ff" />
          })}
        </>
      )
    default:
      return null
  }
}

export default function Cover({ anime, className = '' }) {
  const uid = useId().replace(/:/g, '')
  const { sky, ground, motif, accent } = anime.art
  return (
    <svg
      className={`sk-cover ${className}`}
      viewBox="0 0 300 420"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Cartel de ${anime.title}`}
      style={{ '--sk-cover-sky1': sky[0], '--sk-cover-sky2': sky[1] }}
    >
      <defs>
        <linearGradient id={`sky${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="1" stopColor={sky[1]} />
        </linearGradient>
      </defs>
      <rect width="300" height="420" fill={`url(#sky${uid})`} />
      {['grid', 'sun', 'ripple', 'stars'].includes(motif) && <rect y="250" width="300" height="170" fill={ground} opacity={motif === 'stars' ? 0.35 : 1} />}
      <Motif motif={motif} accent={accent} ground={ground} />
    </svg>
  )
}
