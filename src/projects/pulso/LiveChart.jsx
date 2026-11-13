import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { fmt } from './data.js'
import { useLiveSeries } from './live.js'

const H = 200
const PAD = { top: 16, right: 56, bottom: 24, left: 8 }
const INTERVAL = 2000

/**
 * Peticiones por minuto a la API, en vivo.
 * animate: movimiento constante → curva lineal. Cada dato nuevo entra por la derecha y la línea
 * se desliza un paso durante los 2 s hasta el siguiente, así el gráfico nunca salta.
 * La cifra actual no se anima: es un dato que se lee.
 */
export default function LiveChart({ compact = false }) {
  const wrapRef = useRef(null)
  const lineRef = useRef(null)
  const [width, setWidth] = useState(640)
  const { points, tick } = useLiveSeries(wrapRef, { interval: INTERVAL })

  useLayoutEffect(() => {
    const el = wrapRef.current
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const h = compact ? 150 : H
  const innerW = Math.max(width - PAD.left - PAD.right, 50)
  const innerH = h - PAD.top - PAD.bottom
  const step = innerW / (points.length - 2) // un punto de margen a la derecha para el deslizamiento
  const min = 150
  const max = 800
  const y = (v) => PAD.top + innerH - ((v - min) / (max - min)) * innerH
  const x = (i) => PAD.left + i * step

  const line = points.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const area = `${line} L${x(points.length - 1).toFixed(1)},${PAD.top + innerH} L${PAD.left},${PAD.top + innerH} Z`
  // El borde derecho del gráfico enseña el penúltimo punto; el último espera fuera, listo para entrar.
  const last = points[points.length - 2]
  const prev = points[points.length - 3]
  const lastY = y(last)
  const dotRef = useRef(null)

  useEffect(() => {
    if (!tick || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timing = { duration: INTERVAL, easing: 'linear' }
    const a = lineRef.current?.animate([{ transform: `translateX(${step}px)` }, { transform: 'translateX(0)' }], timing)
    // el punto sube o baja a la vez que la línea pasa por debajo
    const b = dotRef.current?.animate(
      [{ transform: `translateY(${y(prev) - y(last)}px)` }, { transform: 'translateY(0)' }],
      timing,
    )
    return () => {
      a?.cancel()
      b?.cancel()
    }
    // y() depende solo del alto; tick marca cada dato nuevo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, step])

  const avg = Math.round(points.reduce((s, v) => s + v, 0) / points.length)

  return (
    <div className="gs-live" ref={wrapRef}>
      <svg
        width={width}
        height={h}
        role="img"
        aria-label={`Peticiones por minuto a la API en los últimos ${points.length * 2} segundos. Ahora: ${fmt(last)}. Media: ${fmt(avg)}.`}
      >
        <defs>
          <clipPath id={`gs-clip-${compact ? 'c' : 'f'}`}>
            <rect x={PAD.left} y={0} width={innerW} height={h} />
          </clipPath>
          <linearGradient id={`gs-area-${compact ? 'c' : 'f'}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--gs-pink)" stopOpacity="0.28" />
            <stop offset="1" stopColor="var(--gs-pink)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[250, 500, 750].map((v) => (
          <g key={v}>
            <line x1={PAD.left} x2={PAD.left + innerW} y1={y(v)} y2={y(v)} className="gs-live-grid" />
            <text x={PAD.left + innerW + 8} y={y(v) + 4} className="gs-live-axis">
              {v}
            </text>
          </g>
        ))}
        <g clipPath={`url(#gs-clip-${compact ? 'c' : 'f'})`}>
          <g ref={lineRef}>
            <path d={area} fill={`url(#gs-area-${compact ? 'c' : 'f'})`} />
            <path d={line} className="gs-live-line" />
          </g>
        </g>
        <circle ref={dotRef} cx={x(points.length - 2)} cy={lastY} r="4.5" className="gs-live-dot" />
        <text x={PAD.left + innerW + 8} y={Math.min(Math.max(lastY + 4, 14), h - 28)} className="gs-live-now">
          {fmt(last)}
        </text>
      </svg>
    </div>
  )
}
