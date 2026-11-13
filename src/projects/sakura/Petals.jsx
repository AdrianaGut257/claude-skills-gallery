import { useEffect, useRef } from 'react'

/**
 * Pétalos de cerezo que caen sobre la portada.
 * animation-performance: un solo <canvas> con su propio bucle (nada de estado de React por fotograma),
 * densidad de píxeles limitada a 2, pausa fuera de pantalla y con la pestaña oculta.
 * Con "reducir movimiento" se dibujan una vez, quietos.
 */
const COLORS = ['#ffb3d6', '#ff8fc7', '#ffd6ea', '#fff1f8']

function makePetal(w, h, anywhere) {
  return {
    x: Math.random() * w,
    y: anywhere ? Math.random() * h : -20 - Math.random() * h * 0.3,
    size: 7 + Math.random() * 9,
    fall: 22 + Math.random() * 30, // px/s
    drift: 10 + Math.random() * 18,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.6 + Math.random() * 0.9,
    spin: Math.random() * Math.PI * 2,
    spinSpeed: (Math.random() - 0.5) * 1.6,
    flip: Math.random() * Math.PI * 2,
    flipSpeed: 1.2 + Math.random() * 2.2,
    vx: 0,
    color: COLORS[(Math.random() * COLORS.length) | 0],
    depth: 0.55 + Math.random() * 0.45,
  }
}

function drawPetal(ctx, p) {
  const s = p.size * p.depth
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.spin)
  ctx.scale(Math.cos(p.flip), 1) // giro 3D: el pétalo se ve de canto y vuelve
  ctx.globalAlpha = 0.55 + p.depth * 0.45
  ctx.fillStyle = p.color
  ctx.beginPath()
  ctx.moveTo(0, -s)
  ctx.bezierCurveTo(s * 0.9, -s * 0.8, s * 0.7, s * 0.6, 0, s)
  ctx.bezierCurveTo(-s * 0.7, s * 0.6, -s * 0.9, -s * 0.8, 0, -s)
  // la muesca de la punta, que hace que se lea como pétalo de cerezo
  ctx.moveTo(0, -s)
  ctx.lineTo(-s * 0.18, -s * 1.12)
  ctx.lineTo(0, -s * 0.9)
  ctx.lineTo(s * 0.18, -s * 1.12)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

export default function Petals({ count = 46 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let petals = []
    let raf = 0
    let last = 0
    let visible = true
    const wind = { x: 0, px: null, py: null, t: 0 }

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = w < 600 ? Math.round(count * 0.55) : count
      if (petals.length !== n) petals = Array.from({ length: n }, () => makePetal(w, h, true))
      if (reduce) render()
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of petals) drawPetal(ctx, p)
    }

    const tick = (now) => {
      const dt = Math.min((now - (last || now)) / 1000, 0.05)
      last = now
      wind.x *= 0.96 // la ráfaga se calma sola
      for (const p of petals) {
        p.sway += p.swaySpeed * dt
        p.flip += p.flipSpeed * dt
        p.spin += p.spinSpeed * dt
        p.vx += (wind.x * p.depth - p.vx) * Math.min(dt * 2.5, 1)
        p.x += (Math.sin(p.sway) * p.drift + p.vx) * dt
        p.y += p.fall * p.depth * dt
        if (p.y > h + 24 || p.x < -40 || p.x > w + 40) Object.assign(p, makePetal(w, h, false), { x: Math.random() * w })
      }
      render()
      raf = visible && !document.hidden ? requestAnimationFrame(tick) : 0
    }

    const start = () => {
      if (reduce || raf) return
      last = 0
      raf = requestAnimationFrame(tick)
    }

    // El ratón sopla: la velocidad horizontal del puntero se vuelve viento.
    const onMove = (e) => {
      if (wind.px !== null) {
        const dt = Math.max(e.timeStamp - wind.t, 8)
        const v = ((e.clientX - wind.px) / dt) * 1000
        wind.x = Math.max(-260, Math.min(260, wind.x + v * 0.08))
      }
      wind.px = e.clientX
      wind.py = e.clientY
      wind.t = e.timeStamp
    }

    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
    })
    io.observe(canvas)
    const onVisibility = () => !document.hidden && start()
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pointermove', onMove, { passive: true })
    start()

    return () => {
      cancelAnimationFrame(raf)
      raf = 0
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onMove)
    }
  }, [count])

  return <canvas ref={ref} className="sk-petals" aria-hidden="true" />
}
